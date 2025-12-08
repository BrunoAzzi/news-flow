"use server";

import "server-only";
import { auth } from "@clerk/nextjs/server";

export const requireUser = async () => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  return { userId };
};
