"use client";

import { Loader2, Search } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchSectionProps {
  favoriteTopics: string[];
  onSearch: (query: string) => void;
  isSearching: boolean;
  currentQuery: string;
}

export function SearchSection({
  favoriteTopics,
  onSearch,
  isSearching,
  currentQuery,
}: SearchSectionProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleTopicClick = (topic: string) => {
    setQuery(topic);
    onSearch(topic);
  };

  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold mb-2">Search News</h1>
        <p className="text-muted-foreground">
          Find the latest articles on any topic
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 max-w-2xl mx-auto mb-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for news..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={isSearching || !query.trim()}>
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Search"
          )}
        </Button>
      </form>

      {favoriteTopics.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Quick search:</span>
          {favoriteTopics.map((topic) => (
            <Badge
              key={topic}
              variant={currentQuery === topic ? "default" : "secondary"}
              className="cursor-pointer hover:bg-primary/80 hover:text-primary-foreground transition-colors"
              onClick={() => handleTopicClick(topic)}
            >
              {topic}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
