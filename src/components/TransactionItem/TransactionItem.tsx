import React from "react";
import {Box, Card, IconButton, Typography} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import type {ICategory} from "../../types";
import dayjs from "dayjs";

interface Props {
    amount: number,
    createdAt: string,
    category: ICategory | undefined;
    onEdit: () => void,
    onDelete: () => void
}

const TransactionItem: React.FC<Props> = ({category, amount, onEdit, onDelete, createdAt}) => {
    return (
        <Box>
            <Card sx={{mb: 2, p: 2}}>

                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography>{dayjs(createdAt).format('DD.MM.YYYY HH:mm:ss')}</Typography>
                    <Typography sx={{fontWeight: 'bold', fontSize: '20px'}}>{category && category.name}</Typography>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <Typography sx={{fontWeight: 'bold'}} color={category?.type === 'expense' ? 'error' : 'success'}>
                            {category?.type === 'income' ? `+${amount}` : `-${amount}`} KGS
                        </Typography>
                        <IconButton aria-label="delete" onClick={() => onDelete()}>
                            <DeleteIcon/>
                        </IconButton>
                        <IconButton aria-label="edit" onClick={() => onEdit()}>
                            <EditIcon/>
                        </IconButton>
                    </Box>

                </Box>

            </Card>
        </Box>
    );
};

export default TransactionItem;