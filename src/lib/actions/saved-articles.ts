"use server";

import "server-only";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma/client";
import type { SavedArticleModel } from "../../generated/prisma/models";
import { requireUser } from "../require-user";

export async function getSavedArticles(collectionId: string) {
  const { userId } = await requireUser();

  try {
    return await prisma.savedArticle.findMany({
      where: { collection_id: collectionId, user_id: userId },
      orderBy: { saved_at: "desc" },
    });
  } catch (error) {
    console.error("Error fetching saved articles:", error);
    throw new Error("Failed to fetch saved articles");
  }
}

export async function saveArticle(
  collectionId: string,
  article: {
    url: string;
    title: string;
    description?: string | null;
    image?: string | null;
    source?: string | null;
    author?: string | null;
    publishedAt?: string | null;
  },
) {
  const { userId } = await requireUser();

  try {
    // Check if article already exists in this collection
    const existing = await prisma.savedArticle.findUnique({
      where: {
        collection_id_article_url: {
          collection_id: collectionId,
          article_url: article.url,
        },
      },
    });

    if (existing) {
      throw new Error("Article already in this collection");
    }

    const savedArticle = await prisma.savedArticle.create({
      data: {
        user_id: userId,
        collection_id: collectionId,
        article_url: article.url,
        article_title: article.title,
        article_description: article.description || null,
        article_image: article.image || null,
        article_source: article.source || null,
        article_author: article.author || null,
        article_published_at: article.publishedAt
          ? new Date(article.publishedAt)
          : null,
      },
    });
    revalidatePath("/dashboard");
    revalidatePath(`/collections/${collectionId}`);
    return savedArticle;
  } catch (error: unknown) {
    console.error("Error saving article:", error);
    if (
      (error as { code?: string }).code === "P2002" ||
      (error instanceof Error && error.message.includes("already"))
    ) {
      throw new Error("Article already in this collection");
    }
    throw new Error("Failed to save article");
  }
}

export async function deleteSavedArticle(
  _prevState: unknown,
  formData: FormData,
) {
  const { userId } = await requireUser();

  const id = formData.get("id") as string;

  try {
    const article = await prisma.savedArticle.findFirst({
      where: {
        id,
        user_id: userId,
      },
    });

    if (!article) {
      throw new Error("Article not found");
    }

    await prisma.savedArticle.delete({
      where: { id, user_id: userId },
    });
    revalidatePath(`/collections/${article.collection_id}`);
  } catch (error) {
    console.error("Error deleting saved article:", error);
    throw new Error("Failed to delete article");
  }
}
