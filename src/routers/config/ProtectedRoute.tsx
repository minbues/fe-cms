import { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { AppDispatch, RootState } from "../../redux/store";
import { Login } from "../../config/routeConfig";
import { clearAuth } from "../../redux/authSlice";

interface IProtectedRoute {
  children?: ReactNode;
}

export default function ProtectedRoute({ children }: IProtectedRoute) {
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();

  const { isAuthenticated, auth } = useSelector(
    (state: RootState) => state.auth
  );

  const redirect = `${Login}?redirectTo=${location.pathname}`;

  if (auth.token) {
    const decodedToken = jwtDecode(auth.token);
    const currentTime = Date.now() / 1000;

    if (!decodedToken.exp || decodedToken.exp < currentTime) {
      dispatch(clearAuth());
      return <Navigate to={redirect} replace />;
    }
  }

  if (!isAuthenticated) {
    return <Navigate to={redirect} replace />;
  }

  return children;
}
