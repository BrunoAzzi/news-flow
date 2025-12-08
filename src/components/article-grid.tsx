"use client";

import { Newspaper } from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Article } from "@/lib/types";
import type { CollectionModel } from "../generated/prisma/models";

interface ArticleGridProps {
  articles: Article[];
  collections: CollectionModel[];
  userId: string;
  isLoading: boolean;
  hasSearched: boolean;
  searchQuery: string;
}

export function ArticleGrid({
  articles,
  collections,
  userId,
  isLoading,
  hasSearched,
  searchQuery,
}: ArticleGridProps) {
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: Unnecessary skeleton complexity, we should refactor
            key={index}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <Skeleton className="h-48 w-full" />
            <div className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="text-center py-20">
        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
          <Newspaper className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">Start exploring</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Search for any topic or click on your favorite topics above to
          discover the latest news articles.
        </p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
          <Newspaper className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No articles found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          We couldn&apos;t find any articles for &quot;{searchQuery}&quot;. Try
          a different search term.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        Found {articles.length} article{articles.length === 1 ? "" : "s"} for
        &quot;{searchQuery}&quot;
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <ArticleCard
            key={`${article.url}-${index}`}
            article={article}
            collections={collections}
            userId={userId}
          />
        ))}
      </div>
    </div>
  );
}
