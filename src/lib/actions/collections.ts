"use server";

import "server-only";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma/client";
import { requireUser } from "../require-user";

export async function getCollections() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

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

export async function getCollection(id: string) {
  const { userId } = await requireUser();

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
  name: string,
  description?: string | null,
) {
  const { userId } = await requireUser();

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

export async function deleteCollection(id: string): Promise<void> {
  const { userId } = await requireUser();

  try {
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
