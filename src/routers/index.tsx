import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layouts";
import CMSRoutes from "./cms.router";
import AuthRoutes from "./auth.router";
import ProtectedRoute from "./config/ProtectedRoute";

const router = createBrowserRouter([
  AuthRoutes,
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    // errorElement: <ErrorPage />,
    children: [...CMSRoutes],
  },
  {
    path: "*",
    // element: <NotFound />,
  },
]);

export default router;
