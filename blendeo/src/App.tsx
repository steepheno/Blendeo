// src/App.tsx
import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "@/routes/Index";
import { useInitializeAuth } from "@/stores/authStore";
import { Toaster } from "sonner"; // import 추가

function App() {
  const { isInitializing } = useInitializeAuth();

  if (isInitializing) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Toaster richColors position="top-center" expand={false} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
