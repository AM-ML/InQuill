import React from 'react';
import { useParams } from 'react-router-dom';
import { ArticleDetail } from '../components/articles/ArticleDetail';
import { ThemeProvider } from '../components/theme-provider';

export default function ArticleViewPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <ArticleDetail id={id} />
        </main>
      </div>
    </ThemeProvider>
  );
} 