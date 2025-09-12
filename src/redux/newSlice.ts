import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authAxios } from "../config/axiosConfig";
import endPoint from "../services";
import { showToast, ToastType } from "../shared/toast";
import { New, UpdateNew } from "../interfaces/new.interface";

interface NewState {
  new: New;
  loading: boolean;
  error: string | null;
  getNewSuccess: boolean;
  updateNewSuccess: boolean;
}

const initialState: NewState = {
  new: {
    title: "",
    content: "",
    id: "",
    createdAt: "",
    updatedAt: "",
  },
  loading: false,
  error: null,
  getNewSuccess: false,
  updateNewSuccess: false,
};

export const updateNew = createAsyncThunk(
  "new/update",
  async (data: UpdateNew, { rejectWithValue }) => {
    try {
      const response = await authAxios.post<New>(endPoint.NEW.UPDATE, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Lấy dữ liệu cuộc trò chuyện thất bại"
      );
    }
  }
);

export const getNew = createAsyncThunk(
  "new/getNew",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAxios.get<New>(endPoint.NEW.GET);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Lấy dữ liệu cuộc trò chuyện thất bại"
      );
    }
  }
);

const newSlice = createSlice({
  name: "new",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNew.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.getNewSuccess = false;
      })
      .addCase(getNew.fulfilled, (state, action) => {
        state.loading = false;
        state.new = action.payload;
        state.getNewSuccess = true;
      })
      .addCase(getNew.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.getNewSuccess = false;
        showToast(ToastType.ERROR, "Lấy dữ liệu tin tức thất bại");
      })
      .addCase(updateNew.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateNewSuccess = false;
      })
      .addCase(updateNew.fulfilled, (state, action) => {
        state.loading = false;
        state.new = {
          ...action.payload,
        };
        state.updateNewSuccess = true;
        showToast(ToastType.SUCCESS, "Cập nhật tin tức thành công");
      })
      .addCase(updateNew.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.updateNewSuccess = false;
        showToast(ToastType.ERROR, "Cập nhật tin tức thất bại");
      });
  },
});

export const {} = newSlice.actions;

export const newSelector = (state: { new: NewState }) => state.new.new;
export const isLoadingSelector = (state: { new: NewState }) =>
  state.new.loading;

export default newSlice.reducer;
