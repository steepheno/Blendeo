// src/routes/Index.tsx
import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

import SignInPage from "@/pages/auth/SignInPage";
import SignUpPage from "@/pages/auth/SignUpPage";
import MainPage from "@/pages/main/MainPage";
import ChatPage from "@/pages/chat/ChatPage";

import ProjectDetailPage from "@/pages/project/ProjectDetailPage";
// import SeedRecordPage from "@/pages/seed/SeedRecordPage";
// import SeedEditPage from "@/pages/seed/SeedEditPage";
// import SeedUploadPage from "@/pages/seed/SeedUploadPage";
import ForkRecordPage from "@/pages/project/ForkRecordPage";
// import ForkEditPage from "@/pages/project/ForkEditPage";
// import ForkUploadPage from "@/pages/project/ForkUploadPage";

import ProjectTreePage from "@/pages/project/ProjectTreePage";
import UserProfilePage from "@/pages/profile/UserProfilePage";
import MyProfilePage from "@/pages/profile/MyProfilePage";
import NotFoundPage from "@/pages/error/NotFoundPage";
// import VideoCallPage from "@/pages/chat/VideoCallPage";

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
      // {
      //   path: "record",
      //   element: (
      //     <ProtectedRoute>
      //       <SeedRecordPage />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "edit",
      //   element: (
      //     <ProtectedRoute>
      //       <SeedEditPage />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "upload",
      //   element: (
      //     <ProtectedRoute>
      //       <SeedUploadPage />
      //     </ProtectedRoute>
      //   ),
      // },

      // 포크 관련 라우팅
      {
        path: "forkrecord",
        element: (
          <ProtectedRoute>
            <ForkRecordPage />
          </ProtectedRoute>
        ),
      },
      // {
      //   path: "forkedit",
      //   element: (
      //     <ProtectedRoute>
      //       <ForkEditPage />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "forkupload",
      //   element: (
      //     <ProtectedRoute>
      //       <ForkUploadPage />
      //     </ProtectedRoute>
      //   ),
      // },
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
      // {
      //   path: "video", // /chat/video
      //   element: (
      //     <ProtectedRoute>
      //       <VideoCallPage />
      //     </ProtectedRoute>
      //   ),
      // },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
