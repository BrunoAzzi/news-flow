import { redirect } from "next/navigation";
import { getUserSettings } from "@/lib/actions/user-settings";

export default async function OnboardingPage() {
  const settings = await getUserSettings();

  if (settings?.onboardingCompleted) {
    redirect("/dashboard");
  }

  // Redirect to the appropriate step
  if (!settings?.newsApiToken) {
    redirect("/onboarding/api-token");
  } else {
    redirect("/onboarding/topics");
  }
}
