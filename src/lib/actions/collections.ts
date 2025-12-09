"use server";

import "server-only";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma/client";
import type { CollectionModel } from "../../generated/prisma/models";
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

async function createCollectionInternal(
  name: string,
  description?: string | null,
): Promise<CollectionModel> {
  const { userId } = await requireUser();

  if (!name?.trim()) {
    throw new Error("Collection name is required");
  }

  const collection = await prisma.collection.create({
    data: {
      user_id: userId,
      name: name.trim(),
      description: description?.trim() || null,
    },
  });
  revalidatePath("/collections");
  revalidatePath("/dashboard");
  return collection;
}

export async function createCollection(
  _prevState: unknown,
  formData: FormData,
): Promise<
  | { status: "success"; data: CollectionModel }
  | { status: "error"; message: string }
> {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;

  try {
    const collection = await createCollectionInternal(name, description);
    return { status: "success", data: collection };
  } catch (error) {
    console.error("Error creating collection:", error);
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to create collection",
    };
  }
}

export async function createCollectionDirect(
  name: string,
  description?: string | null,
): Promise<CollectionModel> {
  return createCollectionInternal(name, description);
}

export async function deleteCollection(
  _prevState: unknown,
  formData: FormData,
): Promise<{ status: "success" } | { status: "error"; message: string }> {
  const { userId } = await requireUser();

  const id = formData.get("id") as string;

  if (!id) {
    return {
      status: "error",
      message: "Collection ID is required",
    };
  }

  try {
    const collection = await prisma.collection.findFirst({
      where: {
        id,
        user_id: userId,
      },
    });

    if (!collection) {
      return {
        status: "error",
        message: "Collection not found",
      };
    }

    await prisma.collection.delete({
      where: { id },
    });
    revalidatePath("/collections");
    revalidatePath("/dashboard");
    revalidatePath(`/collections/${id}`);
    return { status: "success" };
  } catch (error) {
    console.error("Error deleting collection:", error);
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to delete collection",
    };
  }
}
