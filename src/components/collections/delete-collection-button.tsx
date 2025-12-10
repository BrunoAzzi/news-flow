"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteCollection } from "@/lib/actions/collections";

interface DeleteCollectionButtonProps {
  collectionId: string;
  collectionName: string;
}

export function DeleteCollectionButton({
  collectionId,
  collectionName,
}: DeleteCollectionButtonProps) {
  const [state, deleteAction, isPending] = useActionState(
    deleteCollection,
    null,
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state?.status === "success") {
      toast.success("Collection deleted successfully");
      setOpen(false);
    } else if (state?.status === "error" && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form action={deleteAction}>
          <input type="hidden" name="id" value={collectionId} />
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{collectionName}&quot;? This
              action cannot be undone and will delete all articles in this
              collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button" disabled={isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
