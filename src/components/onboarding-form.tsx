"use client";
import {
  ArrowRight,
  ExternalLink,
  Hash,
  Key,
  Newspaper,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

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
import { createCollection } from "@/lib/actions/collections";
import type { UserSettings } from "@/lib/actions/user-settings";
import { updateUserSettings } from "@/lib/actions/user-settings";

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

interface OnboardingFormProps {
  userId: string;
  existingSettings: UserSettings | null;
}

export function OnboardingForm({
  userId,
  existingSettings,
}: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [apiToken, setApiToken] = useState(
    existingSettings?.newsApiToken || "",
  );
  const [topics, setTopics] = useState<string[]>(
    existingSettings?.favoriteTopics || [],
  );
  const [customTopic, setCustomTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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

  const handleComplete = async () => {
    if (!apiToken.trim()) {
      toast.error("Please enter your News API token");
      return;
    }

    if (topics.length === 0) {
      toast.error("Please select at least one topic");
      return;
    }

    setIsLoading(true);

    try {
      await updateUserSettings({
        newsApiToken: apiToken.trim(),
        favoriteTopics: topics,
        onboardingCompleted: true,
      });

      // Create a default collection
      try {
        await createCollection(userId, "Read Later", "Articles to read later");
      } catch (error) {
        console.warn("Failed to create default collection:", error);
        // Don't fail onboarding if collection creation fails
      }

      toast.success("Setup complete! Welcome to NewsFlow");
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save settings",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="flex items-center justify-center gap-2 mb-8">
        <Newspaper className="h-8 w-8 text-primary" />
        <span className="text-2xl font-semibold">NewsFlow</span>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div
          className={`h-2 w-16 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`}
        />
        <div
          className={`h-2 w-16 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`}
        />
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Key className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Connect News API</CardTitle>
            <CardDescription>
              Enter your News API token to search for news articles. Don&apos;t
              have one?{" "}
              <a
                href="https://newsapi.org/register"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 inline-flex items-center gap-1"
              >
                Get a free API key <ExternalLink className="h-3 w-3" />
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
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
            <Button
              onClick={() => setStep(2)}
              disabled={!apiToken.trim()}
              className="w-full gap-2"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <Hash className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Choose Your Topics</CardTitle>
            <CardDescription>
              Select or add topics you&apos;re interested in. These will appear
              as quick filters in your dashboard.
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

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleComplete}
                disabled={topics.length === 0 || isLoading}
                className="flex-1"
              >
                {isLoading ? "Saving..." : "Complete Setup"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
