import {Dialog, DialogContent, DialogTitle, IconButton} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import * as React from "react";

interface Props extends React.PropsWithChildren{
    show: boolean;
    title?: string;
    onClose?: () => void;
}


const Modal: React.FC<Props> = ({show, title, onClose, children}) => {
    return (
        <Dialog open={show} onClose={onClose} fullWidth maxWidth="xs" disableScrollLock>
            <DialogTitle>
                {title}
                {(
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 10,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                )}
            </DialogTitle>
            <DialogContent sx={{marginBottom: '15px'}}>
                {children}
            </DialogContent>
        </Dialog>
    );
};

export default Modal;