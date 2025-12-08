import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/settings-form";
import { getUserSettings } from "@/lib/actions/user-settings";

export default async function SettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/auth/login");
  }

  const user = await currentUser();
  const settings = await getUserSettings();

  if (!settings) {
    redirect("/onboarding");
  }

  return (
    <SettingsForm
      user={{
        id: userId,
        email: user?.primaryEmailAddress?.emailAddress,
      }}
      settings={settings}
    />
  );
}
