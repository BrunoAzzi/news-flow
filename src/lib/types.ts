// Collection and SavedArticle types are now imported from @prisma/client
// UserSettings type is defined in @/lib/actions/user-settings

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

export interface SavedArticle {
  id: string;
  user_id: string;
  collection_id: string;
  article_url: string;
  article_title: string;
  article_description: string | null;
  article_image: string | null;
  article_source: string | null;
  article_author: string | null;
  article_published_at: string | null;
  saved_at: string;
}
