// src/App.tsx
import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "@/routes/Index";
import { useInitializeAuth } from "@/stores/authStore";

function App() {
  useInitializeAuth();
  return <RouterProvider router={router} />;
}

export default App;
