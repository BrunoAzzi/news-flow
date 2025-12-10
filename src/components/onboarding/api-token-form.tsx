"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ExternalLink, Key } from "lucide-react";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { saveApiToken } from "@/lib/actions/user-settings";
import {
  type ApiTokenSchema,
  apiTokenSchema,
} from "@/lib/schemas/user-settings";

interface ApiTokenFormProps {
  initialToken?: string;
  onSuccess?: () => void;
}

export function ApiTokenForm({ initialToken, onSuccess }: ApiTokenFormProps) {
  const [state, formAction, isPending] = useActionState(saveApiToken, null);

  const form = useForm<ApiTokenSchema>({
    resolver: zodResolver(apiTokenSchema),
    defaultValues: {
      apiToken: initialToken,
    },
  });

  useEffect(() => {
    if (state?.status === "error" && state.message) {
      toast.error(state.message);
    }

    if (state?.status === "success") {
      toast.success("API token saved successfully");
      onSuccess?.();
    }
  }, [state, onSuccess]);

  return (
    <Card>
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
          <Key className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Connect News API</CardTitle>
        <CardDescription>
          Enter your News API token to search for news articles. Don't have one?{" "}
          <a
            href="https://newsapi.org/register"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 inline-flex items-center gap-1"
          >
            Get a free API key <ExternalLink className="h-3 w-3" />
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={formAction} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="apiToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Token</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your News API token"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full gap-2">
              {isPending ? "Saving..." : "Continue"}{" "}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
