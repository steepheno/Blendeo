// src/routes/Index.tsx
import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

import SignInPage from "@/pages/auth/SignInPage";
import SignUpPage from "@/pages/auth/SignUpPage";
import MainPage from "@/pages/main/MainPage";
import ChatPage from "@/pages/chat/ChatPage";

import ProjectDetailPage from "@/pages/project/ProjectDetailPage";
import ForkRecordPage from "@/pages/project/ForkRecordPage";

import ProjectTreePage from "@/pages/project/ProjectTreePage";
import UserProfilePage from "@/pages/profile/UserProfilePage";
import MyProfilePage from "@/pages/profile/MyProfilePage";
import NotFoundPage from "@/pages/error/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/auth",
    children: [
      { path: "signin", element: <SignInPage /> },
      { path: "signup", element: <SignUpPage /> },
    ],
  },
  {
    path: "/project",
    children: [
      {
        path: ":projectId",
        element: <ProjectDetailPage />,
      },
      {
        path: "forkrecord",
        element: (
          <ProtectedRoute>
            <ForkRecordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ":projectId/tree",
        element: <ProjectTreePage />,
      },
    ],
  },
  {
    path: "/profile",
    children: [
      {
        path: ":userId",
        element: <UserProfilePage />,
      },
      {
        path: "me",
        element: (
          <ProtectedRoute>
            <MyProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // 채팅 관련 라우트 추가
  {
    path: "/chat",
    children: [
      {
        path: "", // /chat
        element: (
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
