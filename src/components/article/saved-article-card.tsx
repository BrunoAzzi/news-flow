"use client";

import { formatDistanceToNow } from "date-fns";
import { Clock, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { SavedArticleModel } from "../../generated/prisma/models";
import { RemoveArticleFromCollectionButton } from "./remove-article-from-collection";

interface SavedArticleCardProps {
  article: SavedArticleModel;
}

export function SavedArticleCard({ article }: SavedArticleCardProps) {
  const timeAgo = article.article_published_at
    ? formatDistanceToNow(new Date(article.article_published_at), {
        addSuffix: true,
      })
    : null;

  return (
    <Card className="overflow-hidden flex flex-col h-full group">
      {article.article_image && (
        <div className="relative h-48 overflow-hidden bg-muted">
          <Image
            width={100}
            height={100}
            src={article.article_image || "/placeholder.svg"}
            alt={article.article_title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}

      <CardContent className="flex-1 p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          {article.article_source && (
            <span className="font-medium">{article.article_source}</span>
          )}
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
          <a
            href={article.article_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {article.article_title}
          </a>
        </h3>

        {article.article_description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {article.article_description}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2">
        <a href={article.article_url} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="sm" className="gap-2">
            Read <ExternalLink className="h-3 w-3" />
          </Button>
        </a>

        <RemoveArticleFromCollectionButton articleId={article.id} />
      </CardFooter>
    </Card>
  );
}
