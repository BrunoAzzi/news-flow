"use client";

import { UserButton } from "@clerk/nextjs";
import { Hash, Key } from "lucide-react";
import { ApiTokenForm } from "../onboarding/api-token-form";
import { TopicsForm } from "../onboarding/topics-form";

export const UserMenuButton = ({
  apiToken,
  topics = [],
}: {
  apiToken?: string;
  topics?: string[];
}) => {
  return (
    <UserButton>
      <UserButton.UserProfilePage
        label="API Key"
        labelIcon={<Key className="h-4 w-4" />}
        url="api-key"
      >
        <ApiTokenForm initialToken={apiToken} />
      </UserButton.UserProfilePage>
      <UserButton.UserProfilePage
        label="Topics"
        labelIcon={<Hash className="h-4 w-4" />}
        url="topics"
      >
        <TopicsForm initialTopics={topics} />
      </UserButton.UserProfilePage>
    </UserButton>
  );
};
