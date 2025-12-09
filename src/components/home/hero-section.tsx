import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance mb-6">
        Your Personal News Curator
      </h1>
      <p className="text-lg text-muted-foreground mb-8 text-pretty">
        Search the latest news, save articles that matter, and organize them
        into custom collections. Stay informed on the topics you care about
        most.
      </p>
      <div className="flex items-center justify-center gap-4">
        <SignedOut>
          <SignUpButton>
            <Button size="lg" className="gap-2">
              <Zap className="h-4 w-4" />
              Start Free
            </Button>
          </SignUpButton>
          <SignInButton>
            <Button size="lg" variant="outline">
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <Link href="/dashboard">
            <Button size="lg" className="gap-2">
              <Zap className="h-4 w-4" />
              Search Topics
            </Button>
          </Link>
        </SignedIn>
      </div>
    </div>
  );
}
