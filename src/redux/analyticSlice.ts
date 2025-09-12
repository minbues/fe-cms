import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Pagination } from "../interfaces/app.interface";
import { authAxios } from "../config/axiosConfig";
import endPoint from "../services";
import {
  GetRevenueParams,
  GetTopProductsParams,
  IProductInventory,
  RevenueItem,
  TopProductItem,
} from "../interfaces/analytic.interface";
import { parsePaginationHeaders } from "src/shared/common";
import { showToast, ToastType } from "src/shared/toast";

interface AnalyticState {
  error: string | null;
  pagination: Pagination;
  analyticInMonth: {
    totalRevenue: number;
    totalProductSold: number;
    totalOrders: number;
    totalNewCustomers: number;
  };
  revenueData: RevenueItem[];
  revenueLoading: boolean;
  topProductData: TopProductItem[];
  topProductLoading: boolean;
  inventoryLoading: boolean;
  inventory: IProductInventory[];
}

const initialState: AnalyticState = {
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    totalItems: 0,
  },
  analyticInMonth: {
    totalRevenue: 0,
    totalProductSold: 0,
    totalOrders: 0,
    totalNewCustomers: 0,
  },
  revenueData: [],
  revenueLoading: false,
  topProductData: [],
  topProductLoading: false,
  inventoryLoading: false,
  inventory: [],
};

export const getAnalyticInMonth = createAsyncThunk(
  "analytics/getAnalyticInMonth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAxios.get(endPoint.ANALYTICS.BASIC);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getRevenueData = createAsyncThunk<
  any,
  GetRevenueParams,
  { rejectValue: string }
>("analytics/getRevenueData", async (params, { rejectWithValue }) => {
  try {
    const response = await authAxios.get(endPoint.ANALYTICS.REVENUE, {
      params,
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const getTopProductsData = createAsyncThunk<
  TopProductItem[],
  GetTopProductsParams,
  { rejectValue: string }
>("topProducts/getTopProductsData", async (params, { rejectWithValue }) => {
  try {
    const response = await authAxios.get(endPoint.ANALYTICS.PRODUCTS, {
      params,
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const getInventory = createAsyncThunk(
  "analytics/inventory",
  async (
    params: {
      page?: number;
      perPage?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAxios.get(endPoint.ANALYTICS.INVENTORY, {
        params,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const bulkUpdateDiscount = createAsyncThunk<
  any,
  { ids: string[]; discount: number },
  { rejectValue: string }
>("topProducts/blukUpdateDiscount", async (payload, { rejectWithValue }) => {
  try {
    const response = await authAxios.patch(
      endPoint.PRODUCT.BULK_UPDATE_DISCOUNT,
      payload
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message);
  }
});

const analyticSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAnalyticInMonth.pending, (state) => {
        state.error = null;
      })
      .addCase(getAnalyticInMonth.fulfilled, (state, action) => {
        state.analyticInMonth = {
          ...action.payload,
        };
      })
      .addCase(getAnalyticInMonth.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(getRevenueData.pending, (state) => {
        state.revenueLoading = true;
        state.error = null;
      })
      .addCase(getRevenueData.fulfilled, (state, action) => {
        state.revenueData = action.payload;
        state.revenueLoading = false;
      })
      .addCase(getRevenueData.rejected, (state, action) => {
        state.error = action.payload as string;
        state.revenueLoading = false;
      })
      .addCase(getTopProductsData.pending, (state) => {
        state.topProductLoading = true;
        state.error = null;
      })
      .addCase(getTopProductsData.fulfilled, (state, action) => {
        state.topProductData = action.payload;
        state.topProductLoading = false;
      })
      .addCase(getTopProductsData.rejected, (state, action) => {
        state.error = action.payload ?? "Lỗi không xác định";
        state.topProductLoading = false;
      })
      .addCase(getInventory.pending, (state) => {
        state.inventoryLoading = true;
        state.error = null;
      })
      .addCase(getInventory.fulfilled, (state, action) => {
        state.inventory = action.payload.items;
        state.pagination = parsePaginationHeaders(action.payload.headers);
        state.inventoryLoading = false;
      })
      .addCase(getInventory.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Lỗi không xác định";
        state.inventoryLoading = false;
      })
      .addCase(bulkUpdateDiscount.pending, (state) => {
        state.inventoryLoading = true;
        state.error = null;
      })
      .addCase(bulkUpdateDiscount.fulfilled, (state, action) => {
        state.inventory = action.payload.items;
        state.inventoryLoading = false;
        showToast(ToastType.SUCCESS, "Cập nhật giảm giá thành công");
      })
      .addCase(bulkUpdateDiscount.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Lỗi không xác định";
        state.inventoryLoading = false;
        showToast(ToastType.ERROR, action.payload as string);
      });
  },
});

export const {} = analyticSlice.actions;
export const getDataAnalyticInMonth = (state: { analytics: AnalyticState }) =>
  state.analytics.analyticInMonth;

export const getRevenueDataSelector = (state: {
  analytics: AnalyticState;
}) => ({
  data: state.analytics.revenueData,
  loading: state.analytics.revenueLoading,
});

export const getTopProductsDataSelector = (state: {
  analytics: AnalyticState;
}) => ({
  data: state.analytics.topProductData,
  loading: state.analytics.topProductLoading,
});

export const getInventorySelector = (state: { analytics: AnalyticState }) => ({
  data: state.analytics.inventory,
  loading: state.analytics.inventoryLoading,
  pagination: state.analytics.pagination,
});

export default analyticSlice.reducer;
