import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TopicsForm } from "@/components/onboarding/topics-form";
import { getUserSettings } from "@/lib/actions/user-settings";

export default async function TopicsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/auth/login");
  }

  const settings = await getUserSettings();

  if (settings?.onboardingCompleted) {
    redirect("/dashboard");
  }

  // Redirect to API token step if not set
  if (!settings?.newsApiToken) {
    redirect("/onboarding/api-token");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <TopicsForm
        userId={userId}
        initialTopics={settings?.favoriteTopics || []}
      />
    </div>
  );
}
