import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import type {ITransaction, ITransactionAPI} from '../../types';
import {axiosAPI} from '../../axiosAPI.ts';
import type {AppDispatch, RootState} from "../store/store.ts";
import {toast} from "react-toastify";

interface TransactionsState {
    items: ITransaction[];
    loading: {
        deleteTransaction: string | null,
        fetchAllTransactions: boolean
    }
}

const initialState: TransactionsState = {
    items: [],
    loading: {
        deleteTransaction: null,
        fetchAllTransactions: false
    }
};

export const fetchAllTransactions = createAsyncThunk<ITransaction[], void>(
    'transactions/fetchAllTransactions',
    async () => {
        const response = await axiosAPI.get<ITransactionAPI>('transactions.json');
        if (!response.data) return [];
        return Object.keys(response.data).map(id => ({
            ...response.data[id],
            id,
        })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
);

export const deleteTransactionById = createAsyncThunk<void, string, { dispatch: AppDispatch }>(
    'transactions/delete',
    async (id, thunkAPI) => {
        await axiosAPI.delete(`transactions/${id}.json`);
        toast.success('Transaction deleted successfully')
        await thunkAPI.dispatch(fetchAllTransactions());
    }
);

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllTransactions.pending, (state) => {
            state.loading.fetchAllTransactions = true;
        })
        builder.addCase(fetchAllTransactions.fulfilled, (state, {payload}) => {
            state.loading.fetchAllTransactions = false;
            state.items = payload;
        })
        builder.addCase(fetchAllTransactions.rejected, (state) => {
            state.loading.fetchAllTransactions = false;
        });
        builder.addCase(deleteTransactionById.pending, (state, {meta}) => {
            state.loading.deleteTransaction = meta.arg;
        });
        builder.addCase(deleteTransactionById.fulfilled, (state) => {
            state.loading.deleteTransaction = null;
        });
        builder.addCase(deleteTransactionById.rejected, (state) => {
            state.loading.deleteTransaction = null;
        });
    },
});

export const selectAllTransactions = (state: RootState) => state.transactions.items;
export const selectTransactionsLoading = (state: RootState) => state.transactions.loading;

export const transactionsReducer = transactionsSlice.reducer;