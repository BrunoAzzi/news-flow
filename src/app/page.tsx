import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Bookmark, FolderOpen, Newspaper, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">NewsFlow</span>
          </div>
          <div className="flex items-center gap-3">
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
      {/* Hero */}
      <main className="mx-auto max-w-6xl px-4 py-20">
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
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Newspaper className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Search Any Topic</h3>
            <p className="text-muted-foreground">
              Find the latest news on crypto, AI, NFTs, or any topic that
              interests you with powerful search.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Bookmark className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Save Articles</h3>
            <p className="text-muted-foreground">
              Never lose an important article again. Save anything you want to
              read or reference later.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <FolderOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Custom Collections</h3>
            <p className="text-muted-foreground">
              Organize saved articles into custom collections to keep your
              research neat and accessible.
            </p>
          </div>
        </div>
      </main>
      <footer className="border-t border-border mt-20">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-muted-foreground">
          Built with Next.js and Clerk. Powered by News API.
        </div>
      </footer>
      ;
    </div>
  );
}
