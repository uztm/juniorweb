"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ---------- INTERFACES ----------
export interface NewsItem {
  id: number;
  title: string;
  content: string;
  image: string;
  is_active: boolean;
  created_at: string;
}

export interface NewsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NewsItem[];
}

// ---------- COMPONENT ----------
export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const response = await axios.get<NewsResponse>(
        "https://api.pdpjunior.uz/api/news/"
      );
      setNews(response.data.results || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold tracking-tight mb-8 text-center">
        Yangiliklar
      </h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden border border-border/50">
              <Skeleton className="h-48 w-full" />
              <CardHeader className="space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
          ))
        ) : news.length === 0 ? (
          <p className="text-center col-span-full text-muted-foreground">
            No news available
          </p>
        ) : (
          news.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/dashboard/news/${item.id}`}>
                <Card
                  className={cn(
                    "group overflow-hidden flex flex-col h-full border border-border/50 hover:border-primary/40",
                    "transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                  )}
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <CardHeader className="flex-1 space-y-2">
                    <CardTitle className="text-xl font-semibold line-clamp-2">
                      {item.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </CardHeader>

                  <div></div>
                  {/* <CardContent className="pb-6">
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {item.content.replace(/<[^>]+>/g, "").slice(0, 150)}...
                    </p>
                  </CardContent> */}
                </Card>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
