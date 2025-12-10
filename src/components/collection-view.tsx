import type {
  CollectionModel,
  SavedArticleModel,
} from "../generated/prisma/models";
import { SavedArticleCard } from "./article/saved-article-card";
import { CollectionHeader } from "./collections/collection-header";
import { EmptyCollectionState } from "./collections/empty-collection-state";

interface CollectionViewProps {
  collection: CollectionModel;
  articles: SavedArticleModel[];
}

export function CollectionView({ collection, articles }: CollectionViewProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <CollectionHeader
          collection={collection}
          articleCount={articles.length}
        />

        {articles.length === 0 ? (
          <EmptyCollectionState />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <SavedArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
