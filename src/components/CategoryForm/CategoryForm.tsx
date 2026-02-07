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
import type {ICategoryMutation} from "../../types";

const initialForm = {
    type: '',
    name: ''
}

interface Props {
    isEditing?: boolean,
    initialValueForm?: ICategoryMutation,
    categoryID?: string,
    onClose: () => void,
}

const CategoryForm: React.FC<Props> = ({isEditing = false, initialValueForm = initialForm, categoryID, onClose}) => {
    const [form, setForm] = useState<ICategoryMutation>(initialValueForm)
    const [loading, setLoading] = useState<boolean>(false)

    const onChangeField = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | SelectChangeEvent) => {
        const {name, value} = event.target;

        setForm((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            if (form.name.trim().length > 0 && form.type) {
                setLoading(true);
                if (isEditing && categoryID) {
                    await axiosAPI.put(`categories/${categoryID}.json`, {...form});
                } else {
                    await axiosAPI.post('categories.json', {...form});
                }
                toast.success(`Category ${isEditing ? 'edited' : 'added'} successfully!`);
                setForm(initialForm);
            } else {
                toast.error('You have not filled in all the required fields.')
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }
    return (
        <form onSubmit={onSubmit}>
            <Grid container spacing={2} sx={{mx: 'auto', width: '80%'}}>
                <Grid size={12}>
                    <Typography variant='h5' sx={{textAlign: 'center', marginBottom: '15px'}}>
                        {isEditing ? 'Edit' : 'Add'} category
                    </Typography>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="type-label">Type</InputLabel>
                        <Select
                            labelId="type-label"
                            disabled={loading}
                            label="Type"
                            name="type"
                            value={form.type}
                            onChange={onChangeField}
                        >
                            <MenuItem value="income">Income</MenuItem>
                            <MenuItem value="expense">Expense</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid size={12}>
                    <TextField
                        sx={{width: '100%'}}
                        variant='outlined'
                        name='name'
                        label='Name'
                        disabled={loading}
                        value={form.name}
                        onChange={onChangeField}
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
                        onClick={onClose}
                        endIcon={<SaveIcon/>}>
                        {isEditing ? 'Edit' : 'Add'}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default CategoryForm;