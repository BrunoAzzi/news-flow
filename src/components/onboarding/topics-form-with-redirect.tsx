"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { completeOnboarding } from "@/lib/actions/user-settings";
import { TopicsForm } from "./topics-form";

export const TopicsFormWithRedirect = ({
  initialTopics,
}: {
  initialTopics: string[];
}) => {
  const { user } = useUser();

  console.log(user);

  return (
    <TopicsForm
      initialTopics={initialTopics}
      onSuccess={async () => {
        await completeOnboarding();
        user?.reload();
        redirect("/dashboard");
      }}
    />
  );
};
