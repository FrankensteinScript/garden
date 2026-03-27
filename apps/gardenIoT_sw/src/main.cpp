#include <Arduino.h>
#include <SimpleDHT.h>
#include <SoftwareSerial.h>
#include "config.h"

// Pin definitions
#define DHT_PIN 3
#define SOIL_MOISTURE_PIN A0
#define WATER_LEVEL_PIN A1
#define WATER_PUMP_RELAY_PIN 8
#define LIGHT_RELAY_PIN 7
#define LED_PIN 2
#define ESP_RX 10
#define ESP_TX 11

// Timing
#define SENSOR_INTERVAL 30000  // 30 seconds between readings

SimpleDHT11 dht(DHT_PIN);
SoftwareSerial espSerial(ESP_RX, ESP_TX);

// Buffer for ESP responses
char espBuffer[512];
int bufferIndex = 0;

// Forward declarations
bool sendATCommand(const char* cmd, const char* expected, unsigned long timeout);
bool connectWiFi();
bool postSensorData(int temp, int humidity, int soilMoisture, int waterLevel);
void executePumpCommand(int durationSeconds);
void executeLightCommand(bool turnOn);

void setup() {
    Serial.begin(9600);
    Serial.println(F("Garden IoT Starting..."));

    // Pin modes
    pinMode(SOIL_MOISTURE_PIN, INPUT);
    pinMode(WATER_LEVEL_PIN, INPUT);
    pinMode(WATER_PUMP_RELAY_PIN, OUTPUT);
    pinMode(LIGHT_RELAY_PIN, OUTPUT);
    pinMode(LED_PIN, OUTPUT);

    // Relays off at start
    digitalWrite(WATER_PUMP_RELAY_PIN, LOW);
    digitalWrite(LIGHT_RELAY_PIN, LOW);
    digitalWrite(LED_PIN, LOW);

    // Initialize ESP8266
    espSerial.begin(9600);
    delay(1000);

    // Reset ESP
    sendATCommand("AT+RST", "ready", 5000);
    delay(2000);

    // Set WiFi mode to station
    sendATCommand("AT+CWMODE=1", "OK", 3000);

    // Connect to WiFi
    if (connectWiFi()) {
        Serial.println(F("WiFi connected!"));
        sendATCommand("AT+CIFSR", "OK", 3000);
    } else {
        Serial.println(F("WiFi connection failed!"));
    }
}

void loop() {
    // Read DHT11
    byte temperature = 0;
    byte humidity = 0;
    int err = dht.read(&temperature, &humidity, NULL);
    if (err != SimpleDHTErrSuccess) {
        Serial.print(F("DHT11 error: "));
        Serial.println(err);
        delay(2000);
        return;
    }

    // Read soil moisture (capacitive: 1023=dry, ~300=wet)
    int rawSoil = analogRead(SOIL_MOISTURE_PIN);
    int soilMoisture = map(rawSoil, 1023, 300, 0, 100);
    soilMoisture = constrain(soilMoisture, 0, 100);

    // Read water level (0=empty, ~600=full)
    int rawWater = analogRead(WATER_LEVEL_PIN);
    int waterLevel = map(rawWater, 0, 600, 0, 100);
    waterLevel = constrain(waterLevel, 0, 100);

    // Debug output
    Serial.print(F("T:"));
    Serial.print((int)temperature);
    Serial.print(F("C H:"));
    Serial.print((int)humidity);
    Serial.print(F("% Soil:"));
    Serial.print(soilMoisture);
    Serial.print(F("% Water:"));
    Serial.print(waterLevel);
    Serial.println(F("%"));

    // Send data to backend
    postSensorData((int)temperature, (int)humidity, soilMoisture, waterLevel);

    delay(SENSOR_INTERVAL);
}

bool sendATCommand(const char* cmd, const char* expected, unsigned long timeout) {
    espSerial.println(cmd);
    Serial.print(F("AT> "));
    Serial.println(cmd);

    unsigned long start = millis();
    bufferIndex = 0;
    memset(espBuffer, 0, sizeof(espBuffer));

    while (millis() - start < timeout) {
        while (espSerial.available()) {
            char c = espSerial.read();
            if (bufferIndex < (int)sizeof(espBuffer) - 1) {
                espBuffer[bufferIndex++] = c;
                espBuffer[bufferIndex] = '\0';
            }
        }
        if (strstr(espBuffer, expected)) {
            return true;
        }
    }
    Serial.print(F("AT timeout: "));
    Serial.println(espBuffer);
    return false;
}

bool connectWiFi() {
    char cmd[128];
    snprintf(cmd, sizeof(cmd), "AT+CWJAP=\"%s\",\"%s\"", WIFI_SSID, WIFI_PASS);
    return sendATCommand(cmd, "OK", 15000);
}

bool postSensorData(int temp, int humidity, int soilMoisture, int waterLevel) {
    // Build JSON body
    char body[256];
    snprintf(body, sizeof(body),
        "{\"roomId\":\"%s\",\"temperature\":%d,\"humidity\":%d,\"soilMoisture\":%d,\"waterLevel\":%d}",
        ROOM_ID, temp, humidity, soilMoisture, waterLevel);

    int bodyLen = strlen(body);

    // Build HTTP request
    char httpReq[512];
    snprintf(httpReq, sizeof(httpReq),
        "POST /sensor-data HTTP/1.1\r\n"
        "Host: %s:%s\r\n"
        "Content-Type: application/json\r\n"
        "x-api-key: %s\r\n"
        "Content-Length: %d\r\n"
        "Connection: close\r\n\r\n%s",
        SERVER_HOST, SERVER_PORT, API_KEY, bodyLen, body);

    int totalLen = strlen(httpReq);

    // Connect to server
    char connectCmd[128];
    snprintf(connectCmd, sizeof(connectCmd),
        "AT+CIPSTART=\"TCP\",\"%s\",%s", SERVER_HOST, SERVER_PORT);

    if (!sendATCommand(connectCmd, "OK", 5000)) {
        Serial.println(F("TCP connect failed"));
        return false;
    }

    // Send data length
    char sendCmd[32];
    snprintf(sendCmd, sizeof(sendCmd), "AT+CIPSEND=%d", totalLen);
    if (!sendATCommand(sendCmd, ">", 3000)) {
        Serial.println(F("CIPSEND failed"));
        sendATCommand("AT+CIPCLOSE", "OK", 2000);
        return false;
    }

    // Send HTTP request
    espSerial.print(httpReq);

    // Wait for response
    unsigned long start = millis();
    bufferIndex = 0;
    memset(espBuffer, 0, sizeof(espBuffer));

    while (millis() - start < 10000) {
        while (espSerial.available()) {
            char c = espSerial.read();
            if (bufferIndex < (int)sizeof(espBuffer) - 1) {
                espBuffer[bufferIndex++] = c;
                espBuffer[bufferIndex] = '\0';
            }
        }
        if (strstr(espBuffer, "CLOSED")) break;
    }

    Serial.println(F("Response received"));

    // Parse pump command from response
    char* pumpPtr = strstr(espBuffer, "\"pendingPumpCommand\":");
    if (pumpPtr && !strstr(pumpPtr, "null")) {
        // Extract duration
        int duration = 5; // default
        char* durPtr = strstr(pumpPtr, "\"durationSeconds\":");
        if (durPtr) {
            duration = atoi(durPtr + 18);
            if (duration <= 0) duration = 5;
        }

        // Check action
        if (strstr(pumpPtr, "\"on\"")) {
            Serial.print(F("Pump ON for "));
            Serial.print(duration);
            Serial.println(F("s"));
            executePumpCommand(duration);
        }
    }

    // Parse light command from response
    char* lightPtr = strstr(espBuffer, "\"pendingLightCommand\":");
    if (lightPtr && !strstr(lightPtr, "null")) {
        if (strstr(lightPtr, "\"action\":\"on\"")) {
            Serial.println(F("Light ON"));
            executeLightCommand(true);
        } else if (strstr(lightPtr, "\"action\":\"off\"")) {
            Serial.println(F("Light OFF"));
            executeLightCommand(false);
        }
    }

    return true;
}

void executePumpCommand(int durationSeconds) {
    digitalWrite(WATER_PUMP_RELAY_PIN, HIGH);
    delay((unsigned long)durationSeconds * 1000);
    digitalWrite(WATER_PUMP_RELAY_PIN, LOW);
    Serial.println(F("Pump OFF"));
}

void executeLightCommand(bool turnOn) {
    if (turnOn) {
        digitalWrite(LIGHT_RELAY_PIN, HIGH);
        digitalWrite(LED_PIN, HIGH);
        Serial.println(F("Light relay ON"));
    } else {
        digitalWrite(LIGHT_RELAY_PIN, LOW);
        digitalWrite(LED_PIN, LOW);
        Serial.println(F("Light relay OFF"));
    }
}
