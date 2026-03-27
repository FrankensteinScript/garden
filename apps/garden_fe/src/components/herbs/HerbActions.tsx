"use client";

import { useState } from "react";
import { Droplets, Sun, SunMoon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { historyService } from "@/services/history.service";
import { pumpCommandService } from "@/services/pumpCommand.service";

interface HerbActionsProps {
  herbId: string;
  roomId?: string;
  onWatered: () => void;
}

export function HerbActions({ herbId, roomId, onWatered }: HerbActionsProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [lightOn, setLightOn] = useState(false);
  const { toast } = useToast();

  async function handleWater() {
    if (!amount || Number(amount) <= 0) return;
    try {
      setLoading(true);
      await historyService.create({
        herbId,
        amountWater: Number(amount),
        wateredAt: new Date().toISOString(),
        temperature: 0,
        notes: notes || undefined,
      });
      // Also trigger the pump if roomId is available
      if (roomId) {
        await pumpCommandService.trigger(roomId, {
          action: "on",
          durationSeconds: 5,
        });
      }
      toast({
        title: "Uspesne zalito",
        description: `Bylinka byla zalita ${amount} ml vody.`,
        variant: "success",
      });
      setOpen(false);
      setAmount("");
      setNotes("");
      onWatered();
    } catch {
      toast({
        title: "Chyba",
        description: "Nepodarilo se zaznamenat zaliti.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
          <Droplets className="h-4 w-4" />
          Zalit ted
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zalit bylinku</DialogTitle>
            <DialogDescription>
              Zadejte mnozstvi vody a volitelne poznamky.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Mnozstvi (ml)</Label>
              <Input
                id="amount"
                type="number"
                min={1}
                placeholder="napr. 200"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Poznamky</Label>
              <textarea
                id="notes"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Volitelne poznamky..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Zrusit
            </Button>
            <Button onClick={handleWater} disabled={loading}>
              {loading ? "Ukladam..." : "Potvrdit zaliti"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button
        variant={lightOn ? "default" : "outline"}
        onClick={() => setLightOn(!lightOn)}
        className={lightOn ? "bg-green-600 hover:bg-green-700" : ""}
      >
        {lightOn ? (
          <Sun className="mr-1 h-4 w-4" />
        ) : (
          <SunMoon className="mr-1 h-4 w-4" />
        )}
        Svetlo {lightOn ? "ZAP" : "VYP"}
      </Button>
    </div>
  );
}
