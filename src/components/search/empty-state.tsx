import { Newspaper } from "lucide-react";

export const EmptyState = () => (
  <div className="text-center py-20">
    <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
      <Newspaper className="h-8 w-8 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-medium mb-2">Start exploring</h3>
    <p className="text-muted-foreground max-w-md mx-auto">
      Search for any topic or click on your favorite topics above to discover
      the latest news articles.
    </p>
  </div>
);
