import { useSearchParams } from "next/navigation";
import { TopicBadge } from "./topic-badge";

export const TopicBadgeList = ({
  onTopicSelection,
  topicList,
}: {
  onTopicSelection: (topic: string) => void;
  topicList: string[];
}) => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="text-sm text-muted-foreground">Quick search:</span>

      {topicList.map((topic) => (
        <TopicBadge
          key={topic}
          active={query === topic}
          onClick={() => onTopicSelection(topic)}
        >
          {topic}
        </TopicBadge>
      ))}
    </div>
  );
};
