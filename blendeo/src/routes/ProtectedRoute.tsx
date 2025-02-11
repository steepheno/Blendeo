import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthGuard } from "@/stores/authStore";
import { LoadingSpinner } from "@/components/common/LoadingSpinner"; // 로딩 컴포넌트 경로는 적절히 수정해주세요

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthorized, isInitializing } = useAuthGuard();
  const location = useLocation();

  // 초기화 중일 때는 로딩 표시
  if (isInitializing) {
    return <LoadingSpinner />;
  }

  // 초기화가 완료되고 인증되지 않은 경우에만 리다이렉트
  if (!isAuthorized) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}