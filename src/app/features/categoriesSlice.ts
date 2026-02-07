import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type {ICategory, ICategoryAPI} from "../../types";
import type {AppDispatch, RootState} from "../store/store.ts";
import {axiosAPI} from "../../axiosAPI.ts";
import {toast} from "react-toastify";

interface categoriesState {
    categories: ICategory[],
    loading: {
        deleteCategory: string | null,
        fetchAllCategories: boolean
    }
}

const initialState: categoriesState = {
    categories: [],
    loading: {
        deleteCategory: null,
        fetchAllCategories: false
    }
}

export const fetchAllCategories = createAsyncThunk<ICategory[]>(
    'categories/fetchAllCategories',
    async () => {
        const response = await axiosAPI.get<ICategoryAPI | null>('categories.json');
        const categoriesObject = response.data;

        if (!categoriesObject) {
            return []
        } else {
            const categoriesArray = Object.keys(categoriesObject).map(key => ({
                ...categoriesObject[key],
                id: key,
            }));
            categoriesArray.reverse()
            return categoriesArray;
        }
    }
)

export const deleteCategoryById = createAsyncThunk<void, string, {dispatch: AppDispatch}>(
    'categories/deleteCategoryById',
    async (id, thunkAPI) => {
        await axiosAPI.delete(`categories/${id}.json`);
        toast.success('Category deleted successfully')
        await thunkAPI.dispatch(fetchAllCategories());
    }
);

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchAllCategories.pending, (state) => {
            state.loading.fetchAllCategories = true;
        });
        builder.addCase(fetchAllCategories.fulfilled, (state, {payload: items}) => {
            state.loading.fetchAllCategories = false;
            state.categories = items;
        });
        builder.addCase(fetchAllCategories.rejected, (state) => {
            state.loading.fetchAllCategories = false;
        });

        builder.addCase(deleteCategoryById.pending, (state, {meta}) => {
            state.loading.deleteCategory = meta.arg;
        });
        builder.addCase(deleteCategoryById.fulfilled, (state) => {
            state.loading.deleteCategory = null;
        });
        builder.addCase(deleteCategoryById.rejected, (state) => {
            state.loading.deleteCategory = null;
        });
    }
})

export const selectAllCategories = (state: RootState) => state.categories.categories;
export const selectCategoriesLoading = (state: RootState) => state.categories.loading;

export const categoriesReducer = categoriesSlice.reducer;
