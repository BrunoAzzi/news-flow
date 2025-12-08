"use client";

import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  FolderOpen,
  Newspaper,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { deleteSavedArticle } from "@/lib/actions/saved-articles";
import type {
  CollectionModel,
  SavedArticleModel,
} from "../generated/prisma/models";

interface CollectionViewProps {
  collection: CollectionModel;
  articles: SavedArticleModel[];
  userId: string;
}

export function CollectionView({
  collection,
  articles: initialArticles,
  userId,
}: CollectionViewProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = async (articleId: string) => {
    setRemovingId(articleId);

    try {
      await deleteSavedArticle(articleId, userId);
      setArticles(articles.filter((a) => a.id !== articleId));
      toast.success("Article removed from collection");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove article",
      );
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Newspaper className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">NewsFlow</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Collection header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FolderOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{collection.name}</h1>
              {collection.description && (
                <p className="text-muted-foreground">
                  {collection.description}
                </p>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {articles.length} saved article{articles.length === 1 ? "" : "s"}
          </p>
        </div>

        {/* Articles */}
        {articles.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Newspaper className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No saved articles</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Start saving articles from your search results to see them here.
            </p>
            <Link href="/dashboard">
              <Button>Search News</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <SavedArticleCard
                key={article.id}
                article={article}
                onRemove={handleRemove}
                isRemoving={removingId === article.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

interface SavedArticleCardProps {
  article: SavedArticleModel;
  onRemove: (id: string) => void;
  isRemoving: boolean;
}

function SavedArticleCard({
  article,
  onRemove,
  isRemoving,
}: SavedArticleCardProps) {
  const timeAgo = article.article_published_at
    ? formatDistanceToNow(new Date(article.article_published_at), {
        addSuffix: true,
      })
    : null;

  return (
    <Card className="overflow-hidden flex flex-col h-full group">
      {article.article_image && (
        <div className="relative h-48 overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
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

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              disabled={isRemoving}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove article?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove the article from this collection. You can
                always save it again later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onRemove(article.id)}>
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
