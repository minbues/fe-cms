import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import Loadable from "../components/common/Loadable";
import { Login } from "../config/routeConfig";
import { MinimalLayout } from "../layouts";

const SignInPage = Loadable(lazy(() => import("../pages/auth/signin")));

const AuthRoutes: RouteObject = {
  path: "/",
  element: <MinimalLayout />,
  children: [
    {
      index: true,
      element: <Navigate to={Login} replace />,
    },
    {
      path: Login,
      element: <SignInPage />,
    },
  ],
};

export default AuthRoutes;
