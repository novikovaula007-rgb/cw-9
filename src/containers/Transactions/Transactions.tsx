import {Box} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {fetchAllCategories, selectAllCategories, selectCategoriesLoading} from "../../app/features/categoriesSlice.ts";
import {useEffect, useState} from "react";
import {
    fetchAllTransactions,
    selectAllTransactions,
    selectTransactionsLoading
} from "../../app/features/transactionsSlice.ts";

const Transactions = () => {
    const loadingFetchTransactions = useAppSelector(selectTransactionsLoading).fetchAllTransactions;
    const loadingDeleteTransaction = useAppSelector(selectTransactionsLoading).deleteTransaction;
    const categories = useAppSelector(selectAllCategories);
    const transactions = useAppSelector(selectAllTransactions);
    const dispatch = useAppDispatch();

    const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [modalType, setModalType] = useState<'add' | 'edit' | 'delete' | null>(null);

    const handleOpenEdit = (id: string) => {
        setSelectedId(id);
        setModalType('edit');
        setIsOpenAddModal(true);
    };

    const handleOpenDelete = (id: string) => {
        setSelectedId(id);
        setModalType('delete');
        setIsOpenAddModal(true);
    };

    const handleClose = () => {
        setIsOpenAddModal(false);
        setModalType(null);
        setSelectedId(null);
    };

    const handleOpenAdd = () => {
        setIsOpenAddModal(true);
        setModalType('add');
        setSelectedId(null);
    };

    const transactionToEdit = transactions.find(t => t.id === selectedId)

    useEffect(() => {
        dispatch(fetchAllCategories())
        dispatch(fetchAllTransactions())
    }, [dispatch])
    return (
        <Box>

        </Box>
    );
};

export default Transactions;