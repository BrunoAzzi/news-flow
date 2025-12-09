import { FeaturesSection } from "@/components/home/features-section";
import { HeroSection } from "@/components/home/hero-section";
import { Footer } from "@/components/layout/footer";

export default async function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 py-20">
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
