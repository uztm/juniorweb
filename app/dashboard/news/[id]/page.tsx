'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  image: string;
  created_at: string;
}

export default function NewsDetailPage() {
  const { id } = useParams();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await axios.get(`https://api.pdpjunior.uz/api/news/${id}/`);
      setNews(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchNews();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <Card className="overflow-hidden shadow-lg">
          <Skeleton className="h-72 w-full" />
          <CardContent className="p-6">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-4 w-32 mb-6" />
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-4 w-5/6 mb-3" />
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-4 w-4/5" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {error ? "Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring." : "Yangilik topilmadi"}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Card className="overflow-hidden shadow-xl border bg-white dark:bg-gray-900">
        {/* Image Section */}
        <div className="relative h-80 overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={news.image}
            alt={news.title}
            className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/800x400?text=No+Image';
            }}
          />
        </div>

        <CardContent className="p-8">
          {/* Title */}
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100 leading-tight">
            {news.title}
          </h1>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <Calendar className="w-4 h-4" />
            <time dateTime={news.created_at}>
              {new Date(news.created_at).toLocaleDateString('uz-UZ', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>

          {/* Content with custom styles */}
          <div className="news-content">
            <style jsx>{`
              .news-content {
                color: #374151;
                line-height: 1.8;
              }
              
              .dark .news-content {
                color: #d1d5db;
              }

              .news-content :global(h1),
              .news-content :global(h2),
              .news-content :global(h3),
              .news-content :global(h4),
              .news-content :global(h5),
              .news-content :global(h6) {
                font-weight: 700;
                margin-top: 2rem;
                margin-bottom: 1rem;
                color: #111827;
                line-height: 1.3;
              }

              .dark .news-content :global(h1),
              .dark .news-content :global(h2),
              .dark .news-content :global(h3),
              .dark .news-content :global(h4),
              .dark .news-content :global(h5),
              .dark .news-content :global(h6) {
                color: #f9fafb;
              }

              .news-content :global(h1) {
                font-size: 2rem;
              }

              .news-content :global(h2) {
                font-size: 1.5rem;
              }

              .news-content :global(h3) {
                font-size: 1.25rem;
              }

              .news-content :global(p) {
                margin-bottom: 1.25rem;
                line-height: 1.8;
              }

              .news-content :global(a) {
                color: #2563eb;
                font-weight: 600;
                text-decoration: none;
                transition: all 0.2s ease;
                border-bottom: 2px solid transparent;
              }

              .news-content :global(a:hover) {
                color: #1d4ed8;
                border-bottom-color: #2563eb;
              }

              .dark .news-content :global(a) {
                color: #60a5fa;
              }

              .dark .news-content :global(a:hover) {
                color: #93c5fd;
                border-bottom-color: #60a5fa;
              }

              .news-content :global(blockquote) {
                border-left: 4px solid #2563eb;
                padding-left: 1.5rem;
                margin: 2rem 0;
                font-style: italic;
                color: #4b5563;
                background: #f3f4f6;
                padding: 1.5rem;
                border-radius: 0.5rem;
              }

              .dark .news-content :global(blockquote) {
                background: #1f2937;
                color: #9ca3af;
                border-left-color: #60a5fa;
              }

              .news-content :global(strong) {
                font-weight: 700;
                color: #111827;
              }

              .dark .news-content :global(strong) {
                color: #f9fafb;
              }

              .news-content :global(ul),
              .news-content :global(ol) {
                margin: 1.5rem 0;
                padding-left: 2rem;
              }

              .news-content :global(li) {
                margin-bottom: 0.5rem;
              }

              .news-content :global(img) {
                max-width: 100%;
                height: auto;
                border-radius: 0.75rem;
                margin: 2rem 0;
              }

              .news-content :global(code) {
                background: #f3f4f6;
                padding: 0.2rem 0.4rem;
                border-radius: 0.25rem;
                font-size: 0.875rem;
              }

              .dark .news-content :global(code) {
                background: #1f2937;
              }

              .news-content :global(pre) {
                background: #1f2937;
                color: #f9fafb;
                padding: 1rem;
                border-radius: 0.5rem;
                overflow-x: auto;
                margin: 1.5rem 0;
              }

              .news-content :global(div) {
                margin-bottom: 1rem;
              }
            `}</style>
            <div dangerouslySetInnerHTML={{ __html: news.content }} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}