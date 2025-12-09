"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { FolderOpen, Newspaper } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Newspaper className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold">NewsFlow</span>
        </Link>

        <div className="flex items-center gap-3">
          <SignedIn>
            <Button variant="ghost" size="sm" asChild className="gap-2">
              <Link href="/collections">
                <FolderOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Collections</span>
              </Link>
            </Button>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant="ghost">Log in</Button>
            </SignInButton>
            <SignUpButton>
              <Button>Get Started</Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
