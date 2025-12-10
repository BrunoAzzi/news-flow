"use server";

import "server-only";
import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma/client";
import { requireUser } from "../require-user";
import { createCollectionSchema } from "../schemas/collections";

export async function getCollectionList() {
  const { userId } = await requireUser();

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
  _prevState: unknown,
  formData: FormData,
) {
  const { userId } = await requireUser();

  const validation = parseWithZod(formData, { schema: createCollectionSchema });

  if (validation.status !== "success") {
    return {
      status: "error",
      errors: validation.error?.fieldErrors,
    };
  }

  const { name, description } = validation.value;

  try {
    await prisma.collection.create({
      data: {
        user_id: userId,
        name,
        description,
      },
    });

    revalidatePath("/collections");
    revalidatePath("/dashboard");

    return {
      status: "success",
    };
  } catch (error) {
    console.error("Error creating collection:", error);
    return {
      status: "error",
      message: "Failed to create collection",
    };
  }
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
      where: { id, user_id: userId },
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
