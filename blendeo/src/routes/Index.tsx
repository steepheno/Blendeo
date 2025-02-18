// src/routes/Index.tsx
import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

import SignInPage from "@/pages/auth/SignInPage";
import SignUpPage from "@/pages/auth/SignUpPage";
import MainPage from "@/pages/main/MainPage";
import ChatPage from "@/pages/chat/ChatPage";

import ProjectDetailPage from "@/pages/project/ProjectDetailPage";

import ProjectTreePage from "@/pages/project/ProjectTreePage";
import UserProfilePage from "@/pages/profile/UserProfilePage";
import MyProfilePage from "@/pages/profile/MyProfilePage";
import NotFoundPage from "@/pages/error/NotFoundPage";
import VideoCallPage from "@/pages/chat/VideoCallPage";
import InstrumentSelector from "@/components/signup/InstrumentSelector";

import SeedRecordPage from "@/pages/seed/SeedRecodePage";
import SeedEditPage from "@/pages/seed/SeedEditPage";
import ForkRecordPage from "@/pages/fork/ForkRecordPage";
import ProjectUploadPage from "@/pages/project/ProjectUploadPage";
import ForkEditor from "@/pages/fork/ForkEditPage";
import ExplorePage from "@/pages/explore/ExplorePage";
import ExploreFullScreenPage from "@/pages/explore/ExploreFullScreenPage";

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
      { path: "signup2", element: <InstrumentSelector /> },
    ],
  },
  {
    path: "/explore",
    children: [
      { path: "", element: <ExplorePage /> },
      { path: "full", element: <ExploreFullScreenPage/> },
    ],
  },
  {
    path: "/seed",
    children: [
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
            <ProjectUploadPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/fork",
    children: [
      {
        path: "record",
        element: (
          <ProtectedRoute>
            <ForkRecordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "edit",
        element: (
          <ProtectedRoute>
            <ForkEditor />
          </ProtectedRoute>
        ),
      },
      {
        path: "upload",
        element: (
          <ProtectedRoute>
            <ProjectUploadPage />
          </ProtectedRoute>
        ),
      },
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
      {
        path: ":roomId", // /chat/:roomId
        element: (
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ":roomId/video", // /chat/:roomId/video
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
