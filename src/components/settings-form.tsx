"use client";

import { ArrowLeft, Hash, Key, Loader2, Newspaper, X } from "lucide-react";
import Link from "next/link";
import type React from "react";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserSettings } from "@/lib/actions/user-settings";
import { updateUserSettings } from "@/lib/actions/user-settings";

interface User {
  id: string;
  email?: string;
}

const SUGGESTED_TOPICS = [
  "Crypto",
  "AI",
  "NFT",
  "Technology",
  "Business",
  "Science",
  "Health",
  "Sports",
  "Politics",
];

interface SettingsFormProps {
  user: User;
  settings: UserSettings;
}

export function SettingsForm({ user, settings }: SettingsFormProps) {
  const [apiToken, setApiToken] = useState(settings.newsApiToken || "");
  const [topics, setTopics] = useState<string[]>(settings.favoriteTopics || []);
  const [customTopic, setCustomTopic] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const addTopic = (topic: string) => {
    const normalized = topic.trim();
    if (normalized && !topics.includes(normalized) && topics.length < 10) {
      setTopics([...topics, normalized]);
    }
  };

  const removeTopic = (topic: string) => {
    setTopics(topics.filter((t) => t !== topic));
  };

  const handleAddCustomTopic = (e: React.FormEvent) => {
    e.preventDefault();
    addTopic(customTopic);
    setCustomTopic("");
  };

  const handleSave = async () => {
    if (!apiToken.trim()) {
      toast.error("API token is required");
      return;
    }

    if (topics.length === 0) {
      toast.error("Select at least one topic");
      return;
    }

    setIsSaving(true);

    try {
      await updateUserSettings({
        newsApiToken: apiToken.trim(),
        favoriteTopics: topics,
        onboardingCompleted: settings.onboardingCompleted, // Preserve existing value
      });

      toast.success("Settings saved");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save settings",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Newspaper className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">NewsFlow</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-8">Settings</h1>

        <div className="flex flex-col gap-6">
          {/* API Token */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">News API Token</CardTitle>
              </div>
              <CardDescription>
                Your API token for fetching news articles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Label htmlFor="api-token">API Token</Label>
                <Input
                  id="api-token"
                  type="password"
                  placeholder="Enter your News API token"
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Topics */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Favorite Topics</CardTitle>
              </div>
              <CardDescription>
                Quick filters for searching news
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* Suggested topics */}
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_TOPICS.map((topic) => (
                  <Badge
                    key={topic}
                    variant={topics.includes(topic) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() =>
                      topics.includes(topic)
                        ? removeTopic(topic)
                        : addTopic(topic)
                    }
                  >
                    {topic}
                  </Badge>
                ))}
              </div>

              {/* Custom topic input */}
              <form onSubmit={handleAddCustomTopic} className="flex gap-2">
                <Input
                  placeholder="Add custom topic..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="secondary"
                  disabled={!customTopic.trim()}
                >
                  Add
                </Button>
              </form>

              {/* Selected topics */}
              {topics.length > 0 && (
                <div className="border border-border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground mb-2">
                    Selected topics ({topics.length}/10)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((topic) => (
                      <Badge key={topic} variant="secondary" className="gap-1">
                        {topic}
                        <button
                          type="button"
                          onClick={() => removeTopic(topic)}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input value={user.email || ""} disabled />
              </div>
            </CardContent>
          </Card>

          {/* Save button */}
          <Button onClick={handleSave} disabled={isSaving} size="lg">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
