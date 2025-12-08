"use client";

import { formatDistanceToNow } from "date-fns";
import { Bookmark, Check, Clock, ExternalLink, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { saveArticle } from "@/lib/actions/saved-articles";
import type { Article } from "@/lib/types";
import type { CollectionModel } from "../generated/prisma/models";

interface ArticleCardProps {
  article: Article;
  collections: CollectionModel[];
}

export function ArticleCard({ article, collections }: ArticleCardProps) {
  const [savedToCollections, setSavedToCollections] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveToCollection = async (collection: CollectionModel) => {
    if (savedToCollections.includes(collection.id)) {
      toast("Already saved to this collection");
      return;
    }

    setIsSaving(true);

    try {
      await saveArticle(collection.id, {
        url: article.url,
        title: article.title,
        description: article.description,
        image: article.urlToImage,
        source: article.source.name,
        author: article.author,
        publishedAt: article.publishedAt,
      });
      setSavedToCollections([...savedToCollections, collection.id]);
      toast.success(`Saved to ${collection.name}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save article";
      if (errorMessage.includes("already")) {
        toast("Article already in this collection");
        setSavedToCollections([...savedToCollections, collection.id]);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const timeAgo = article.publishedAt
    ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
    : null;

  return (
    <Card className="overflow-hidden flex flex-col h-full group">
      {article.urlToImage && (
        <div className="relative h-48 overflow-hidden bg-muted">
          <Image
            width={100}
            height={100}
            src={article.urlToImage || "/placeholder.svg"}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}

      <CardContent className="flex-1 p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span className="font-medium">{article.source.name}</span>
          {timeAgo && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {timeAgo}
              </span>
            </>
          )}
        </div>

        <h3 className="font-semibold leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </h3>

        {article.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {article.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2">
        <a href={article.url} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="sm" className="gap-2">
            Read <ExternalLink className="h-3 w-3" />
          </Button>
        </a>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isSaving}
              className="gap-2 bg-transparent"
            >
              <Bookmark className="h-3 w-3" />
              Save
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Save to collection
            </div>
            <DropdownMenuSeparator />
            {collections.length === 0 ? (
              <div className="px-2 py-4 text-sm text-center text-muted-foreground">
                No collections yet.
                <br />
                Create one first.
              </div>
            ) : (
              collections.map((collection) => (
                <DropdownMenuItem
                  key={collection.id}
                  onClick={() => handleSaveToCollection(collection)}
                  className="cursor-pointer"
                >
                  {savedToCollections.includes(collection.id) ? (
                    <Check className="h-4 w-4 mr-2 text-primary" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {collection.name}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
