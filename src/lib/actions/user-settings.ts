"use server";

import "server-only";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { apiTokenSchema } from "@/lib/schemas/user-settings";

export interface UserSettings {
  newsApiToken: string;
  favoriteTopics: string[];
  onboardingCompleted: boolean;
}

export async function getUserSettings(): Promise<UserSettings | null> {
  try {
    const user = await currentUser();
    if (!user) return null;

    const privateMetadata = user.privateMetadata as {
      newsApiToken?: string;
      favoriteTopics?: string[];
    };

    const publicMetadata = user.publicMetadata as {
      onboardingComplete?: boolean;
    };

    if (!privateMetadata.newsApiToken) {
      return null;
    }

    return {
      newsApiToken: privateMetadata.newsApiToken,
      favoriteTopics: privateMetadata.favoriteTopics || [],
      onboardingCompleted: publicMetadata.onboardingComplete ?? false,
    };
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return null;
  }
}

export async function updateUserSettings(
  settings: Partial<UserSettings>,
): Promise<void> {
  try {
    const user = await currentUser();
    if (!user) throw new Error("User not authenticated");

    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();

    const currentPrivateMetadata = (user.privateMetadata || {}) as {
      newsApiToken?: string;
      favoriteTopics?: string[];
    };

    const currentPublicMetadata = (user.publicMetadata || {}) as {
      onboardingComplete?: boolean;
    };

    const { onboardingCompleted, ...privateSettings } = settings;

    await client.users.updateUserMetadata(user.id, {
      privateMetadata: {
        ...currentPrivateMetadata,
        ...privateSettings,
      },
      publicMetadata: {
        ...currentPublicMetadata,
        ...(onboardingCompleted !== undefined && {
          onboardingComplete: onboardingCompleted,
        }),
      },
    });
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw new Error("Failed to update user settings");
  }
}

export async function saveApiToken(
  _prevState: unknown,
  formData: FormData,
): Promise<{ status: "error"; message: string } | never> {
  const apiToken = formData.get("apiToken") as string;

  const result = apiTokenSchema.safeParse({ apiToken });

  if (!result.success) {
    const errorMessage = result.error.errors[0]?.message || "Validation failed";
    return {
      status: "error",
      message: errorMessage,
    };
  }

  try {
    const user = await currentUser();
    if (!user) {
      return { status: "error", message: "User not authenticated" };
    }

    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();

    const currentMetadata = (user.privateMetadata ||
      {}) as Partial<UserSettings>;

    await client.users.updateUserMetadata(user.id, {
      privateMetadata: {
        ...currentMetadata,
        newsApiToken: result.data.apiToken,
      },
    });

    redirect("/onboarding/topics");
  } catch (error) {
    console.error("Error saving API token:", error);
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to save API token",
    };
  }
}

export async function saveTopics(topics: string[]): Promise<void> {
  try {
    const user = await currentUser();
    if (!user) throw new Error("User not authenticated");

    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();

    const currentMetadata = (user.privateMetadata ||
      {}) as Partial<UserSettings>;

    await client.users.updateUserMetadata(user.id, {
      privateMetadata: {
        ...currentMetadata,
        favoriteTopics: topics,
      },
    });
  } catch (error) {
    console.error("Error saving topics:", error);
    throw new Error("Failed to save topics");
  }
}

export async function completeOnboarding(): Promise<void> {
  try {
    const user = await currentUser();
    if (!user) throw new Error("User not authenticated");

    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();

    const currentPublicMetadata = (user.publicMetadata || {}) as {
      onboardingComplete?: boolean;
    };

    await client.users.updateUserMetadata(user.id, {
      publicMetadata: {
        ...currentPublicMetadata,
        onboardingComplete: true,
      },
    });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    throw new Error("Failed to complete onboarding");
  }
}

export async function removeApiToken(): Promise<void> {
  try {
    const user = await currentUser();
    if (!user) throw new Error("User not authenticated");

    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();

    const currentPrivateMetadata = (user.privateMetadata || {}) as {
      newsApiToken?: string;
      favoriteTopics?: string[];
    };

    await client.users.updateUserMetadata(user.id, {
      privateMetadata: {
        ...currentPrivateMetadata,
        newsApiToken: "",
      },
    });
  } catch (error) {
    console.error("Error removing API token:", error);
    throw new Error("Failed to remove API token");
  }
}

export async function updateApiToken(
  _prevState: unknown,
  formData: FormData,
): Promise<{ status: "error"; message: string } | { status: "success" }> {
  const apiToken = formData.get("apiToken") as string;

  const result = apiTokenSchema.safeParse({ apiToken });

  if (!result.success) {
    const errorMessage = result.error.errors[0]?.message || "Validation failed";
    return {
      status: "error",
      message: errorMessage,
    };
  }

  try {
    const user = await currentUser();
    if (!user) {
      return { status: "error", message: "User not authenticated" };
    }

    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();

    const currentMetadata = (user.privateMetadata ||
      {}) as Partial<UserSettings>;

    await client.users.updateUserMetadata(user.id, {
      privateMetadata: {
        ...currentMetadata,
        newsApiToken: result.data.apiToken,
      },
    });

    return { status: "success" };
  } catch (error) {
    console.error("Error updating API token:", error);
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to update API token",
    };
  }
}
