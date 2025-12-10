import { Newspaper } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyCollectionState() {
  return (
    <div className="text-center py-20">
      <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
        <Newspaper className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">No saved articles</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        Start saving articles from your search results to see them here.
      </p>
      <Link href="/dashboard">
        <Button>Search News</Button>
      </Link>
    </div>
  );
}
