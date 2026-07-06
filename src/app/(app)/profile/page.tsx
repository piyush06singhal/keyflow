"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
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
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Calendar,
  Terminal,
  Link as LinkIcon,
  Save,
  Heart,
  Shield,
} from "lucide-react";

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState("Piyush Singhal");
  const [bio, setBio] = useState(
    "Software engineer and typing enthusiast. Practicing daily coding modules to hit 90 WPM speed targets.",
  );
  const [github, setGithub] = useState("github.com/piyush06singhal");
  const [website, setWebsite] = useState("keyflow.dev");
  const [languagePref, setLanguagePref] = useState<string[]>([
    "JavaScript",
    "TypeScript",
    "Python",
  ]);
  const [newLang, setNewLang] = useState("");

  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const { user } = useAuth();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data && !error) {
        if (data.display_name) setDisplayName(data.display_name);
        if (data.bio) setBio(data.bio);
        if (data.github_url) setGithub(data.github_url);
        if (data.website_url) setWebsite(data.website_url);
        if (data.focus_languages) setLanguagePref(data.focus_languages);
      }
    }
    loadProfile();
  }, [user, supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaveStatus("Saving changes...");

    const { error } = await supabase
      .from("user_profiles")
      .update({
        display_name: displayName,
        bio: bio,
        github_url: github,
        website_url: website,
        focus_languages: languagePref,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (!error) {
      setSaveStatus("Profile saved successfully!");
    } else {
      setSaveStatus("Failed to save profile.");
    }

    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleAddLanguage = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter" && newLang.trim()) {
      e.preventDefault();
      if (!languagePref.includes(newLang.trim())) {
        setLanguagePref((prev) => [...prev, newLang.trim()]);
      }
      setNewLang("");
    }
  };

  const handleRemoveLanguage = (lang: string) => {
    setLanguagePref((prev) => prev.filter((l) => l !== lang));
  };

  return (
    <PageContainer maxWidth="full">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
          <p className="text-muted-foreground text-sm">
            Manage your display settings, player biographies, and programming focus
            areas.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Player Card Left Column */}
          <div className="space-y-6">
            <Card className="surface-card flex flex-col items-center p-6 text-center">
              <div className="relative mt-4">
                <div className="bg-primary/10 border-primary text-primary flex h-24 w-24 items-center justify-center rounded-full border-2 text-3xl font-bold">
                  {displayName.charAt(0)}
                </div>
                <Badge className="bg-primary absolute -right-1 -bottom-1 h-6 rounded-full border px-2 text-[10px] font-bold">
                  Lvl 4
                </Badge>
              </div>

              <div className="mt-4 space-y-1">
                <h3 className="text-foreground text-lg font-bold">{displayName}</h3>
                <p className="text-muted-foreground flex items-center justify-center gap-1.5 text-xs font-semibold">
                  <Mail className="h-3.5 w-3.5" />
                  piyush@example.com
                </p>
                <p className="text-muted-foreground flex items-center justify-center gap-1.5 text-xs font-semibold">
                  <Calendar className="h-3.5 w-3.5" />
                  Member since July 2026
                </p>
              </div>

              <div className="border-border/40 mt-6 w-full space-y-4 border-t pt-6">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">League Rank</span>
                  <span className="text-foreground flex items-center gap-1 font-bold">
                    <Shield className="text-primary h-4 w-4" />
                    Bronze III
                  </span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Achievements Unlocked</span>
                  <span className="text-foreground font-bold">3 / 7 Badges</span>
                </div>
              </div>
            </Card>

            <Card className="surface-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-1.5 text-sm font-bold">
                  <Heart className="h-4.5 w-4.5 text-rose-500" />
                  Focus Languages
                </CardTitle>
                <CardDescription>Programming focus selections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {languagePref.map((lang) => (
                    <Badge
                      key={lang}
                      variant="secondary"
                      className="group flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold hover:bg-rose-500/10 hover:text-rose-500"
                      onClick={() => handleRemoveLanguage(lang)}
                    >
                      {lang}
                      <span className="text-muted-foreground ml-1 text-[10px] font-bold group-hover:text-rose-500">
                        ×
                      </span>
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Type language and press Enter"
                  value={newLang}
                  onChange={(e) => setNewLang(e.target.value)}
                  onKeyDown={handleAddLanguage}
                  className="h-8.5 rounded-xl text-xs"
                />
              </CardContent>
            </Card>
          </div>

          {/* Edit Profile Form Right Column */}
          <div className="lg:col-span-2">
            <Card className="surface-card">
              <CardHeader>
                <CardTitle className="text-base font-bold">
                  Account Passport Settings
                </CardTitle>
                <CardDescription>
                  Modify display data and developer profiles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                      Display Name
                    </label>
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="h-10 rounded-xl text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                      Bio Card Description
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e: any) => setBio(e.target.value)}
                      rows={4}
                      className="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full resize-none rounded-xl border bg-transparent px-3 py-2 text-xs leading-relaxed font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-muted-foreground flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                        <Terminal className="h-4 w-4" />
                        GitHub Username
                      </label>
                      <Input
                        value={github}
                        onChange={(e: any) => setGithub(e.target.value)}
                        className="h-10 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-muted-foreground flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                        <LinkIcon className="h-4 w-4" />
                        Website Url
                      </label>
                      <Input
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="h-10 rounded-xl text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t pt-4">
                    <div>
                      {saveStatus && (
                        <span className="text-primary bg-primary/5 border-primary/20 rounded-lg border px-3 py-1.5 text-xs font-bold">
                          {saveStatus}
                        </span>
                      )}
                    </div>
                    <Button
                      type="submit"
                      size="sm"
                      className="flex h-9.5 items-center gap-1.5 rounded-xl px-4 font-bold"
                    >
                      <Save className="h-4 w-4" />
                      Save Profile Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
