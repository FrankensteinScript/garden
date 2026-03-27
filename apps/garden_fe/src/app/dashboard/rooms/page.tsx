"use client";

import { useState } from "react";
import { Plus, Thermometer, Droplets, Waves, MoreVertical, Pencil, Trash2 } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRooms } from "@/hooks/useRooms";
import { roomService } from "@/services/room.service";
import { useToast } from "@/components/ui/toast";
import type { Room, RoomCreateRequest, RoomUpdateRequest } from "@/types/api";

const defaultFormData: RoomCreateRequest = {
  name: "",
  description: "",
  temperature: 22,
  humidity: 50,
  waterLevel: 100,
};

function RoomFormFields({
  formData,
  setFormData,
}: {
  formData: RoomCreateRequest | RoomUpdateRequest;
  setFormData: (updater: (prev: any) => any) => void;
}) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="room-name">Nazev</Label>
        <Input
          id="room-name"
          value={formData.name ?? ""}
          onChange={(e) =>
            setFormData((prev: any) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Nazev mistnosti"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="room-description">Popis</Label>
        <textarea
          id="room-description"
          value={formData.description ?? ""}
          onChange={(e) =>
            setFormData((prev: any) => ({
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
            value={formData.temperature ?? 22}
            onChange={(e) =>
              setFormData((prev: any) => ({
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
            value={formData.humidity ?? 50}
            onChange={(e) =>
              setFormData((prev: any) => ({
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
            value={formData.waterLevel ?? 100}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                waterLevel: Number(e.target.value),
              }))
            }
          />
        </div>
      </div>
    </div>
  );
}

export default function RoomsPage() {
  const { data: rooms, loading, refetch } = useRooms();
  const { toast } = useToast();

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState<RoomCreateRequest>({ ...defaultFormData });

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editForm, setEditForm] = useState<RoomUpdateRequest>({});

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);

  const handleCreate = async () => {
    if (!createForm.name.trim()) {
      toast({ title: "Chyba", description: "Zadejte nazev mistnosti.", variant: "error" });
      return;
    }
    try {
      setCreating(true);
      await roomService.create(createForm);
      toast({
        title: "Mistnost vytvorena",
        description: `Mistnost "${createForm.name}" byla uspesne vytvorena.`,
        variant: "success",
      });
      setCreateOpen(false);
      setCreateForm({ ...defaultFormData });
      refetch();
    } catch {
      toast({ title: "Chyba", description: "Nepodarilo se vytvorit mistnost.", variant: "error" });
    } finally {
      setCreating(false);
    }
  };

  const openEdit = (room: Room) => {
    setEditingRoom(room);
    setEditForm({
      name: room.name,
      description: room.description,
      temperature: room.temperature,
      humidity: room.humidity,
      waterLevel: room.waterLevel,
    });
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editingRoom) return;
    if (!editForm.name?.trim()) {
      toast({ title: "Chyba", description: "Zadejte nazev mistnosti.", variant: "error" });
      return;
    }
    try {
      setEditing(true);
      await roomService.update(editingRoom.id, editForm);
      toast({
        title: "Mistnost upravena",
        description: `Mistnost "${editForm.name}" byla uspesne upravena.`,
        variant: "success",
      });
      setEditOpen(false);
      setEditingRoom(null);
      refetch();
    } catch {
      toast({ title: "Chyba", description: "Nepodarilo se upravit mistnost.", variant: "error" });
    } finally {
      setEditing(false);
    }
  };

  const openDelete = (room: Room) => {
    setDeletingRoom(room);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingRoom) return;
    try {
      setDeleting(true);
      await roomService.remove(deletingRoom.id);
      toast({
        title: "Mistnost smazana",
        description: `Mistnost "${deletingRoom.name}" byla smazana.`,
        variant: "success",
      });
      setDeleteOpen(false);
      setDeletingRoom(null);
      refetch();
    } catch {
      toast({ title: "Chyba", description: "Nepodarilo se smazat mistnost.", variant: "error" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Mistnosti</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Pridat mistnost
        </Button>
      </div>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova mistnost</DialogTitle>
            <DialogDescription>Vyplnte udaje pro novou mistnost</DialogDescription>
          </DialogHeader>
          <RoomFormFields formData={createForm} setFormData={setCreateForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreateOpen(false); setCreateForm({ ...defaultFormData }); }}>
              Zrusit
            </Button>
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? "Vytvarim..." : "Vytvorit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upravit mistnost</DialogTitle>
            <DialogDescription>Upravte udaje mistnosti</DialogDescription>
          </DialogHeader>
          <RoomFormFields formData={editForm} setFormData={setEditForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Zrusit
            </Button>
            <Button onClick={handleEdit} disabled={editing}>
              {editing ? "Ukladam..." : "Ulozit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Smazat mistnost</DialogTitle>
            <DialogDescription>
              Opravdu chcete smazat mistnost &quot;{deletingRoom?.name}&quot;?
              Tato akce je nevratna a smaze i vsechny bylinky v teto mistnosti.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Zrusit
            </Button>
            <Button
              variant="default"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Mazam..." : "Smazat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
          <p className="text-sm">Kliknete na &quot;Pridat mistnost&quot; pro vytvoreni prvni mistnosti.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Card key={room.id} className="relative">
              <div className="absolute right-2 top-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="rounded-md p-1 hover:bg-gray-100">
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(room)}>
                      <Pencil className="h-4 w-4" />
                      Upravit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 hover:!text-red-600"
                      onClick={() => openDelete(room)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Smazat
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
