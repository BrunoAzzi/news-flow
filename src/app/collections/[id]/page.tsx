import Link from "next/link";
import { SavedArticleCard } from "@/components/article/saved-article-card";
import { CollectionHeader } from "@/components/collections/collection-header";
import { EmptyCollectionState } from "@/components/collections/empty-collection-state";
import { getCollection } from "@/lib/actions/collections";
import { getSavedArticles } from "@/lib/actions/saved-articles";

const NotFound = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-semibold mb-2">Collection not found</h1>
      <p className="text-muted-foreground">
        This collection doesn't exist or you don't have access to it.
      </p>
      <Link href="/collections" className="text-primary">
        Go to collections
      </Link>
    </div>
  </div>
);

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const collection = await getCollection(id);

  if (!collection) return <NotFound />;

  const articles = await getSavedArticles(id);

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
