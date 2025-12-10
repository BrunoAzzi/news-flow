import { Bookmark, FolderOpen, Newspaper } from "lucide-react";
import { FeatureCard } from "./feature-card";

const features = [
  {
    icon: Newspaper,
    title: "Search Any Topic",
    description:
      "Find the latest news on crypto, AI, NFTs, or any topic that interests you with powerful search.",
  },
  {
    icon: Bookmark,
    title: "Save Articles",
    description:
      "Never lose an important article again. Save anything you want to read or reference later.",
  },
  {
    icon: FolderOpen,
    title: "Custom Collections",
    description:
      "Organize saved articles into custom collections to keep your research neat and accessible.",
  },
];

export function FeaturesSection() {
  return (
    <div className="mt-24 grid md:grid-cols-3 gap-8">
      {features.map((feature) => (
        <FeatureCard
          key={feature.title}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  );
}
