// root.tsx
import { Outlet } from "react-router-dom";
import React from "react";
import { AuthProvider } from "./lib/contexts/AuthContext";
import { NotificationProvider } from "./lib/contexts/NotificationContext";

export default function Root() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="app">
          <Outlet />
        </div>
      </NotificationProvider>
    </AuthProvider>
  );
}
