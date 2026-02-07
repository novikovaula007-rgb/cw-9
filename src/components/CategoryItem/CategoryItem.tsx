import React from "react";
import {Box, Card, IconButton, Typography} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface Props {
    type: string,
    name: string,
    onEdit: () => void,
    onDelete: () => void
}

const CategoryItem: React.FC<Props> = ({type, name, onEdit, onDelete}) => {
    return (
        <Box>
            <Card sx={{mb: 2, p: 2}}>

                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography sx={{fontWeight: 'bold', fontSize: '20px'}}>{name}</Typography>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <Typography color={type === 'expense' ? 'error' : 'success'} sx={{fontWeight: 'bold'}}>
                            {type}
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

export default CategoryItem;