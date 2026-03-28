"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Leaf,
  Thermometer,
  Droplets,
  Droplet,
  MoreVertical,
  Pencil,
  Trash2,
  ImagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { useHerbs } from "@/hooks/useHerbs";
import { useRooms } from "@/hooks/useRooms";
import { herbService } from "@/services/herb.service";
import { useToast } from "@/components/ui/toast";
import type { Herb, HerbCreateRequest, HerbUpdateRequest, PlantType } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const PLANT_TYPE_LABELS: Record<PlantType, string> = {
  herb: "Bylinka",
  flower: "Kvetina",
  vegetable: "Zelenina",
  fruit: "Ovoce",
  other: "Ostatni",
};

const PLANT_TYPE_COLORS: Record<PlantType, string> = {
  herb: "bg-green-100 text-green-800",
  flower: "bg-pink-100 text-pink-800",
  vegetable: "bg-orange-100 text-orange-800",
  fruit: "bg-purple-100 text-purple-800",
  other: "bg-gray-100 text-gray-800",
};

function getStatus(herb: Herb): { color: string; label: string } {
  if (herb.soilMoisture < 20 || herb.temperature > 35 || herb.temperature < 5) {
    return { color: "bg-red-500", label: "Kriticke" };
  }
  if (herb.soilMoisture < 40 || herb.temperature > 30 || herb.temperature < 10) {
    return { color: "bg-yellow-500", label: "Varovani" };
  }
  return { color: "bg-green-500", label: "V poradku" };
}

interface HerbFormData {
  name: string;
  description: string;
  plantType: PlantType;
  roomId: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
}

const defaultFormData: HerbFormData = {
  name: "",
  description: "",
  plantType: "herb",
  roomId: "",
  temperature: 22,
  humidity: 50,
  soilMoisture: 40,
};

function HerbFormFields({
  formData,
  setFormData,
  rooms,
}: {
  formData: HerbFormData;
  setFormData: (updater: (prev: HerbFormData) => HerbFormData) => void;
  rooms: { id: string; name: string }[];
}) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="herb-name">Nazev</Label>
        <Input
          id="herb-name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Nazev bylinky"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="herb-description">Popis</Label>
        <textarea
          id="herb-description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Popis bylinky"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="herb-plantType">Typ rostliny</Label>
          <select
            id="herb-plantType"
            value={formData.plantType}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                plantType: e.target.value as PlantType,
              }))
            }
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="herb">Bylinka</option>
            <option value="flower">Kvetina</option>
            <option value="vegetable">Zelenina</option>
            <option value="fruit">Ovoce</option>
            <option value="other">Ostatni</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="herb-room">Mistnost</Label>
          <select
            id="herb-room"
            value={formData.roomId}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, roomId: e.target.value }))
            }
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Vyberte mistnost</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="herb-temp">Teplota (°C)</Label>
          <Input
            id="herb-temp"
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
          <Label htmlFor="herb-humidity">Vlhkost (%)</Label>
          <Input
            id="herb-humidity"
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
          <Label htmlFor="herb-soil">Vlhkost pudy (%)</Label>
          <Input
            id="herb-soil"
            type="number"
            value={formData.soilMoisture}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                soilMoisture: Number(e.target.value),
              }))
            }
          />
        </div>
      </div>
    </div>
  );
}

export default function HerbsPage() {
  const router = useRouter();
  const { data: herbs, loading, refetch } = useHerbs();
  const { data: rooms } = useRooms();
  const { toast } = useToast();

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState<HerbFormData>({
    ...defaultFormData,
  });
  const [createImage, setCreateImage] = useState<File | null>(null);
  const createImageRef = useRef<HTMLInputElement>(null);

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingHerb, setEditingHerb] = useState<Herb | null>(null);
  const [editForm, setEditForm] = useState<HerbFormData>({ ...defaultFormData });

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingHerb, setDeletingHerb] = useState<Herb | null>(null);

  const handleCreate = async () => {
    if (!createForm.name.trim()) {
      toast({
        title: "Chyba",
        description: "Zadejte nazev bylinky.",
        variant: "error",
      });
      return;
    }
    if (!createForm.roomId) {
      toast({
        title: "Chyba",
        description: "Vyberte mistnost.",
        variant: "error",
      });
      return;
    }
    try {
      setCreating(true);
      const requestData: HerbCreateRequest = {
        name: createForm.name,
        description: createForm.description,
        temperature: createForm.temperature,
        humidity: createForm.humidity,
        soilMoisture: createForm.soilMoisture,
        lastWatering: new Date().toISOString(),
        plantType: createForm.plantType,
        roomId: createForm.roomId,
        growConditionId: "",
      };
      const created = await herbService.create(requestData);

      if (createImage) {
        await herbService.uploadImage(created.id, createImage);
      }

      toast({
        title: "Bylinka vytvorena",
        description: `Bylinka "${createForm.name}" byla uspesne vytvorena.`,
        variant: "success",
      });
      setCreateOpen(false);
      setCreateForm({ ...defaultFormData });
      setCreateImage(null);
      refetch();
    } catch {
      toast({
        title: "Chyba",
        description: "Nepodarilo se vytvorit bylinku.",
        variant: "error",
      });
    } finally {
      setCreating(false);
    }
  };

  const openEdit = (herb: Herb) => {
    setEditingHerb(herb);
    setEditForm({
      name: herb.name,
      description: herb.description,
      plantType: herb.plantType || "herb",
      roomId: herb.roomId || "",
      temperature: herb.temperature,
      humidity: herb.humidity,
      soilMoisture: herb.soilMoisture,
    });
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editingHerb) return;
    if (!editForm.name?.trim()) {
      toast({
        title: "Chyba",
        description: "Zadejte nazev bylinky.",
        variant: "error",
      });
      return;
    }
    try {
      setEditing(true);
      const updateData: HerbUpdateRequest = {
        name: editForm.name,
        description: editForm.description,
        temperature: editForm.temperature,
        humidity: editForm.humidity,
        soilMoisture: editForm.soilMoisture,
        plantType: editForm.plantType,
        roomId: editForm.roomId || undefined,
      };
      await herbService.update(editingHerb.id, updateData);
      toast({
        title: "Bylinka upravena",
        description: `Bylinka "${editForm.name}" byla uspesne upravena.`,
        variant: "success",
      });
      setEditOpen(false);
      setEditingHerb(null);
      refetch();
    } catch {
      toast({
        title: "Chyba",
        description: "Nepodarilo se upravit bylinku.",
        variant: "error",
      });
    } finally {
      setEditing(false);
    }
  };

  const openDelete = (herb: Herb) => {
    setDeletingHerb(herb);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingHerb) return;
    try {
      setDeleting(true);
      await herbService.remove(deletingHerb.id);
      toast({
        title: "Bylinka smazana",
        description: `Bylinka "${deletingHerb.name}" byla smazana.`,
        variant: "success",
      });
      setDeleteOpen(false);
      setDeletingHerb(null);
      refetch();
    } catch {
      toast({
        title: "Chyba",
        description: "Nepodarilo se smazat bylinku.",
        variant: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  const roomMap = Object.fromEntries(rooms.map((r) => [r.id, r.name]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Bylinky</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Pridat bylinku
        </Button>
      </div>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova bylinka</DialogTitle>
            <DialogDescription>
              Vyplnte udaje pro novou bylinku
            </DialogDescription>
          </DialogHeader>
          <HerbFormFields
            formData={createForm}
            setFormData={setCreateForm}
            rooms={rooms}
          />
          <div className="space-y-2">
            <Label>Obrazek</Label>
            <div className="flex items-center gap-2">
              <input
                ref={createImageRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setCreateImage(file);
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => createImageRef.current?.click()}
              >
                <ImagePlus className="h-4 w-4 mr-2" />
                {createImage ? createImage.name : "Vybrat obrazek"}
              </Button>
              {createImage && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setCreateImage(null)}
                >
                  Odebrat
                </Button>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateOpen(false);
                setCreateForm({ ...defaultFormData });
                setCreateImage(null);
              }}
            >
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
            <DialogTitle>Upravit bylinku</DialogTitle>
            <DialogDescription>Upravte udaje bylinky</DialogDescription>
          </DialogHeader>
          <HerbFormFields
            formData={editForm}
            setFormData={setEditForm}
            rooms={rooms}
          />
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
            <DialogTitle>Smazat bylinku</DialogTitle>
            <DialogDescription>
              Opravdu chcete smazat bylinku &quot;{deletingHerb?.name}&quot;?
              Tato akce je nevratna.
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
      ) : herbs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Leaf className="h-12 w-12 mb-4 text-green-300" />
          <p className="text-lg">Zatim nemate zadne bylinky</p>
          <p className="text-sm">
            Kliknete na &quot;Pridat bylinku&quot; pro vytvoreni prvni bylinky.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {herbs.map((herb) => {
            const status = getStatus(herb);
            return (
              <Card
                key={herb.id}
                className="relative cursor-pointer transition-shadow hover:shadow-lg overflow-hidden"
                onClick={() => router.push(`/dashboard/herb/${herb.id}`)}
              >
                {/* Image or placeholder */}
                <div className="h-40 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center overflow-hidden">
                  {herb.imageUrl ? (
                    <img
                      src={`${API_URL}${herb.imageUrl}`}
                      alt={herb.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Leaf className="h-16 w-16 text-green-200" />
                  )}
                </div>

                {/* Dropdown menu */}
                <div
                  className="absolute right-2 top-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger className="rounded-md p-1 bg-white/80 hover:bg-white shadow-sm">
                      <MoreVertical className="h-4 w-4 text-gray-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(herb)}>
                        <Pencil className="h-4 w-4" />
                        Upravit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 hover:!text-red-600"
                        onClick={() => openDelete(herb)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Smazat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{herb.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={
                          PLANT_TYPE_COLORS[herb.plantType || "herb"]
                        }
                      >
                        {PLANT_TYPE_LABELS[herb.plantType || "herb"]}
                      </Badge>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${status.color}`}
                        />
                        {status.label}
                      </span>
                    </div>
                  </div>
                  {herb.roomId && roomMap[herb.roomId] && (
                    <CardDescription>{roomMap[herb.roomId]}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Droplet className="h-4 w-4 text-blue-500" />
                      {herb.soilMoisture}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Thermometer className="h-4 w-4 text-red-500" />
                      {herb.temperature}°C
                    </span>
                    <span className="flex items-center gap-1">
                      <Droplets className="h-4 w-4 text-cyan-500" />
                      {herb.humidity}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
