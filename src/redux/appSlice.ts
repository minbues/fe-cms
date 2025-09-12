import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAxios } from "../config/axiosConfig";
import endPoint from "../services";
import { showToast, ToastType } from "../shared/toast";

interface AppState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  masterData: any;
  masterDataRecordId: string | null;
  defaultPerPage: number;
}

const initialState: AppState = {
  isLoading: false,
  error: null,
  success: null,
  masterData: null,
  masterDataRecordId: null,
  defaultPerPage: 10,
};

// Thunk để fetch master data từ API
export const getMasterData = createAsyncThunk(
  "app/getMasterData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAxios.get(endPoint.MASTER_DATA.GET);
      return response.data;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch master data");
    }
  }
);

export const updateMasterData = createAsyncThunk(
  "app/updateMasterData",
  async (masterData: any, { rejectWithValue }) => {
    try {
      const response = await authAxios.post(
        endPoint.MASTER_DATA.UPDATE,
        masterData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue("Failed to update master data");
    }
  }
);

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMasterData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMasterData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.masterData = action.payload.data;
        state.masterDataRecordId = action.payload.id;
        state.defaultPerPage = action.payload.data.DefaultPerPage || 10; // Set defaultPerPage from API response
      })
      .addCase(getMasterData.rejected, (state) => {
        state.isLoading = false;
        showToast(ToastType.ERROR, "Failed to fetch master data");
      })
      .addCase(updateMasterData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateMasterData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.masterData = action.payload.data;
        state.masterDataRecordId = action.payload.id;
        state.defaultPerPage = action.payload.data.DefaultPerPage || 10;
        showToast(ToastType.SUCCESS, "Cập nhật dữ liệu chính thành công");
      })
      .addCase(updateMasterData.rejected, (state) => {
        state.isLoading = false;
        showToast(ToastType.ERROR, "Cập nhật dữ liệu chính thất bại");
      });
  },
});
export const getStoreMasterData = (state: { app: AppState }) =>
  state.app.masterData;

export const getStoreMasterDataRecordId = (state: { app: AppState }) =>
  state.app.masterDataRecordId;

export const getLoading = (state: { app: AppState }) => state.app.isLoading;

export const getShirtSizes = (state: { app: AppState }) =>
  state.app.masterData?.shirtSizes;

export const getColors = (state: { app: AppState }) =>
  state.app.masterData?.colors;

export const getPantsSizes = (state: { app: AppState }) =>
  state.app.masterData?.pantsSizes;

export const getDefaultPerPage = (state: { app: AppState }) =>
  state.app.defaultPerPage;

export const {} = appSlice.actions;

export default appSlice.reducer;
