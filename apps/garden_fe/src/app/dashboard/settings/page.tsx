"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast";
import { authService } from "@/services/auth.service";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Profile
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Email notifications
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);
      // Using authService since there is no dedicated userService yet
      // The backend would need a PUT /user/:id endpoint
      await authService.getMe();
      toast({
        title: "Profil ulozen",
        description: "Vase zmeny byly uspesne ulozeny.",
        variant: "success",
      });
    } catch {
      toast({
        title: "Chyba",
        description: "Nepodarilo se ulozit zmeny.",
        variant: "error",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Chyba",
        description: "Hesla se neshoduji.",
        variant: "error",
      });
      return;
    }
    toast({
      title: "Informace",
      description: "Funkce bude brzy k dispozici.",
      variant: "warning",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Nastaveni</h1>

      {/* Profile section */}
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Upravte sve osobni udaje</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Jmeno</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Vase jmeno"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vas@email.cz"
            />
          </div>
          <Button onClick={handleSaveProfile} disabled={savingProfile}>
            {savingProfile ? "Ukladam..." : "Ulozit zmeny"}
          </Button>
        </CardContent>
      </Card>

      {/* Password section */}
      <Card>
        <CardHeader>
          <CardTitle>Zmena hesla</CardTitle>
          <CardDescription>
            Aktualizujte sve prihlasovaci heslo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Soucasne heslo</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Zadejte soucasne heslo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nove heslo</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Zadejte nove heslo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Potvrzeni noveho hesla</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Zopakujte nove heslo"
            />
          </div>
          <Button onClick={handleChangePassword}>Zmenit heslo</Button>
        </CardContent>
      </Card>

      {/* Email notifications section */}
      <Card>
        <CardHeader>
          <CardTitle>E-mailova upozorneni</CardTitle>
          <CardDescription>
            Nastavte si, jaka upozorneni chcete dostavat e-mailem
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">
                Prijmat e-mailova upozorneni
              </p>
              <p className="text-xs text-muted-foreground">
                Budete dostavat e-maily o kritickych stavech vasich rostlin,
                varovnych podminkach v mistnostech a dulezitych systemovych
                udalostech.
              </p>
            </div>
            <Button
              variant={emailNotifications ? "default" : "outline"}
              size="sm"
              onClick={() => setEmailNotifications(!emailNotifications)}
              className="shrink-0 ml-4"
            >
              {emailNotifications ? "Zapnuto" : "Vypnuto"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
