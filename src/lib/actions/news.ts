"use server";

import "server-only";
import { getUserSettings } from "./user-settings";

export interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface SearchNewsResult {
  articles?: Article[];
  totalResults: number;
}

export async function searchNews(query?: string): Promise<{
  status: "error" | "success";
  data: SearchNewsResult;
  message?: string;
}> {
  try {
    if (!query?.trim()) {
      return {
        status: "error",
        data: {
          articles: undefined,
          totalResults: 0,
        },
      };
    }

    const settings = await getUserSettings();

    if (!settings?.newsApiToken) {
      return {
        status: "error",
        data: {
          totalResults: 0,
        },
        message: "News API token not configured. Please update your settings.",
      };
    }

    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query.trim())}&apiKey=${settings.newsApiToken}&sortBy=publishedAt&pageSize=20`,
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        status: "error",
        data: {
          articles: undefined,
          totalResults: 0,
        },
        message:
          errorData.message || `Failed to fetch news: ${response.statusText}`,
      };
    }

    const data = await response.json();

    return {
      status: "success",
      data: {
        articles: data.articles || [],
        totalResults: data.totalResults || 0,
      } as SearchNewsResult,
    };
  } catch (error) {
    console.error("Error searching news:", error);
    return {
      status: "error",
      data: {
        articles: undefined,
        totalResults: 0,
      },
      message: error instanceof Error ? error.message : "Failed to search news",
    };
  }
}
