import { ArticlesList } from '../components/articles/ArticlesList';

export default function ArticlesRoute() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Articles</h1>
      <ArticlesList />
    </div>
  );
} 