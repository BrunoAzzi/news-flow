import { ArticleCard } from "@/components/article-card";
import type { Article } from "@/lib/types";
import type { CollectionModel } from "../generated/prisma/models";
import { EmptyState } from "./search/empty-state";
import { NoResults } from "./search/no-results";

export function ArticleGrid({
  articles,
  collections,
}: {
  articles?: Article[];
  collections: CollectionModel[];
}) {
  if (!articles) {
    return <EmptyState />;
  }

  if (articles.length === 0) {
    return <NoResults />;
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        Found {articles.length} articles
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <ArticleCard
            key={`${article.url}-${index}`}
            article={article}
            collections={collections}
          />
        ))}
      </div>
    </div>
  );
}
