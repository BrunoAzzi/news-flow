"use client";

import { redirect } from "next/navigation";
import { ApiTokenForm } from "./api-token-form";

export const ApiTokenFormWithRedirect = ({
  initialToken,
}: {
  initialToken: string;
}) => {
  return (
    <ApiTokenForm
      initialToken={initialToken}
      onSuccess={() => {
        redirect("/onboarding/topics");
      }}
    />
  );
};
