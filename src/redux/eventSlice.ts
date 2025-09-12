import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Pagination } from "../interfaces/app.interface";
import { authAxios } from "../config/axiosConfig";
import endPoint from "../services";
import { parsePaginationHeaders } from "../shared/common";
import { showToast, ToastType } from "../shared/toast";
import {
  CreateEvent,
  DiscountEvent,
  UpdateEvent,
} from "../interfaces/event.interface";

interface EventState {
  isLoading: boolean;
  isLoadingAction: boolean;
  error: string | null;
  events: DiscountEvent[];
  pagination: Pagination;
}

const initialState: EventState = {
  isLoading: false,
  isLoadingAction: false,
  error: null,
  events: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    totalItems: 0,
  },
};

export const getListEvent = createAsyncThunk(
  "event/list",
  async (
    params: {
      search?: string;
      page?: number;
      perPage?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAxios.get(endPoint.EVENT.GET, {
        params,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "event/delete",
  async (eventId: string, { rejectWithValue }) => {
    try {
      const response = await authAxios.delete(
        endPoint.EVENT.DELETE.replace(":id", eventId)
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const create = createAsyncThunk(
  "event/create",
  async (payload: CreateEvent, { rejectWithValue }) => {
    try {
      const response = await authAxios.post(endPoint.EVENT.CREATE, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const update = createAsyncThunk(
  "event/update",
  async (args: { id: string; payload: UpdateEvent }, { rejectWithValue }) => {
    try {
      const { id, payload } = args;

      const response = await authAxios.patch(
        endPoint.EVENT.UPDATE.replace(":id", id),
        payload
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(create.pending, (state) => {
        state.isLoadingAction = true;
        state.error = null;
      })
      .addCase(create.fulfilled, (state) => {
        state.isLoadingAction = false;
        showToast(ToastType.SUCCESS, "Tạo sự kiện thành công");
      })
      .addCase(create.rejected, (state) => {
        state.isLoadingAction = false;
        showToast(ToastType.ERROR, "Tạo sự kiện lỗi");
      })
      .addCase(getListEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getListEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload.items;
        state.pagination = parsePaginationHeaders(action.payload.headers);
      })
      .addCase(getListEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteEvent.pending, (state) => {
        state.isLoadingAction = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state) => {
        state.isLoadingAction = false;
        showToast(ToastType.SUCCESS, "Xoá thành công");
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.isLoadingAction = false;
        state.error = action.payload as string;
        showToast(ToastType.ERROR, "Xoá thất bại");
      })
      .addCase(update.pending, (state) => {
        state.isLoadingAction = true;
        state.error = null;
      })
      .addCase(update.fulfilled, (state) => {
        state.isLoadingAction = false;
        showToast(ToastType.SUCCESS, "Cập nhật thành công");
      })
      .addCase(update.rejected, (state, action) => {
        state.isLoadingAction = false;
        state.error = action.payload as string;
        showToast(ToastType.ERROR, action.payload as string);
      });
  },
});

export const getLoading = (state: { event: EventState }) =>
  state.event.isLoading;
export const getLoadingAction = (state: { event: EventState }) =>
  state.event.isLoadingAction;
export const getError = (state: { event: EventState }) => state.event.error;
export const getEvents = (state: { event: EventState }) => state.event.events;
export const getPagination = (state: { event: EventState }) =>
  state.event.pagination;

export const {} = eventSlice.actions;

export default eventSlice.reducer;
