'use client';

import { useState } from 'react';
import { BarChart3 } from 'lucide-react';

import { useRooms } from '@/hooks/useRooms';
import { useChartData, type TimeRange } from '@/hooks/useChartData';
import { TemperatureChart } from '@/components/charts/TemperatureChart';
import { HumidityChart } from '@/components/charts/HumidityChart';
import { SoilMoistureChart } from '@/components/charts/SoilMoistureChart';
import { WaterLevelChart } from '@/components/charts/WaterLevelChart';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { SensorReading } from '@/types/api';

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: '24h', label: '24 hodin' },
  { value: '7d', label: '7 dni' },
  { value: '30d', label: '30 dni' },
  { value: 'custom', label: 'Vlastni' },
];

function formatTime(dateStr: string, range: TimeRange): string {
  const date = new Date(dateStr);
  if (range === '24h') {
    return date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
  }
  if (range === '7d') {
    return date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' }) +
      ' ' + date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' });
}

function toChartData(readings: SensorReading[], key: keyof SensorReading, range: TimeRange) {
  return readings.map((r) => ({
    time: formatTime(r.createdAt, range),
    value: r[key] as number,
  }));
}

export default function GrafyPage() {
  const { data: rooms, loading: roomsLoading } = useRooms();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const roomId = selectedRoomId ?? (rooms.length > 0 ? rooms[0].id : null);

  const { data: sensorData, loading: dataLoading } = useChartData(
    roomId,
    timeRange,
    customFrom,
    customTo
  );

  const chartHeight = 300;
  const isLoading = roomsLoading || dataLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <BarChart3 className="h-7 w-7 text-green-600" />
          Grafy
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Historicka data ze senzoru
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 p-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Mistnost</label>
            <select
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              value={roomId ?? ''}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              disabled={roomsLoading}
            >
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Obdobi</label>
            <div className="flex gap-1">
              {TIME_RANGES.map((tr) => (
                <Button
                  key={tr.value}
                  variant={timeRange === tr.value ? 'default' : 'outline'}
                  size="sm"
                  className={
                    timeRange === tr.value
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : ''
                  }
                  onClick={() => setTimeRange(tr.value)}
                >
                  {tr.label}
                </Button>
              ))}
            </div>
          </div>

          {timeRange === 'custom' && (
            <div className="flex items-end gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Od</label>
                <input
                  type="date"
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Do</label>
                <input
                  type="date"
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[380px] rounded-xl" />
          ))}
        </div>
      ) : !roomId ? (
        <Card>
          <CardContent className="flex h-[300px] items-center justify-center text-sm text-gray-500">
            Zadna mistnost k zobrazeni
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <TemperatureChart
            data={toChartData(sensorData, 'temperature', timeRange)}
            height={chartHeight}
          />
          <HumidityChart
            data={toChartData(sensorData, 'humidity', timeRange)}
            height={chartHeight}
          />
          <SoilMoistureChart
            data={toChartData(sensorData, 'soilMoisture', timeRange)}
            height={chartHeight}
          />
          <WaterLevelChart
            data={toChartData(sensorData, 'waterLevel', timeRange)}
            height={chartHeight}
          />
        </div>
      )}
    </div>
  );
}
