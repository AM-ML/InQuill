import { useLocation, Navigate } from "react-router-dom";

export default function DashboardEditRedirect() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  
  if (!id) {
    return <Navigate to="/dashboard/write" replace />;
  }
  
  return <Navigate to={`/dashboard/write?id=${id}`} replace />;
} 