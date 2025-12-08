import type { PropsWithChildren } from "react";
import { Badge } from "../ui/badge";

export const TopicBadge = ({
  active,
  ...props
}: PropsWithChildren<{ active: boolean; onClick: () => void }>) => (
  <Badge
    variant={active ? "default" : "secondary"}
    className="cursor-pointer hover:bg-primary/80 hover:text-primary-foreground transition-colors"
    {...props}
  />
);
