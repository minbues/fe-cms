import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CreateCategoryPayload,
  CreateCategoryResponse,
  CreateSegmentPayload,
  CreateSubCategoryPayload,
  CreateSubCategoryResponse,
  ISegment,
  Segment,
  UpdateCategoryPayload,
  UpdateCategoryResponse,
  UpdateSegmentPayload,
  UpdateSubCategoryPayload,
  UpdateSubCategoryResponse,
} from "../interfaces/segment.interface";
import { authAxios } from "../config/axiosConfig";
import endPoint from "../services";
import { showToast, ToastType } from "../shared/toast";
import { Pagination } from "../interfaces/app.interface";
import { parsePaginationHeaders } from "../shared/common";

interface SegmentState {
  segment: ISegment[] | Segment[];
  segmentPaging: ISegment[] | Segment[];
  loading: boolean;
  loadingAction: boolean;
  pagination: Pagination;
  category: UpdateCategoryResponse[];
  subcategory: UpdateSubCategoryResponse[];
}

const initialState: SegmentState = {
  segment: [],
  loading: false,
  loadingAction: false,
  segmentPaging: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    totalItems: 0,
  },
  category: [],
  subcategory: [],
};

export const getSegmentWithPaging = createAsyncThunk(
  "segment/get-segments-paging",
  async (
    params: {
      name?: string;
      page?: number;
      perPage?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAxios.get(endPoint.SEGMENT.LIST_PAGING, {
        params,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getSegments = createAsyncThunk(
  "segment/get-segments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAxios.get<ISegment[]>(endPoint.SEGMENT.LIST);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createSegment = createAsyncThunk(
  "segment/create-segment",
  async (newSegment: CreateSegmentPayload, { rejectWithValue }) => {
    try {
      const response = await authAxios.post(
        endPoint.SEGMENT.CREATE,
        newSegment
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateSegment = createAsyncThunk(
  "segment/update-segment",
  async (
    { id, segmentData }: { id: string; segmentData: UpdateSegmentPayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAxios.patch(
        endPoint.SEGMENT.UPDATE.replace("/:id", `/${id}`),
        segmentData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  "segment/create-category",
  async (newCategory: CreateCategoryPayload, { rejectWithValue }) => {
    try {
      const response = await authAxios.post(
        endPoint.CATEGORY.CREATE,
        newCategory
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "segment/update-category",
  async (
    { id, categoryData }: { id: string; categoryData: UpdateCategoryPayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAxios.patch(
        endPoint.CATEGORY.UPDATE.replace("/:id", `/${id}`),
        categoryData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createSubCategory = createAsyncThunk(
  "segment/create-sub-category",
  async (newCategory: CreateSubCategoryPayload, { rejectWithValue }) => {
    try {
      const response = await authAxios.post(
        endPoint.SUBCATEGORY.CREATE,
        newCategory
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateSubCategory = createAsyncThunk(
  "segment/update-subcategory",
  async (
    {
      id,
      subCategoryData,
    }: { id: string; subCategoryData: UpdateSubCategoryPayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAxios.patch(
        endPoint.SUBCATEGORY.UPDATE.replace("/:id", `/${id}`),
        subCategoryData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getAllCategory = createAsyncThunk(
  "category/all-category",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAxios.get(endPoint.CATEGORY.ALL);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getAllSubCategory = createAsyncThunk(
  "subcategory/all-subcategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAxios.get(endPoint.SUBCATEGORY.ALL);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const segmentSlice = createSlice({
  name: "segment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getSegments.fulfilled,
        (state, action: PayloadAction<ISegment[]>) => {
          state.segment = action.payload;
          state.loading = false;
        }
      )
      .addCase(getSegments.rejected, (state) => {
        showToast(ToastType.ERROR, "Fetch segment faild");
        state.loading = false;
      })
      .addCase(createSegment.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getAllCategory.fulfilled,
        (state, action: PayloadAction<UpdateCategoryResponse[]>) => {
          state.category = action.payload;
          state.loading = false;
        }
      )
      .addCase(getAllCategory.rejected, (state) => {
        showToast(ToastType.ERROR, "Lấy danh sách danh mục lỗi");
        state.loading = false;
      })
      .addCase(getAllCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getAllSubCategory.fulfilled,
        (state, action: PayloadAction<UpdateSubCategoryResponse[]>) => {
          state.subcategory = action.payload;
          state.loading = false;
        }
      )
      .addCase(getAllSubCategory.rejected, (state) => {
        showToast(ToastType.ERROR, "Lấy danh sách danh mục phụ lỗi");
        state.loading = false;
      })
      .addCase(getAllSubCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSegmentWithPaging.fulfilled, (state, action) => {
        state.segmentPaging = action.payload.items;
        state.loading = false;
        state.pagination = parsePaginationHeaders(action.payload.headers);
      })
      .addCase(getSegmentWithPaging.rejected, (state) => {
        showToast(ToastType.ERROR, "Fetch segment faild");
        state.loading = false;
      })
      .addCase(
        createSegment.fulfilled,
        (state, action: PayloadAction<Segment>) => {
          state.segmentPaging.unshift(action.payload);
        }
      )

      .addCase(createSegment.rejected, (_, action) => {
        showToast(
          ToastType.ERROR,
          `${action.payload || "Không thể tạo phân khúc"}`
        );
      })
      .addCase(createCategory.pending, (state) => {
        state.loadingAction = true;
      })
      .addCase(
        createCategory.fulfilled,
        (state, action: PayloadAction<CreateCategoryResponse>) => {
          const newCategory = action.payload;

          const targetSegment = state.segmentPaging.find(
            (seg) => seg.id === newCategory.segmentId
          );

          if (targetSegment) {
            if (Array.isArray(targetSegment.categories)) {
              targetSegment.categories.unshift(newCategory);
            } else {
              targetSegment.categories = [newCategory];
            }
          }
        }
      )
      .addCase(createCategory.rejected, (_, action) => {
        showToast(
          ToastType.ERROR,
          `${action.payload || "Không thể tạo category"}`
        );
      })
      .addCase(createSubCategory.pending, (state) => {
        state.loadingAction = true;
      })
      .addCase(
        createSubCategory.fulfilled,
        (state, action: PayloadAction<CreateSubCategoryResponse>) => {
          const newSubCategory = action.payload;

          const targetSegment = state.segmentPaging.find(
            (seg) => seg.id === newSubCategory.segmentId
          );

          if (targetSegment) {
            const targetCategory = targetSegment.categories?.find(
              (cat) => cat.id === newSubCategory.categoryId
            );

            if (targetCategory) {
              if (Array.isArray(targetCategory.subCategories)) {
                targetCategory.subCategories.unshift(newSubCategory);
              } else {
                targetCategory.subCategories = [newSubCategory];
              }
            }
          }
        }
      )

      .addCase(createSubCategory.rejected, (_, action) => {
        showToast(
          ToastType.ERROR,
          `${action.payload || "Không thể tạo subcategory"}`
        );
      })
      .addCase(updateSegment.pending, (state) => {
        state.loadingAction = true;
      })
      .addCase(
        updateSegment.fulfilled,
        (state, action: PayloadAction<Segment>) => {
          state.segment = state.segmentPaging.map((segment) =>
            segment.id === action.payload.id
              ? { ...segment, ...action.payload }
              : segment
          );
          state.loadingAction = false;
        }
      )
      .addCase(updateSegment.rejected, (_, action) => {
        showToast(
          ToastType.ERROR,
          `${action.payload || "Không thể cập nhật phân khúc"}`
        );
      })
      .addCase(updateCategory.pending, (state) => {
        state.loadingAction = true;
      })
      .addCase(
        updateCategory.fulfilled,
        (state, action: PayloadAction<UpdateCategoryResponse>) => {
          const updatedCategory = action.payload;

          const targetSegment = state.segmentPaging.find(
            (seg) => seg.id === updatedCategory.segmentId
          );

          if (targetSegment) {
            const categories = targetSegment.categories ?? [];

            const categoryIndex = categories.findIndex(
              (category) => category.id === updatedCategory.id
            );

            if (categoryIndex !== -1) {
              categories[categoryIndex] = {
                ...categories[categoryIndex],
                ...updatedCategory,
                subCategories: categories[categoryIndex].subCategories || [],
              };
              targetSegment.categories = categories;
            }
          }
        }
      )
      .addCase(updateCategory.rejected, (_, action) => {
        showToast(
          ToastType.ERROR,
          `${action.payload || "Không thể cập nhật category"}`
        );
      })
      .addCase(updateSubCategory.pending, (state) => {
        state.loadingAction = true;
      })
      .addCase(
        updateSubCategory.fulfilled,
        (state, action: PayloadAction<UpdateSubCategoryResponse>) => {
          const updatedSubCategory = action.payload;

          state.segment = state.segmentPaging.map((segment) => {
            const updatedCategories = segment.categories?.map((category) => {
              if (category.id === updatedSubCategory.categoryId) {
                const updatedSubCategories = category.subCategories?.map(
                  (subCategory) => {
                    if (subCategory.id === updatedSubCategory.id) {
                      return updatedSubCategory;
                    }
                    return subCategory;
                  }
                );

                return {
                  ...category,
                  subCategories: updatedSubCategories || category.subCategories,
                };
              }
              return category;
            });

            return {
              ...segment,
              categories: updatedCategories || segment.categories,
            };
          });
        }
      )
      .addCase(updateSubCategory.rejected, (_, action) => {
        showToast(
          ToastType.ERROR,
          `${action.payload || "Không thể cập nhật subcategory"}`
        );
      });
  },
});

export const getListSegment = (state: { segment: SegmentState }) =>
  state.segment.segment;

export const getListSegmentPaging = (state: { segment: SegmentState }) =>
  state.segment.segmentPaging;

export const getPagination = (state: { segment: SegmentState }) =>
  state.segment.pagination;

export const getListCategory = (state: { segment: SegmentState }) =>
  state.segment.category;

export const getListSubCategory = (state: { segment: SegmentState }) =>
  state.segment.subcategory;

export const {} = segmentSlice.actions;

export default segmentSlice.reducer;
