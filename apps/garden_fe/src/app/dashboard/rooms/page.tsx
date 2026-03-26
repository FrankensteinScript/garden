"use client";

import { useState } from "react";
import { Plus, Thermometer, Droplets, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRooms } from "@/hooks/useRooms";
import { roomService } from "@/services/room.service";
import { useToast } from "@/components/ui/toast";
import type { RoomCreateRequest } from "@/types/api";

export default function RoomsPage() {
  const { data: rooms, loading, refetch } = useRooms();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState<RoomCreateRequest>({
    name: "",
    description: "",
    temperature: 22,
    humidity: 50,
    waterLevel: 100,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      temperature: 22,
      humidity: 50,
      waterLevel: 100,
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Chyba",
        description: "Zadejte nazev mistnosti.",
        variant: "error",
      });
      return;
    }

    try {
      setCreating(true);
      await roomService.create(formData);
      toast({
        title: "Mistnost vytvorena",
        description: `Mistnost "${formData.name}" byla uspesne vytvorena.`,
        variant: "success",
      });
      setDialogOpen(false);
      resetForm();
      refetch();
    } catch {
      toast({
        title: "Chyba",
        description: "Nepodarilo se vytvorit mistnost.",
        variant: "error",
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Mistnosti</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Pridat mistnost
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova mistnost</DialogTitle>
              <DialogDescription>
                Vyplnte udaje pro novou mistnost
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="room-name">Nazev</Label>
                <Input
                  id="room-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Nazev mistnosti"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-description">Popis</Label>
                <textarea
                  id="room-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Popis mistnosti (volitelne)"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="room-temp">Teplota (°C)</Label>
                  <Input
                    id="room-temp"
                    type="number"
                    value={formData.temperature}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        temperature: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room-humidity">Vlhkost (%)</Label>
                  <Input
                    id="room-humidity"
                    type="number"
                    value={formData.humidity}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        humidity: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room-water">Hladina vody (%)</Label>
                  <Input
                    id="room-water"
                    type="number"
                    value={formData.waterLevel}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        waterLevel: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  resetForm();
                }}
              >
                Zrusit
              </Button>
              <Button onClick={handleSubmit} disabled={creating}>
                {creating ? "Vytvarim..." : "Vytvorit"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <p className="text-lg">Zatim nemáte zadne mistnosti</p>
          <p className="text-sm">Kliknete na "Pridat mistnost" pro vytvoreni prvni mistnosti.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Card key={room.id}>
              <CardHeader>
                <CardTitle>{room.name}</CardTitle>
                {room.description && (
                  <CardDescription>{room.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Thermometer className="h-4 w-4" />
                    <span>Teplota: {room.temperature} °C</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Droplets className="h-4 w-4" />
                    <span>Vlhkost: {room.humidity} %</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Waves className="h-4 w-4" />
                    <span>Hladina vody: {room.waterLevel} %</span>
                  </div>
                </div>
                {room.herbIds.length > 0 && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    {room.herbIds.length}{" "}
                    {room.herbIds.length === 1
                      ? "rostlina"
                      : room.herbIds.length >= 2 && room.herbIds.length <= 4
                        ? "rostliny"
                        : "rostlin"}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
