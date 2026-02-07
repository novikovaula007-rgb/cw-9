import {Box, Button, Stack, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {
    deleteCategoryById,
    fetchAllCategories,
    selectAllCategories,
    selectCategoriesLoading
} from "../../app/features/categoriesSlice.ts";
import {useEffect, useState} from "react";
import Spinner from "../../components/UI/Spinner/Spinner.tsx";
import CategoryItem from "../../components/CategoryItem/CategoryItem.tsx";
import Modal from "../../components/UI/Modal/Modal.tsx";
import CategoryForm from "../../components/CategoryForm/CategoryForm.tsx";

const Categories = () => {
    const loadingFetchCategories = useAppSelector(selectCategoriesLoading).fetchAllCategories;
    const loadingDeleteCategory = useAppSelector(selectCategoriesLoading).deleteCategory;
    const categories = useAppSelector(selectAllCategories);
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

    const categoryToEdit = categories.find(c => c.id === selectedId)

    useEffect(() => {
        dispatch(fetchAllCategories())
    }, [dispatch])

    return (
        <>
            <Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between', mb: '15px'}}>
                    <Typography variant='h5'>Categories</Typography>
                    <Button
                        sx={{backgroundColor: '#171717', textAlign: 'center'}}
                        variant='contained'
                        onClick={() => handleOpenAdd()}
                    >
                        Add category
                    </Button>
                </Box>
                {loadingFetchCategories && <Box sx={{textAlign: 'center'}}><Spinner/></Box>}
                {!loadingFetchCategories && categories.length === 0 && 'There is no categories yet.'}
                {!loadingFetchCategories && categories.length > 0 && (
                    <Stack spacing={2}>
                        {categories.map(category => {
                            return <CategoryItem key={category.id}
                                                 type={category.type}
                                                 name={category.name}
                                                 onEdit={() => handleOpenEdit(category.id)}
                                                 onDelete={() => handleOpenDelete(category.id)}
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
                        <CategoryForm categoryID={selectedId} onClose={handleClose} isEditing
                                      initialValueForm={categoryToEdit}/>
                    )}

                {modalType === 'add' && (
                    <CategoryForm onClose={handleClose}/>
                )}

                {modalType === 'delete' && selectedId && (
                    <Box sx={{p: 2, textAlign: 'center'}}>
                        <Typography variant='h5' sx={{textAlign: 'center', marginBottom: '15px'}}>
                            Delete
                        </Typography>
                        <Typography>
                            Are you sure you want to delete this category?
                        </Typography>
                        <Box sx={{mt: 3, display: 'flex', justifyContent: 'center', gap: 1}}>
                            <Button onClick={handleClose}
                                    disabled={loadingDeleteCategory === selectedId}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                loading={loadingDeleteCategory === selectedId}
                                loadingPosition='end'
                                disabled={loadingDeleteCategory === selectedId}
                                onClick={async () => {
                                    await dispatch(deleteCategoryById(selectedId));
                                    handleClose();
                                }}
                            >
                                Delete category
                            </Button>
                        </Box>
                    </Box>
                )}
            </Modal>)}
        </>
    );
};

export default Categories;