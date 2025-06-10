import React, { Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Root from './root';
import { AdminRouteGuard } from './lib/guards/AdminRouteGuard';

// Create a loading component
const Loading = () => <div className="p-4 flex justify-center items-center h-24">
  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
</div>;

// Create an error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Route error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="mb-4">{this.state.error?.message || "An unexpected error occurred"}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrap component with error boundary and suspense
const withErrorAndSuspense = (Component: React.LazyExoticComponent<any>) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};

// Wrap component with AdminRouteGuard, error boundary, and suspense
const withAdminProtection = (Component: React.LazyExoticComponent<any>) => {
  return (
    <AdminRouteGuard>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Component />
        </Suspense>
      </ErrorBoundary>
    </AdminRouteGuard>
  );
};

// Import your route components
// Assuming these files exist; if not you'll need to create them
const Layout = React.lazy(() => import('./components/layout'));
const Home = React.lazy(() => import('./routes/home'));
const Auth = React.lazy(() => import('./routes/auth'));
const Dashboard = React.lazy(() => import('./routes/dashboard'));
const DashboardIndex = React.lazy(() => import('./routes/dashboard.index'));
const DashboardProfile = React.lazy(() => import('./routes/dashboard.profile'));
const DashboardSettings = React.lazy(() => import('./routes/dashboard.settings'));
const DashboardFavorites = React.lazy(() => import('./routes/dashboard.favorites'));
const DashboardArticles = React.lazy(() => import('./routes/dashboard.articles'));
const DashboardWrite = React.lazy(() => import('./routes/dashboard.write'));
const Articles = React.lazy(() => import('./routes/articles'));
const ArticlesNew = React.lazy(() => import('./routes/articles.new'));
const ArticlesId = React.lazy(() => import('./routes/articles.$id'));
const ArticlesEditId = React.lazy(() => import('./routes/articles.edit.$id'));

// Admin routes
const AdminLayout = React.lazy(() => import('./admin/layout'));
const AdminDashboard = React.lazy(() => import('./admin/page'));
const AdminUsers = React.lazy(() => import('./admin/users/page'));
const AdminArticles = React.lazy(() => import('./admin/articles/page'));
const AdminDatabase = React.lazy(() => import('./admin/database/page'));
const AdminNewsletter = React.lazy(() => import('./admin/newsletter/page'));

// About pages
const About = React.lazy(() => import('./about/page'));
const AboutMission = React.lazy(() => import('./about/mission/page'));
const AboutImpact = React.lazy(() => import('./about/impact/page'));
const AboutTeam = React.lazy(() => import('./about/team/page'));
const AboutCollaborations = React.lazy(() => import('./about/collaborations/page'));

// Contact page
const Contact = React.lazy(() => import('./contact/page'));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={withErrorAndSuspense(Layout)}>
        <Route index element={withErrorAndSuspense(Home)} />
        <Route path="auth" element={withErrorAndSuspense(Auth)} />
        
        <Route path="articles">
          <Route index element={withErrorAndSuspense(Articles)} />
          <Route path="new" element={withErrorAndSuspense(ArticlesNew)} />
          <Route path=":id" element={withErrorAndSuspense(ArticlesId)} />
          <Route path="edit/:id" element={withErrorAndSuspense(ArticlesEditId)} />
        </Route>
        <Route path="about">
          <Route index element={withErrorAndSuspense(About)} />
          <Route path="mission" element={withErrorAndSuspense(AboutMission)} />
          <Route path="impact" element={withErrorAndSuspense(AboutImpact)} />
          <Route path="team" element={withErrorAndSuspense(AboutTeam)} />
          <Route path="collaborations" element={withErrorAndSuspense(AboutCollaborations)} />
        </Route>
        <Route path="contact" element={withErrorAndSuspense(Contact)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      
      <Route path="/dashboard" element={withErrorAndSuspense(Dashboard)}>
        <Route index element={withErrorAndSuspense(DashboardIndex)} />
        <Route path="profile" element={withErrorAndSuspense(DashboardProfile)} />
        <Route path="settings" element={withErrorAndSuspense(DashboardSettings)} />
        <Route path="favorites" element={withErrorAndSuspense(DashboardFavorites)} />
        <Route path="articles" element={withErrorAndSuspense(DashboardArticles)} />
        <Route path="write" element={withErrorAndSuspense(DashboardWrite)} />
      </Route>
      
      {/* Admin Routes (protected) */}
      <Route
        path="/admin"
        element={
          <ErrorBoundary>
            <Suspense fallback={<Loading />}>
              <AdminRouteGuard>
                <AdminLayout>
                  <Outlet />
                </AdminLayout>
              </AdminRouteGuard>
            </Suspense>
          </ErrorBoundary>
        }
      >
        <Route index element={withErrorAndSuspense(AdminDashboard)} />
        <Route path="users" element={withErrorAndSuspense(AdminUsers)} />
        <Route path="articles" element={withErrorAndSuspense(AdminArticles)} />
        <Route path="database" element={withErrorAndSuspense(AdminDatabase)} />
        <Route path="newsletter" element={withErrorAndSuspense(AdminNewsletter)} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 