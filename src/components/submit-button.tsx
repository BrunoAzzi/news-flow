import { Loader2 } from "lucide-react";
import type { PropsWithChildren } from "react";
import { Button } from "./ui/button";

export const SubmitButton = ({
  loading,
  children,
}: PropsWithChildren<{ loading: boolean }>) => {
  return (
    <Button type="submit" disabled={loading}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </Button>
  );
};
