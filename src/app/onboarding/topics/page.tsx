import { Hash } from "lucide-react";
import { redirect } from "next/navigation";
import { TopicsFormWithRedirect } from "@/components/onboarding/topics-form-with-redirect";
import { getUserSettings } from "@/lib/actions/user-settings";

export default async function TopicsPage() {
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
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Hash className="h-8 w-8 text-primary" />
          <span className="text-2xl font-semibold">NewsFlow</span>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-2 w-16 rounded-full bg-primary" />
          <div className="h-2 w-16 rounded-full bg-primary" />
        </div>

        <TopicsFormWithRedirect
          initialTopics={settings?.favoriteTopics || []}
        />
      </div>
    </div>
  );
}
