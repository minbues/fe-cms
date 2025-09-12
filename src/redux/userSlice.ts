import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Pagination } from "../interfaces/app.interface";
import { CreateUser, UpdateUser, User } from "../interfaces/user.interface";
import { authAxios } from "../config/axiosConfig";
import endPoint from "../services";
import { parsePaginationHeaders } from "../shared/common";
import { showToast, ToastType } from "../shared/toast";

interface UserState {
  isLoading: boolean;
  isLoadingAction: boolean;
  error: string | null;
  users: User[];
  pagination: Pagination;
}

const initialState: UserState = {
  isLoading: false,
  isLoadingAction: false,
  error: null,
  users: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    totalItems: 0,
  },
};

export const getListUser = createAsyncThunk(
  "user/list",
  async (
    params: { role?: number; search?: string; page?: number; perPage?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAxios.get(endPoint.USER.GET_LIST, {
        params,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/delete",
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await authAxios.delete(endPoint.USER.DELETE + `/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createUser = createAsyncThunk(
  "user/create",
  async (payload: CreateUser, { rejectWithValue }) => {
    try {
      const response = await authAxios.post(
        endPoint.USER.CREATE_BY_ADMIN,
        payload
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/update",
  async (args: { id: string; payload: UpdateUser }, { rejectWithValue }) => {
    try {
      const { id, payload } = args;
      const response = await authAxios.patch(
        `${endPoint.USER.UPDATE}/${id}`,
        payload
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.isLoadingAction = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.isLoadingAction = false;
        showToast(ToastType.SUCCESS, "Tạo thành công");
      })
      .addCase(createUser.rejected, (state) => {
        state.isLoadingAction = false;
        showToast(ToastType.ERROR, "Tạo lỗi");
      })
      .addCase(getListUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getListUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.items;
        state.pagination = parsePaginationHeaders(action.payload.headers);
      })
      .addCase(getListUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoadingAction = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.isLoadingAction = false;
        showToast(ToastType.SUCCESS, "Xoá thành công");
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoadingAction = false;
        state.error = action.payload as string;
        showToast(ToastType.ERROR, "Xoá thất bại");
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoadingAction = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.isLoadingAction = false;
        showToast(ToastType.SUCCESS, "Cập nhật thành công");
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoadingAction = false;
        state.error = action.payload as string;
        showToast(ToastType.ERROR, "Cập nhật thất bại");
      });
  },
});

export const getLoading = (state: { user: UserState }) => state.user.isLoading;
export const getLoadingAction = (state: { user: UserState }) =>
  state.user.isLoadingAction;
export const getError = (state: { user: UserState }) => state.user.error;
export const getusers = (state: { user: UserState }) => state.user.users;
export const getPagination = (state: { user: UserState }) =>
  state.user.pagination;

export const {} = userSlice.actions;

export default userSlice.reducer;
