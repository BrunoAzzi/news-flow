"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export const BackButton = () => {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  if (isDashboard) return null;

  return (
    <Link href="/dashboard">
      <Button variant="ghost" size="icon">
        <ArrowLeft className="h-5 w-5" />
      </Button>
    </Link>
  );
};
