// src/routes/Index.tsx
import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

import SignInPage from "@/pages/auth/SignInPage";
import SignUpPage from "@/pages/auth/SignUpPage";
import MainPage from "@/pages/main/MainPage";
import ChatPage from "@/pages/chat/ChatPage";

import ProjectDetailPage from "@/pages/project/ProjectDetailPage";
import SeedRecordPage from "@/pages/seed/SeedRecordPage";
import SeedEditPage from "@/pages/seed/SeedEditPage";
import SeedUploadPage from "@/pages/seed/SeedUploadPage";
import ProjectRecordPage from "@/pages/project/ProjectRecordPage";
import ProjectEditPage from "@/pages/project/ProjectEditPage";
import ProjectUploadPage from "@/pages/project/ProjectUploadPage";

import ProjectTreePage from "@/pages/project/ProjectTreePage";
import UserProfilePage from "@/pages/profile/UserProfilePage";
import MyProfilePage from "@/pages/profile/MyProfilePage";
import NotFoundPage from "@/pages/error/NotFoundPage";
import VideoCallPage from "@/pages/chat/VideoCallPage";

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

      // 최초 촬영 라우팅
      {
        path: "record",
        element: (
          <ProtectedRoute>
            <SeedRecordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "edit",
        element: (
          <ProtectedRoute>
            <SeedEditPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "upload",
        element: (
          <ProtectedRoute>
            <SeedUploadPage />
          </ProtectedRoute>
        ),
      },

      // 포크 관련 라우팅
      {
        path: "forkrecord",
        element: (
          <ProtectedRoute>
            <ProjectRecordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "forkedit",
        element: (
          <ProtectedRoute>
            <ProjectEditPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "forkupload",
        element: (
          <ProtectedRoute>
            <ProjectUploadPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "tree/:projectId",
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
      {
        path: "video", // /chat/video
        element: (
          <ProtectedRoute>
            <VideoCallPage />
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
