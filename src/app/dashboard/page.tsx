import { ArticleGrid } from "@/components/article-grid";
import { SearchSection } from "@/components/search-section";
import { getCollections } from "@/lib/actions/collections";
import { searchNews } from "@/lib/actions/news";
import { getUserSettings } from "@/lib/actions/user-settings";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const { query } = await searchParams;

  const settings = await getUserSettings();
  const collections = await getCollections();
  const {
    data: { articles },
  } = await searchNews(query);

  if (!settings) {
    throw new Error("User settings not found");
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <SearchSection
        favoriteTopics={settings.favoriteTopics}
        loading={false}
        query={query}
      />

      <ArticleGrid articles={articles} collections={collections} />
    </main>
  );
}
