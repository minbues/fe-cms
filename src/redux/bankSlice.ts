import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Pagination } from "../interfaces/app.interface";
import { authAxios } from "../config/axiosConfig";
import endPoint from "../services";
import { parsePaginationHeaders } from "../shared/common";
import { showToast, ToastType } from "../shared/toast";
import { Bank, CreateBank } from "../interfaces/bank.interface";

interface BankState {
  isLoading: boolean;
  isLoadingAction: boolean;
  error: string | null;
  banks: Bank[];
  pagination: Pagination;
  qrDataURL: string | null;
}

const initialState: BankState = {
  isLoading: false,
  isLoadingAction: false,
  error: null,
  banks: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    totalItems: 0,
  },
  qrDataURL: "",
};

export const getListBank = createAsyncThunk(
  "bank/list",
  async (
    params: {
      isActive?: boolean;
      search?: string;
      page?: number;
      perPage?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAxios.get(endPoint.BANK.GET_LIST, {
        params,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteBank = createAsyncThunk(
  "bank/delete",
  async (bankId: string | number, { rejectWithValue }) => {
    try {
      const response = await authAxios.delete(
        endPoint.BANK.DELETE + `/${bankId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const create = createAsyncThunk(
  "bank/create",
  async (payload: CreateBank, { rejectWithValue }) => {
    try {
      const response = await authAxios.post(endPoint.BANK.CREATE, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const update = createAsyncThunk(
  "bank/update",
  async (args: { id: string; payload: CreateBank }, { rejectWithValue }) => {
    try {
      const { id, payload } = args;

      const response = await authAxios.patch(
        `${endPoint.BANK.UPDATE}/${id}`,
        payload
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const generateQR = createAsyncThunk(
  "qr/generateQRCode",
  async (bankId: string, { rejectWithValue }) => {
    try {
      const response = await authAxios.get(
        `${endPoint.VIETQR.GENERATE}/${bankId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const bankSlice = createSlice({
  name: "bank",
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
      .addCase(getListBank.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getListBank.fulfilled, (state, action) => {
        state.isLoading = false;
        state.banks = action.payload.items;
        state.pagination = parsePaginationHeaders(action.payload.headers);
      })
      .addCase(getListBank.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBank.pending, (state) => {
        state.isLoadingAction = true;
        state.error = null;
      })
      .addCase(deleteBank.fulfilled, (state) => {
        state.isLoadingAction = false;
        showToast(ToastType.SUCCESS, "Xoá thành công");
      })
      .addCase(deleteBank.rejected, (state, action) => {
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
      })
      .addCase(generateQR.pending, (state) => {
        state.isLoadingAction = true;
        state.error = null;
      })
      .addCase(generateQR.fulfilled, (state, action) => {
        state.isLoadingAction = false;
        if (action.payload.code === "00") {
          state.qrDataURL = action.payload.data.qrDataURL;
        } else {
          state.qrDataURL = null;
        }
      })
      .addCase(generateQR.rejected, (state, action) => {
        state.isLoadingAction = false;
        state.error = action.payload as string;
        showToast(ToastType.ERROR, "Tạo mã thất bại");
      });
  },
});

export const getLoading = (state: { bank: BankState }) => state.bank.isLoading;
export const getLoadingAction = (state: { bank: BankState }) =>
  state.bank.isLoadingAction;
export const getError = (state: { bank: BankState }) => state.bank.error;
export const getBanks = (state: { bank: BankState }) => state.bank.banks;
export const getPagination = (state: { bank: BankState }) =>
  state.bank.pagination;

export const getQrDataURL = (state: { bank: BankState }) =>
  state.bank.qrDataURL;

export const {} = bankSlice.actions;

export default bankSlice.reducer;
