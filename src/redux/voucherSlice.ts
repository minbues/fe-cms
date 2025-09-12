import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Pagination } from "../interfaces/app.interface";
import { authAxios } from "../config/axiosConfig";
import endPoint from "../services";
import { parsePaginationHeaders } from "../shared/common";
import { showToast, ToastType } from "../shared/toast";
import { CreateVoucher, Voucher } from "../interfaces/voucher.interface";

interface VoucherState {
  isLoading: boolean;
  isLoadingAction: boolean;
  error: string | null;
  vouchers: Voucher[];
  pagination: Pagination;
}

const initialState: VoucherState = {
  isLoading: false,
  isLoadingAction: false,
  error: null,
  vouchers: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    totalItems: 0,
  },
};

export const getListVoucher = createAsyncThunk(
  "voucher/list",
  async (
    params: {
      isActive?: boolean;
      code?: string;
      page?: number;
      perPage?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAxios.get(endPoint.VOUCHER.GET_LIST, {
        params,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteVoucher = createAsyncThunk(
  "voucher/delete",
  async (voucherId: string | number, { rejectWithValue }) => {
    try {
      const response = await authAxios.delete(
        endPoint.VOUCHER.DELETE + `/${voucherId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const create = createAsyncThunk(
  "voucher/create",
  async (payload: CreateVoucher, { rejectWithValue }) => {
    try {
      const response = await authAxios.post(endPoint.VOUCHER.CREATE, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const update = createAsyncThunk(
  "voucher/update",
  async (args: { id: string; payload: CreateVoucher }, { rejectWithValue }) => {
    try {
      const { id, payload } = args;

      const response = await authAxios.patch(
        `${endPoint.VOUCHER.UPDATE}/${id}`,
        payload
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const voucherSlice = createSlice({
  name: "voucher",
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
        showToast(ToastType.SUCCESS, "Tạo thành công");
      })
      .addCase(create.rejected, (state) => {
        state.isLoadingAction = false;
        showToast(ToastType.ERROR, "Tạo lỗi");
      })
      .addCase(getListVoucher.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getListVoucher.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vouchers = action.payload.items;
        state.pagination = parsePaginationHeaders(action.payload.headers);
      })
      .addCase(getListVoucher.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteVoucher.pending, (state) => {
        state.isLoadingAction = true;
        state.error = null;
      })
      .addCase(deleteVoucher.fulfilled, (state) => {
        state.isLoadingAction = false;
        showToast(ToastType.SUCCESS, "Xoá thành công");
      })
      .addCase(deleteVoucher.rejected, (state, action) => {
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

export const getLoading = (state: { voucher: VoucherState }) =>
  state.voucher.isLoading;
export const getLoadingAction = (state: { voucher: VoucherState }) =>
  state.voucher.isLoadingAction;
export const getError = (state: { voucher: VoucherState }) =>
  state.voucher.error;
export const getVouchers = (state: { voucher: VoucherState }) =>
  state.voucher.vouchers;
export const getPagination = (state: { voucher: VoucherState }) =>
  state.voucher.pagination;

export const {} = voucherSlice.actions;

export default voucherSlice.reducer;
