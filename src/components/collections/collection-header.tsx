import { FolderOpen } from "lucide-react";
import type { CollectionModel } from "../../generated/prisma/models";

interface CollectionHeaderProps {
  collection: CollectionModel;
  articleCount: number;
}

export function CollectionHeader({
  collection,
  articleCount,
}: CollectionHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <FolderOpen className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{collection.name}</h1>
          {collection.description && (
            <p className="text-muted-foreground">{collection.description}</p>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-4">
        {articleCount} saved article{articleCount === 1 ? "" : "s"}
      </p>
    </div>
  );
}
