import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard-content";
import { getCollections } from "@/lib/actions/collections";
import { getUserSettings } from "@/lib/actions/user-settings";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/auth/login");
  }

  const user = await currentUser();
  const settings = await getUserSettings();
  const collections = await getCollections(userId);

  console.log(settings);

  if (!settings) {
    throw new Error("User settings not found");
  }

  return (
    <DashboardContent
      user={{
        id: userId,
        email: user?.primaryEmailAddress?.emailAddress,
      }}
      settings={settings}
      collections={collections}
    />
  );
}
