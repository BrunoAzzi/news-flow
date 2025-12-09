import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CollectionView } from "@/components/collection-view";
import { getCollection } from "@/lib/actions/collections";
import { getSavedArticles } from "@/lib/actions/saved-articles";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/auth/login");
  }

  const { id } = await params;
  const collection = await getCollection(id);

  if (!collection) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Collection not found</h1>
          <p className="text-muted-foreground">
            This collection doesn&apos;t exist or you don&apos;t have access to
            it.
          </p>
        </div>
      </div>
    );
  }

  const articles = await getSavedArticles(id);

  return (
    <CollectionView
      collection={collection}
      articles={articles}
      userId={userId}
    />
  );
}
