"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArticleGrid } from "@/components/article-grid";
import { CollectionsSidebar } from "@/components/collections-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { SearchSection } from "@/components/search-section";
import type { UserSettings } from "@/lib/actions/user-settings";
import type { Article } from "@/lib/types";
import type { Collection } from "../generated/prisma/client";
import type { CollectionModel } from "../generated/prisma/models";

interface User {
  id: string;
  email?: string;
}

interface DashboardContentProps {
  user: User;
  settings: UserSettings;
  collections: CollectionModel[];
}

export function DashboardContent({
  user,
  settings,
  collections: initialCollections,
}: DashboardContentProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [collections, setCollections] =
    useState<Collection[]>(initialCollections);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setIsSearching(true);
    setSearchQuery(query);
    setHasSearched(true);

    try {
      const response = await fetch(
        `/api/news?q=${encodeURIComponent(query)}&token=${encodeURIComponent(settings.newsApiToken)}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch news");
      }

      setArticles(data.articles || []);

      if (data.articles?.length === 0) {
        toast("No articles found for this query");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to search news",
      );
      setArticles([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        user={user}
        onOpenCollections={() => setSidebarOpen(true)}
      />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <SearchSection
          favoriteTopics={settings.favoriteTopics}
          onSearch={handleSearch}
          isSearching={isSearching}
          currentQuery={searchQuery}
        />

        <ArticleGrid
          articles={articles}
          collections={collections}
          userId={user.id}
          isLoading={isSearching}
          hasSearched={hasSearched}
          searchQuery={searchQuery}
        />
      </main>

      <CollectionsSidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        collections={collections}
        setCollections={setCollections}
        userId={user.id}
      />
    </div>
  );
}
