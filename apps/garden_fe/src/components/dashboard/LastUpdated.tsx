"use client";

import { useEffect, useState } from "react";
import { Clock, WifiOff } from "lucide-react";

interface LastUpdatedProps {
  updatedAt: string;
}

export function LastUpdated({ updatedAt }: LastUpdatedProps) {
  const [label, setLabel] = useState("");
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    function update() {
      const diff = Math.floor(
        (Date.now() - new Date(updatedAt).getTime()) / 1000
      );
      if (diff < 60) {
        setLabel(`pred ${diff}s`);
      } else if (diff < 3600) {
        setLabel(`pred ${Math.floor(diff / 60)}min`);
      } else {
        setLabel(`pred ${Math.floor(diff / 3600)}h`);
      }
      setIsStale(diff > 120);
    }
    update();
    const id = setInterval(update, 5000);
    return () => clearInterval(id);
  }, [updatedAt]);

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs ${
        isStale ? "text-red-500" : "text-muted-foreground"
      }`}
    >
      {isStale ? (
        <WifiOff className="h-3 w-3" />
      ) : (
        <Clock className="h-3 w-3" />
      )}
      {isStale ? `Offline - ${label}` : `Aktualizovano ${label}`}
    </span>
  );
}
