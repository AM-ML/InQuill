import { ArticleEditor } from '../components/articles/ArticleEditor';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export default function EditArticleRoute() {
  return (
    <ProtectedRoute allowedRoles={['writer', 'admin', 'owner']}>
        <ArticleEditor />
    </ProtectedRoute>
  );
}