import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authAxios } from "../config/axiosConfig";
import endPoint from "../services";
import { IProduct, IProductResponse } from "../interfaces/product.interface";
import { showToast, ToastType } from "../shared/toast";
import { parsePaginationHeaders } from "../shared/common";
import { Pagination } from "../interfaces/app.interface";

interface ProductState {
  isLoading: boolean;
  error: string | null;
  products: IProductResponse[];
  pagination: Pagination;
  product: IProductResponse | null;
}

const initialState: ProductState = {
  isLoading: false,
  error: null,
  products: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    totalItems: 0,
  },
  product: null,
};

export const createProduct = createAsyncThunk(
  "product/create",
  async (productData: Partial<IProduct>, { rejectWithValue }) => {
    try {
      const response = await authAxios.post(
        endPoint.PRODUCT.CREATE,
        productData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
export const updateProduct = createAsyncThunk(
  "product/update", // Action type
  async (
    args: { productId: string; productData: Partial<IProduct> },
    { rejectWithValue }
  ) => {
    try {
      const { productId, productData } = args;
      const response = await authAxios.patch(
        `${endPoint.PRODUCT.UPDATE}/${productId}`,
        productData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred"
      );
    }
  }
);

export const archiveProduct = createAsyncThunk(
  "product/archive",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await authAxios.patch(
        endPoint.PRODUCT.ARCHIVE + `/${productId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const detailProduct = createAsyncThunk(
  "product/detail",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await authAxios.get(
        endPoint.PRODUCT.DETAIL + `/${productId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getListActiveProduct = createAsyncThunk(
  "product/list-active",
  async (
    params: {
      isActive?: boolean;
      name?: string;
      page?: number;
      perPage?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAxios.get(endPoint.PRODUCT.ALL, {
        params,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.isLoading = false;
        showToast(ToastType.SUCCESS, "Tạo sản phẩm thành công");
      })
      .addCase(createProduct.rejected, (state) => {
        state.isLoading = false;
        showToast(ToastType.ERROR, "Tạo sản phẩm lỗi");
      })
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
        showToast(ToastType.SUCCESS, "Cập nhật sản phẩm thành công");
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        showToast(ToastType.ERROR, "Cập nhật sản phẩm thất bại");
      })
      .addCase(getListActiveProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getListActiveProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.items;

        state.pagination = parsePaginationHeaders(action.payload.headers);
      })
      .addCase(getListActiveProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(archiveProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(archiveProduct.fulfilled, (state) => {
        state.isLoading = false;
        showToast(ToastType.SUCCESS, "Lưu trữ sản phẩm thành công");
      })
      .addCase(archiveProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        showToast(ToastType.ERROR, "Lưu trữ sản phẩm thất bại");
      })
      .addCase(detailProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(detailProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
      })
      .addCase(detailProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        showToast(ToastType.ERROR, "Lấy thông tin chi tiết sản phẩm thất bại");
      });
  },
});

export const getLoading = (state: { product: ProductState }) =>
  state.product.isLoading;
export const getError = (state: { product: ProductState }) =>
  state.product.error;
export const getProducts = (state: { product: ProductState }) =>
  state.product.products;
export const getPagination = (state: { product: ProductState }) =>
  state.product.pagination;
export const getProduct = (state: { product: ProductState }) =>
  state.product.product;

export const {} = productSlice.actions;

export default productSlice.reducer;
