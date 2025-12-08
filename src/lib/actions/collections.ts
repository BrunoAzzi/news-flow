"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma/client";
import type { CollectionModel } from "../../generated/prisma/models";

export async function getCollections(
  userId: string,
): Promise<CollectionModel[]> {
  try {
    return await prisma.collection.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
    throw new Error("Failed to fetch collections");
  }
}

export async function getCollection(
  id: string,
  userId: string,
): Promise<CollectionModel | null> {
  try {
    return await prisma.collection.findFirst({
      where: {
        id,
        user_id: userId,
      },
    });
  } catch (error) {
    console.error("Error fetching collection:", error);
    throw new Error("Failed to fetch collection");
  }
}

export async function createCollection(
  userId: string,
  name: string,
  description?: string | null,
): Promise<CollectionModel> {
  try {
    const collection = await prisma.collection.create({
      data: {
        user_id: userId,
        name: name.trim(),
        description: description?.trim() || null,
      },
    });
    revalidatePath("/dashboard");
    return collection;
  } catch (error) {
    console.error("Error creating collection:", error);
    throw new Error("Failed to create collection");
  }
}

export async function deleteCollection(
  id: string,
  userId: string,
): Promise<void> {
  try {
    // Verify ownership
    const collection = await prisma.collection.findFirst({
      where: {
        id,
        user_id: userId,
      },
    });

    if (!collection) {
      throw new Error("Collection not found");
    }

    await prisma.collection.delete({
      where: { id },
    });
    revalidatePath("/dashboard");
    revalidatePath(`/collections/${id}`);
  } catch (error) {
    console.error("Error deleting collection:", error);
    throw new Error("Failed to delete collection");
  }
}
