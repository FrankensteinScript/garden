"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Leaf,
  Droplet,
  Thermometer,
  Droplets,
  CalendarDays,
  Pencil,
  Trash2,
  ImagePlus,
} from "lucide-react";
import { herbService } from "@/services/herb.service";
import { historyService } from "@/services/history.service";
import { growConditionsService } from "@/services/growConditions.service";
import type {
  Herb,
  History,
  GrowConditions,
  PlantType,
  HerbUpdateRequest,
} from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { useToast } from "@/components/ui/toast";
import { WateringHistoryChart } from "@/components/charts/WateringHistoryChart";
import { HerbActions } from "@/components/herbs/HerbActions";

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

export default function HerbDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { toast } = useToast();

  const [herb, setHerb] = useState<Herb | null>(null);
  const [history, setHistory] = useState<History[]>([]);
  const [growConditions, setGrowConditions] = useState<GrowConditions | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    plantType: "herb" as PlantType,
    temperature: 22,
    humidity: 50,
    soilMoisture: 40,
  });

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [herbData, allHistory] = await Promise.all([
        herbService.getById(id),
        historyService.getAll(),
      ]);
      setHerb(herbData);
      setHistory(
        allHistory
          .filter((h) => h.herbId === id)
          .sort(
            (a, b) =>
              new Date(b.wateredAt).getTime() - new Date(a.wateredAt).getTime()
          )
      );

      if (herbData.growConditionId) {
        try {
          const gc = await growConditionsService.getById(
            herbData.growConditionId
          );
          setGrowConditions(gc);
        } catch {
          // grow conditions may not exist
        }
      }
    } catch {
      // handle error silently
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const openEdit = () => {
    if (!herb) return;
    setEditForm({
      name: herb.name,
      description: herb.description,
      plantType: herb.plantType || "herb",
      temperature: herb.temperature,
      humidity: herb.humidity,
      soilMoisture: herb.soilMoisture,
    });
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!herb) return;
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
      };
      await herbService.update(herb.id, updateData);
      toast({
        title: "Bylinka upravena",
        description: `Bylinka "${editForm.name}" byla uspesne upravena.`,
        variant: "success",
      });
      setEditOpen(false);
      fetchData();
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

  const handleDelete = async () => {
    if (!herb) return;
    try {
      setDeleting(true);
      await herbService.remove(herb.id);
      toast({
        title: "Bylinka smazana",
        description: `Bylinka "${herb.name}" byla smazana.`,
        variant: "success",
      });
      router.push("/dashboard/herbs");
    } catch {
      toast({
        title: "Chyba",
        description: "Nepodarilo se smazat bylinku.",
        variant: "error",
      });
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !herb) return;
    try {
      setUploading(true);
      await herbService.uploadImage(herb.id, file);
      toast({
        title: "Obrazek nahran",
        description: "Obrazek bylinky byl uspesne nahran.",
        variant: "success",
      });
      fetchData();
    } catch {
      toast({
        title: "Chyba",
        description: "Nepodarilo se nahrat obrazek.",
        variant: "error",
      });
    } finally {
      setUploading(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  if (!herb) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Zpet
        </Button>
        <p className="text-muted-foreground">Bylinka nenalezena.</p>
      </div>
    );
  }

  function isInRange(value: number, min: number, max: number) {
    return value >= min && value <= max;
  }

  const chartData = history.map((h) => ({
    date: new Date(h.wateredAt).toLocaleDateString("cs-CZ"),
    amount: h.amountWater,
  }));

  const plantType = herb.plantType || "herb";

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-1 h-4 w-4" />
        Zpet
      </Button>

      {/* Header with image */}
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Image */}
        <div className="relative h-48 w-48 shrink-0 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center overflow-hidden">
          {herb.imageUrl ? (
            <img
              src={`${API_URL}${herb.imageUrl}`}
              alt={herb.name}
              className="h-full w-full object-cover rounded-2xl"
            />
          ) : (
            <Leaf className="h-16 w-16 text-green-200" />
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">{herb.name}</h1>
              <Badge
                variant="secondary"
                className={PLANT_TYPE_COLORS[plantType]}
              >
                {PLANT_TYPE_LABELS[plantType]}
              </Badge>
            </div>
            <p className="text-muted-foreground">{herb.description}</p>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={openEdit}>
              <Pencil className="h-4 w-4 mr-1" />
              Upravit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Smazat
            </Button>
            <div>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploading}
              >
                <ImagePlus className="h-4 w-4 mr-1" />
                {uploading ? "Nahravam..." : "Nahrat obrazek"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upravit bylinku</DialogTitle>
            <DialogDescription>Upravte udaje bylinky</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nazev</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Popis</Label>
              <textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-plantType">Typ rostliny</Label>
              <select
                id="edit-plantType"
                value={editForm.plantType}
                onChange={(e) =>
                  setEditForm((prev) => ({
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
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-temp">Teplota (°C)</Label>
                <Input
                  id="edit-temp"
                  type="number"
                  value={editForm.temperature}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      temperature: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-humidity">Vlhkost (%)</Label>
                <Input
                  id="edit-humidity"
                  type="number"
                  value={editForm.humidity}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      humidity: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-soil">Vlhkost pudy (%)</Label>
                <Input
                  id="edit-soil"
                  type="number"
                  value={editForm.soilMoisture}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      soilMoisture: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          </div>
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

      {/* Delete dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Smazat bylinku</DialogTitle>
            <DialogDescription>
              Opravdu chcete smazat bylinku &quot;{herb.name}&quot;? Tato akce
              je nevratna.
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

      {/* Current readings cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Droplet className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xl font-bold">{herb.soilMoisture}%</p>
              <p className="text-xs text-muted-foreground">Vlhkost pudy</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Thermometer className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-xl font-bold">{herb.temperature}°C</p>
              <p className="text-xs text-muted-foreground">Teplota</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Droplets className="h-5 w-5 text-cyan-500" />
            <div>
              <p className="text-xl font-bold">{herb.humidity}%</p>
              <p className="text-xs text-muted-foreground">Vlhkost</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <CalendarDays className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-xl font-bold">
                {herb.lastWatering
                  ? new Date(herb.lastWatering).toLocaleDateString("cs-CZ")
                  : "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">Posledni zaliti</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grow conditions comparison */}
      {growConditions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Porovnani s optimalni podminkami
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Teplota</p>
                  <p className="text-xs text-muted-foreground">
                    Optimalni: {growConditions.minTemperature}–
                    {growConditions.maxTemperature}°C
                  </p>
                </div>
                <Badge
                  variant={
                    isInRange(
                      herb.temperature,
                      growConditions.minTemperature,
                      growConditions.maxTemperature
                    )
                      ? "default"
                      : "destructive"
                  }
                >
                  {herb.temperature}°C
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Vlhkost</p>
                  <p className="text-xs text-muted-foreground">
                    Optimalni: {growConditions.minHumidity}–
                    {growConditions.maxHumidity}%
                  </p>
                </div>
                <Badge
                  variant={
                    isInRange(
                      herb.humidity,
                      growConditions.minHumidity,
                      growConditions.maxHumidity
                    )
                      ? "default"
                      : "destructive"
                  }
                >
                  {herb.humidity}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions row */}
      <HerbActions herbId={id} roomId={herb.roomId} onWatered={fetchData} />

      {/* Watering history chart */}
      <WateringHistoryChart data={chartData} />

      {/* History table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historie zalevani</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">Datum</th>
                    <th className="pb-2 pr-4 font-medium">Mnozstvi</th>
                    <th className="pb-2 pr-4 font-medium">Teplota</th>
                    <th className="pb-2 font-medium">Poznamky</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.id} className="border-b last:border-0">
                      <td className="py-2 pr-4">
                        {new Date(h.wateredAt).toLocaleString("cs-CZ")}
                      </td>
                      <td className="py-2 pr-4">{h.amountWater} ml</td>
                      <td className="py-2 pr-4">{h.temperature}°C</td>
                      <td className="py-2 text-muted-foreground">
                        {h.notes || "\u2014"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Zatim zadna historie zalevani.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
