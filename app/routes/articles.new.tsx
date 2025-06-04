import { ArticleEditor } from '../components/articles/ArticleEditor';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export default function NewArticleRoute() {
  return (
    <ProtectedRoute allowedRoles={['writer', 'admin']}>
        <ArticleEditor />
    </ProtectedRoute>
  );
} 