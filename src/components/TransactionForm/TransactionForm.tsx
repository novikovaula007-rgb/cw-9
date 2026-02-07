import {
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    type SelectChangeEvent,
    TextField, Typography,
} from "@mui/material";
import {useState} from "react";
import SaveIcon from '@mui/icons-material/Save';
import React from "react";
import {axiosAPI} from "../../axiosAPI.ts";
import {toast} from "react-toastify";
import type {ITransactionForm, ITransactionMutation} from "../../types";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {fetchAllTransactions, selectAllTransactions} from "../../app/features/transactionsSlice.ts";

const initialForm = {
    category: '',
    amount: 0
}

interface Props {
    isEditing?: boolean,
    initialValueForm?: ITransactionForm | undefined,
    transactionID?: string,
    onClose: () => void,
}

const TransactionForm: React.FC<Props> = ({isEditing = false, initialValueForm = initialForm, transactionID, onClose}) => {
    const [form, setForm] = useState<ITransactionForm>(initialValueForm);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const transactions = useAppSelector(selectAllTransactions);
    const categories = useAppSelector((state) => state.categories.categories);

    const [typeOfTransaction, setTypeOfTransaction] = useState<string | null>(null)
    const filteredCategories = categories.filter(category => category.type === typeOfTransaction);

    const onChangeField = (event:React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | SelectChangeEvent) => {
        const {name, value} = event.target;
        let valueForm: number | string = value

        if (name === 'amount') {
            const valuePrice = Number(value)
            if (valuePrice > 0) {
                valueForm = valuePrice
            }
        }

        setForm((prevState) => ({
            ...prevState,
            [name]: valueForm
        }));
    }

    const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            if (form.amount > 0 && form.category) {
                setLoading(true);
                const transactionData: ITransactionMutation = {
                    category: form.category,
                    amount: form.amount,
                    createdAt: transactionID
                        ? transactions.find(t => t.id === transactionID)?.createdAt || new Date().toISOString()
                        : new Date().toISOString(),
                };
                if (isEditing && transactionID) {
                    await axiosAPI.put(`transactions/${transactionID}.json`, {...transactionData});
                } else {
                    await axiosAPI.post('transactions.json', {...transactionData});
                }
                toast.success(`Transaction ${isEditing ? 'edited' : 'added'} successfully!`);
                setTypeOfTransaction(null);
                setForm(initialForm);
                dispatch(fetchAllTransactions());
                onClose();
            } else {
                toast.error('You have not filled in all the required fields.');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }
    return (
        <form onSubmit={onSubmit}>
            <Grid container spacing={2} sx={{mx: 'auto', width: '80%'}}>
                <Grid size={12}>
                    <Typography variant='h5' sx={{textAlign: 'center', marginBottom: '15px'}}>
                        {isEditing ? 'Edit' : 'Add'} transaction
                    </Typography>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="type-label">Type</InputLabel>
                        <Select
                            labelId="type-label"
                            disabled={loading}
                            label="Type"
                            name="type"
                            value={typeOfTransaction}
                            onChange={(e) => setTypeOfTransaction(e.target.value)}
                        >
                            <MenuItem value="income">Income</MenuItem>
                            <MenuItem value="expense">Expense</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid size={12}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            labelId="category-label"
                            label="Category"
                            name="category"
                            value={form.category}
                            disabled={!typeOfTransaction || loading}
                            onChange={onChangeField}
                        >
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))
                            ): <MenuItem disabled>You need to select or add category</MenuItem>}

                        </Select>
                    </FormControl>
                </Grid>

                <Grid size={12}>
                    <TextField
                        label="Amount"
                        name="amount"
                        type="number"
                        variant='outlined'
                        disabled={loading}
                        value={form.amount}
                        onChange={onChangeField}
                        inputProps={{min: 0}}
                        fullWidth
                    />
                </Grid>

                <Grid size={12}>
                    <Button
                        fullWidth
                        type='submit'
                        sx={{backgroundColor: '#171717', textAlign: 'center'}}
                        loading={loading}
                        loadingPosition='end'
                        variant='contained'
                        endIcon={<SaveIcon/>}>
                        {isEditing ? 'Edit' : 'Add'}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default TransactionForm;