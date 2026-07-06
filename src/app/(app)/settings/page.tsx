"use client";

import { useState } from "react";
import { PageContainer } from "@/components/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Keyboard, Brain, User, Volume2, Save } from "lucide-react";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  // Typing Config States
  const [layout, setLayout] = useState("qwerty");
  const [soundEffects, setSoundEffects] = useState(true);
  const [smoothCaret, setSmoothCaret] = useState(true);

  // AI Coach States
  const [feedbackFrequency, setFeedbackFrequency] = useState("standard");
  const [feedbackStyle, setFeedbackStyle] = useState("coaching");
  const [emailReports, setEmailReports] = useState(true);

  // Account States
  const [email, setEmail] = useState("piyush@example.com");
  const [password, setPassword] = useState("••••••••••••");

  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("Saving changes...");
    setTimeout(() => {
      setSaveStatus("Preferences updated successfully!");
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1200);
  };

  return (
    <PageContainer maxWidth="full">
      <div className="space-y-6">
        {/* Header Toolbar */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Preferences & Settings</h1>
          <p className="text-muted-foreground text-sm">
            Configure sound effects, custom layouts, AI coaching frequencies, and
            account settings.
          </p>
        </div>

        <Tabs defaultValue="typing" className="w-full">
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Left Column - Tabs List navigation */}
            <div className="lg:col-span-1">
              <TabsList className="bg-card shadow-key-xs flex h-auto w-full flex-col gap-1.5 rounded-2xl border p-2">
                <TabsTrigger
                  value="typing"
                  className="w-full justify-start rounded-xl px-4 py-2.5"
                >
                  <Keyboard className="mr-2 h-4 w-4" />
                  Typing Practice
                </TabsTrigger>
                <TabsTrigger
                  value="aicoach"
                  className="w-full justify-start rounded-xl px-4 py-2.5"
                >
                  <Brain className="mr-2 h-4 w-4" />
                  AI Coach
                </TabsTrigger>
                <TabsTrigger
                  value="account"
                  className="w-full justify-start rounded-xl px-4 py-2.5"
                >
                  <User className="mr-2 h-4 w-4" />
                  Account
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Right Column - Tabs Content grids */}
            <div className="space-y-6 lg:col-span-3">
              {/* Typing preferences tab */}
              <TabsContent value="typing" className="mt-0">
                <Card className="surface-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-1.5 text-base font-bold">
                      <Keyboard className="text-primary h-4.5 w-4.5" />
                      Typing Preferences
                    </CardTitle>
                    <CardDescription>
                      Configure practice metrics, layouts, and sound triggers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Theme selector */}
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="space-y-0.5">
                        <h4 className="text-foreground text-sm font-bold">
                          Color Theme
                        </h4>
                        <p className="text-muted-foreground text-[11px] font-semibold">
                          Adjust workspace theme
                        </p>
                      </div>
                      <Select
                        value={theme || "system"}
                        onValueChange={(val) => setTheme(val)}
                      >
                        <SelectTrigger className="w-[180px] rounded-xl">
                          <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="light" className="rounded-lg">
                            Light Theme
                          </SelectItem>
                          <SelectItem value="dark" className="rounded-lg">
                            Dark Theme
                          </SelectItem>
                          <SelectItem value="system" className="rounded-lg">
                            System Default
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Keyboard layout selection */}
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="space-y-0.5">
                        <h4 className="text-foreground text-sm font-bold">
                          Keyboard Layout
                        </h4>
                        <p className="text-muted-foreground text-[11px] font-semibold">
                          Modify virtual heatmap maps
                        </p>
                      </div>
                      <Select value={layout} onValueChange={setLayout}>
                        <SelectTrigger className="w-[180px] rounded-xl">
                          <SelectValue placeholder="Layout" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="qwerty" className="rounded-lg">
                            ANSI QWERTY
                          </SelectItem>
                          <SelectItem value="dvorak" className="rounded-lg">
                            Dvorak
                          </SelectItem>
                          <SelectItem value="colemak" className="rounded-lg">
                            Colemak
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Caret styling switch */}
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="space-y-0.5">
                        <h4 className="text-foreground text-sm font-bold">
                          Smooth Caret
                        </h4>
                        <p className="text-muted-foreground text-[11px] font-semibold">
                          Animate character cursor movements
                        </p>
                      </div>
                      <Switch checked={smoothCaret} onCheckedChange={setSmoothCaret} />
                    </div>

                    {/* sound effect control switch */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="text-foreground flex items-center gap-1.5 text-sm font-bold">
                          <Volume2 className="text-primary h-4 w-4" />
                          Keypress Sound Effects
                        </h4>
                        <p className="text-muted-foreground text-[11px] font-semibold">
                          Play sound triggers on correct keypresses
                        </p>
                      </div>
                      <Switch
                        checked={soundEffects}
                        onCheckedChange={setSoundEffects}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* AI Coach Settings tab */}
              <TabsContent value="aicoach" className="mt-0">
                <Card className="surface-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-1.5 text-base font-bold">
                      <Brain className="text-primary h-4.5 w-4.5" />
                      AI Coach Configuration
                    </CardTitle>
                    <CardDescription>
                      Adjust feedback parameters and diagnostic frequencies
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Feedback style */}
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="space-y-0.5">
                        <h4 className="text-foreground text-sm font-bold">
                          Coaching Persona Style
                        </h4>
                        <p className="text-muted-foreground text-[11px] font-semibold">
                          Personality tone of coaching recommendations
                        </p>
                      </div>
                      <Select value={feedbackStyle} onValueChange={setFeedbackStyle}>
                        <SelectTrigger className="w-[180px] rounded-xl">
                          <SelectValue placeholder="Style" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="coaching" className="rounded-lg">
                            Coaching (Empathetic)
                          </SelectItem>
                          <SelectItem value="strict" className="rounded-lg">
                            Strict (Performance-focused)
                          </SelectItem>
                          <SelectItem value="analytical" className="rounded-lg">
                            Analytical (Data-driven)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Feedback frequency */}
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="space-y-0.5">
                        <h4 className="text-foreground text-sm font-bold">
                          Feedback Frequency
                        </h4>
                        <p className="text-muted-foreground text-[11px] font-semibold">
                          Adjust how often AI triggers alerts
                        </p>
                      </div>
                      <Select
                        value={feedbackFrequency}
                        onValueChange={setFeedbackFrequency}
                      >
                        <SelectTrigger className="w-[180px] rounded-xl">
                          <SelectValue placeholder="Frequency" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="always" className="rounded-lg">
                            After every session
                          </SelectItem>
                          <SelectItem value="standard" className="rounded-lg">
                            When errors cluster
                          </SelectItem>
                          <SelectItem value="minimal" className="rounded-lg">
                            Weekly summary reports
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* email notifications */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="text-foreground text-sm font-bold">
                          Weekly Digest Emails
                        </h4>
                        <p className="text-muted-foreground text-[11px] font-semibold">
                          Send analytics forecasts and habit alerts directly to email
                        </p>
                      </div>
                      <Switch
                        checked={emailReports}
                        onCheckedChange={setEmailReports}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Account Settings tab */}
              <TabsContent value="account" className="mt-0">
                <Card className="surface-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-1.5 text-base font-bold">
                      <User className="text-primary h-4.5 w-4.5" />
                      Account Settings
                    </CardTitle>
                    <CardDescription>
                      Configure security options and login keys
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                        Email Address
                      </label>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-10 rounded-xl text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                        Password
                      </label>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-10 rounded-xl text-xs font-semibold"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Bottom toolbar */}
              <div className="flex items-center justify-between border-t pt-4">
                <div>
                  {saveStatus && (
                    <span className="text-primary bg-primary/5 border-primary/20 rounded-lg border px-3 py-1.5 text-xs font-bold">
                      {saveStatus}
                    </span>
                  )}
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="flex h-9.5 items-center gap-1.5 rounded-xl px-4 font-bold"
                  onClick={handleSave}
                >
                  <Save className="h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </PageContainer>
  );
}
