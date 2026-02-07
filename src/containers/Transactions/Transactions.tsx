import {Box, Button, Stack, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {
    fetchAllCategories,
    selectAllCategories,
} from "../../app/features/categoriesSlice.ts";
import {useEffect, useState} from "react";
import {
    deleteTransactionById,
    fetchAllTransactions,
    selectAllTransactions,
    selectTransactionsLoading
} from "../../app/features/transactionsSlice.ts";
import Spinner from "../../components/UI/Spinner/Spinner.tsx";
import TransactionItem from "../../components/TransactionItem/TransactionItem.tsx";
import Modal from "../../components/UI/Modal/Modal.tsx";
import TransactionForm from "../../components/TransactionForm/TransactionForm.tsx";

const Transactions = () => {
    const loadingFetchTransactions = useAppSelector(selectTransactionsLoading).fetchAllTransactions;
    const loadingDeleteTransaction = useAppSelector(selectTransactionsLoading).deleteTransaction;
    const categories = useAppSelector(selectAllCategories);
    const transactions = useAppSelector(selectAllTransactions);
    const dispatch = useAppDispatch();

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
    const [modalType, setModalType] = useState<'add' | 'edit' | 'delete' | null>(null);

    const handleOpenEdit = (id: string) => {
        setModalType('edit');
        setSelectedId(id);
        setIsOpenAddModal(true);
    };

    const handleOpenDelete = (id: string) => {
        setSelectedId(id);
        setIsOpenAddModal(true);
        setModalType('delete');
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

    const transactionToEdit = transactions.find(t => t.id === selectedId);
    const categoryOfEditTransaction = categories.find(
        c => c.id === transactionToEdit?.category
    );

    useEffect(() => {
        dispatch(fetchAllCategories())
        dispatch(fetchAllTransactions())
    }, [dispatch])
    return (
        <Box>
            <Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between', mb: '15px'}}>
                    <Typography variant='h5'>Transactions</Typography>
                    <Button
                        sx={{backgroundColor: '#171717', textAlign: 'center'}}
                        variant='contained'
                        onClick={() => handleOpenAdd()}
                    >
                        Add transaction
                    </Button>
                </Box>
                {loadingFetchTransactions && <Box sx={{textAlign: 'center'}}><Spinner/></Box>}
                {!loadingFetchTransactions && transactions.length === 0 && 'There is no transactions yet.'}
                {!loadingFetchTransactions && transactions.length > 0 && (
                    <Stack spacing={2}>
                        {transactions.map(transaction => {
                            return <TransactionItem key={transaction.id}
                                                    category={categories.find(category => category.id === transaction.category)}
                                                    amount={transaction.amount}
                                                    createdAt={transaction.createdAt}
                                                    onEdit={() => handleOpenEdit(transaction.id)}
                                                    onDelete={() => handleOpenDelete(transaction.id)}
                            />
                        })}
                    </Stack>
                )}
            </Box>
            {modalType && (<Modal
                show={isOpenAddModal}
                onClose={handleClose}
            >
                {
                    modalType === 'edit' && selectedId && (
                        <TransactionForm transactionID={selectedId}
                                         onClose={handleClose}
                                         isEditing
                                         transactionType={categoryOfEditTransaction && categoryOfEditTransaction.type}
                                      initialValueForm={transactionToEdit}
                        />
                    )}

                {modalType === 'add' && (
                    <TransactionForm onClose={handleClose}/>
                )}

                {modalType === 'delete' && selectedId && (
                    <Box sx={{p: 2, textAlign: 'center'}}>
                        <Typography variant='h5' sx={{textAlign: 'center', marginBottom: '15px'}}>
                            Delete
                        </Typography>
                        <Typography>
                            Are you sure you want to delete this transaction?
                        </Typography>
                        <Box sx={{mt: 3, display: 'flex', justifyContent: 'center', gap: 1}}>
                            <Button onClick={handleClose}
                                    disabled={loadingDeleteTransaction === selectedId}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                loading={loadingDeleteTransaction === selectedId}
                                loadingPosition='end'
                                disabled={loadingDeleteTransaction === selectedId}
                                onClick={async () => {
                                    await dispatch(deleteTransactionById(selectedId));
                                    handleClose();
                                }}
                            >
                                Delete transaction
                            </Button>
                        </Box>
                    </Box>
                )}
            </Modal>)}
        </Box>
    );
};

export default Transactions;