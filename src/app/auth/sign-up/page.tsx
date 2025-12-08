import { SignUp } from "@clerk/nextjs";
import { Newspaper } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Newspaper className="h-8 w-8 text-primary" />
            <span className="text-2xl font-semibold">NewsFlow</span>
          </div>
          <SignUp
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-none border border-border",
              },
            }}
            routing="path"
            path="/auth/sign-up"
            signInUrl="/auth/login"
            afterSignUpUrl="/onboarding"
          />
        </div>
      </div>
    </div>
  );
}
