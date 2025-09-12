import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authAxios, unauthAxios } from "../config/axiosConfig";
import endPoint from "../services";
import {
  ILoginRequest,
  IUser,
  IAuthResponse,
  Auth,
} from "../interfaces/auth.interface";
import { showToast, ToastType } from "../shared/toast";
import { JWTPayload } from "../interfaces/app.interface";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  user: IUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  auth: Auth;
}

interface ISetAuthPayloadParams {
  token: string;
  refreshToken: string;
  tokenExpires: number;
  refreshExpires: number;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  auth: {
    token: localStorage.getItem("authToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    tokenExpires: Number(localStorage.getItem("tokenExpires")) || null,
    refreshExpires: Number(localStorage.getItem("refreshExpires")) || null,
  },
};

export const loginUser = createAsyncThunk<
  IAuthResponse,
  ILoginRequest,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await unauthAxios.post<IAuthResponse>(
      endPoint.AUTH.LOGIN,
      credentials
    );

    const decoded = jwtDecode<JWTPayload>(response.data.token);
    if (decoded.role.name !== "Admin") {
      return rejectWithValue("Bạn không có quyền truy cập");
    }

    // Nếu là admin thì lưu token
    localStorage.setItem("authToken", response.data.token!);
    localStorage.setItem("refreshToken", response.data.refreshToken!);
    localStorage.setItem(
      "tokenExpires",
      response.data.tokenExpires!.toString()
    );
    localStorage.setItem(
      "refreshExpires",
      response.data.refreshExpires!.toString()
    );

    localStorage.setItem("authToken", response.data.token!);
    localStorage.setItem("refreshToken", response.data.refreshToken!);
    localStorage.setItem(
      "tokenExpires",
      response.data.tokenExpires!.toString()
    );
    localStorage.setItem(
      "refreshExpires",
      response.data.refreshExpires!.toString()
    );

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authAxios.post(endPoint.AUTH.LOGOUT);

      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenExpires");
    } catch (error: any) {
      console.error("Logout error:", error);
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<ISetAuthPayloadParams>) => {
      state.isAuthenticated = true;
      state.auth = {
        ...action.payload,
      };
    },

    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.auth = {
        token: null,
        refreshToken: null,
        tokenExpires: null,
        refreshExpires: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<IAuthResponse>) => {
          const decoded: JWTPayload = jwtDecode(action.payload.token!);

          state.isLoading = false;
          state.auth = {
            token: action.payload.token,
            refreshToken: action.payload.refreshToken,
            tokenExpires: action.payload.tokenExpires,
            refreshExpires: action.payload.refreshExpires,
          };
          state.user = {
            role: decoded.role.id,
            id: decoded.id,
          };
          state.isAuthenticated = true;
          showToast(ToastType.SUCCESS, "Đăng nhập thành công");
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Đăng nhập thất bại";
        showToast(ToastType.ERROR, state.error);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.auth = {
          token: null,
          refreshToken: null,
          tokenExpires: null,
          refreshExpires: null,
        };
        showToast(ToastType.SUCCESS, "Đăng xuất thành công");
      });
  },
});

export const getUserProfile = (state: { auth: AuthState }) => state.auth.user;
export const getLoadingLogin = (state: { auth: AuthState }) =>
  state.auth.isLoading;
export const getErrorLogin = (state: { auth: AuthState }) => state.auth.error;
export const getAuth = (state: { auth: AuthState }) => state.auth.auth;
export const getUserId = (state: { auth: AuthState }) => state.auth.user?.id;
export const getIsAuth = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;

export const { setAuth, clearAuth } = authSlice.actions;

export default authSlice.reducer;
