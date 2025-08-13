import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
//Aos Animation
import "aos/dist/aos.css";
import Aos from "aos";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./router/router";
import AuthProvider from "./context/AuthProvider";
Aos.init();
// Create a client
const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="font-urbanist max-w-7xl mx-auto">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />,
        </AuthProvider>
      </QueryClientProvider>
    </div>
  </StrictMode>
);
