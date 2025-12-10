import { Newspaper } from "lucide-react";

export const NoResults = () => (
  <div className="text-center py-20">
    <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
      <Newspaper className="h-8 w-8 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-medium mb-2">No articles found</h3>
    <p className="text-muted-foreground max-w-md mx-auto">
      We couldn't find any articles. Try a different search term.
    </p>
  </div>
);
