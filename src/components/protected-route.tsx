import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import type {JSX} from "react";
import {GlobalLoader} from "@/components/global-loader.tsx";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) return <GlobalLoader />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
