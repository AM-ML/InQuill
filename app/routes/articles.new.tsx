import { ArticleEditor } from '../components/articles/ArticleEditor';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export default function NewArticleRoute() {
  return (
    <ProtectedRoute allowedRoles={['writer', 'admin']}>
      <AppLayout>
        <ArticleEditor />
      </AppLayout>
    </ProtectedRoute>
  );
} 