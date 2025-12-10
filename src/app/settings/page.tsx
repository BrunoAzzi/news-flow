import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/settings-form";
import { getUserSettings } from "@/lib/actions/user-settings";

export default async function SettingsPage() {
  const user = await currentUser();
  const settings = await getUserSettings();

  if (!settings) {
    redirect("/onboarding");
  }

  return (
    <SettingsForm
      userEmail={user?.primaryEmailAddress?.emailAddress || ""}
      settings={settings}
    />
  );
}
