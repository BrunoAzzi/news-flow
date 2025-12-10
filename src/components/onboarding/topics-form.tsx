"use client";

import { Hash, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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
import { completeOnboarding, saveTopics } from "@/lib/actions/user-settings";

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

interface TopicsFormProps {
  initialTopics?: string[];
}

export function TopicsForm({ initialTopics = [] }: TopicsFormProps) {
  const [topics, setTopics] = useState<string[]>(initialTopics);
  const [customTopic, setCustomTopic] = useState("");
  const [isPending, startTransition] = useTransition();
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

  async function handleAddCustomTopic(formData: FormData) {
    const topic = formData.get("customTopic") as string;
    if (topic?.trim()) {
      addTopic(topic);
      setCustomTopic("");
    }
  }

  async function handleComplete() {
    if (topics.length === 0) {
      toast.error("Please select at least one topic");
      return;
    }

    startTransition(async () => {
      try {
        await saveTopics(topics);
        await completeOnboarding();

        toast.success("Setup complete! Welcome to NewsFlow");
        router.push("/dashboard");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to complete setup",
        );
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
          <Hash className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Choose Your Topics</CardTitle>
        <CardDescription>
          Select or add topics you're interested in. These will appear as quick
          filters in your dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_TOPICS.map((topic) => (
            <Badge
              key={topic}
              variant={topics.includes(topic) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() =>
                topics.includes(topic) ? removeTopic(topic) : addTopic(topic)
              }
            >
              {topic}
            </Badge>
          ))}
        </div>

        <form action={handleAddCustomTopic} className="flex gap-2">
          <Input
            name="customTopic"
            placeholder="Add custom topic..."
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            disabled={isPending}
          />
          <Button
            type="submit"
            variant="secondary"
            disabled={!customTopic.trim() || isPending}
          >
            Add
          </Button>
        </form>

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
                    disabled={isPending}
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
            type="button"
            variant="outline"
            onClick={() => router.push("/onboarding/api-token")}
            className="flex-1"
            disabled={isPending}
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={handleComplete}
            disabled={topics.length === 0 || isPending}
            className="flex-1"
          >
            {isPending ? "Saving..." : "Complete Setup"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
