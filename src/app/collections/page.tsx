import { CollectionCard } from "@/components/collections/collection-card";
import { CollectionsEmptyState } from "@/components/collections/collections-empty-state";
import { CreateCollectionDialog } from "@/components/collections/create-collection-dialog";
import { getCollectionList } from "@/lib/actions/collections";

export default async function CollectionsPage() {
  const collections = await getCollectionList();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Collections</h1>
          <p className="text-muted-foreground">
            Organize your saved articles into collections
          </p>
        </div>

        <div className="mb-6">
          <CreateCollectionDialog />
        </div>

        {collections.length === 0 ? (
          <CollectionsEmptyState />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
