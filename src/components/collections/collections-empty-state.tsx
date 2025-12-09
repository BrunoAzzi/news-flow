import { FolderOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

export function CollectionsEmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <FolderOpen className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
        <CardTitle className="mb-2">No collections yet</CardTitle>
        <CardDescription className="text-center mb-6">
          Create your first collection to start organizing your saved articles
        </CardDescription>
      </CardContent>
    </Card>
  );
}
