import { ChevronRight, FolderOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CollectionModel } from "../../generated/prisma/models";
import { DeleteCollectionButton } from "./delete-collection-button";

interface CollectionCardProps {
  collection: CollectionModel;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
            <FolderOpen className="h-6 w-6 text-primary" />
          </div>
          <DeleteCollectionButton
            collectionId={collection.id}
            collectionName={collection.name}
          />
        </div>
        <CardTitle className="line-clamp-1">{collection.name}</CardTitle>
        {collection.description && (
          <CardDescription className="line-clamp-2">
            {collection.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/collections/${collection.id}`}>
            View Collection
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
