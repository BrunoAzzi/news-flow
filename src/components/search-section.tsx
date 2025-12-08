"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type SearchNewsSchema, searchNewsSchema } from "@/lib/schemas/news";
import { TopicBadgeList } from "./search/topic-badge-list";
import { SubmitButton } from "./submit-button";

export function SearchSection({
  favoriteTopics,
  loading,
  query,
}: {
  favoriteTopics: string[];
  loading: boolean;
  query?: string;
}) {
  const handleSearch = (query: string) => {
    redirect(`/dashboard?query=${query}`);
  };

  const form = useForm<SearchNewsSchema>({
    resolver: zodResolver(searchNewsSchema),
    defaultValues: {
      query,
    },
  });

  const onSubmit = async (data: SearchNewsSchema) => {
    handleSearch(data.query);
  };

  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold mb-2">Search News</h1>
        <p className="text-muted-foreground">
          Find the latest articles on any topic
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-2 max-w-2xl mx-auto mb-4"
        >
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="flex-1 relative">
                <FormControl>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      {...field}
                      placeholder="Search for news..."
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <SubmitButton loading={loading}>Search</SubmitButton>
        </form>
      </Form>

      <TopicBadgeList
        onTopicSelection={handleSearch}
        topicList={favoriteTopics}
      />
    </div>
  );
}
