import { ArticleSkeleton } from "../article/skeleton";

export const SearchSkeleton = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    <ArticleSkeleton />
    <ArticleSkeleton />
    <ArticleSkeleton />
    <ArticleSkeleton />
    <ArticleSkeleton />
    <ArticleSkeleton />
  </div>
);
