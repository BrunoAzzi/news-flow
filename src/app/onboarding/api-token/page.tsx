import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ApiTokenForm } from "@/components/onboarding/api-token-form";
import { getUserSettings } from "@/lib/actions/user-settings";

export default async function ApiTokenPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/auth/login");
  }

  const settings = await getUserSettings();

  if (settings?.onboardingCompleted) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <ApiTokenForm initialToken={settings?.newsApiToken || ""} />
    </div>
  );
}
