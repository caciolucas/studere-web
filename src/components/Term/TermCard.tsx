import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    CardActions,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { TermResponse, TermRequest } from '../../types/terms';

interface TermCardProps {
    term: TermResponse;
    onDelete: (id: string) => void;
    onEdit: (id: string, updatedTerm: TermRequest) => void;
}

const TermCard: React.FC<TermCardProps> = ({ term, onDelete, onEdit }) => {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState<TermRequest>({
        name: term.name,
        start_date: format(parseISO(term.start_date), 'yyyy-MM-dd'),
        end_date: format(parseISO(term.end_date), 'yyyy-MM-dd'),
    });

    const handleOpenDelete = () => setConfirmDelete(true);
    const handleCloseDelete = () => setConfirmDelete(false);

    const handleOpenEdit = () => setEditMode(true);
    const handleCloseEdit = () => setEditMode(false);

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleDelete = () => {
        onDelete(term.id);
        handleCloseDelete();
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onEdit(term.id, editData);
        handleCloseEdit();
    };

    // Format dates as dd/MM/yyyy
    const formattedStartDate = format(parseISO(term.start_date), 'dd/MM/yyyy');
    const formattedEndDate = format(parseISO(term.end_date), 'dd/MM/yyyy');

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">{term.name}</Typography>
                <Typography variant="body2">Start Date: {formattedStartDate}</Typography>
                <Typography variant="body2">End Date: {formattedEndDate}</Typography>
            </CardContent>
            <CardActions>
                <Button color="primary" onClick={handleOpenEdit}>
                    Edit
                </Button>
                <Button color="error" onClick={handleOpenDelete}>
                    Delete
                </Button>
            </CardActions>

            {/* Confirm Delete Dialog */}
            <Dialog open={confirmDelete} onClose={handleCloseDelete}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the term <strong>{term.name}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete}>Cancel</Button>
                    <Button color="error" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={editMode} onClose={handleCloseEdit}>
                <DialogTitle>Edit Term</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleEditSubmit}>
                        <TextField
                            label="Name"
                            name="name"
                            fullWidth
                            required
                            margin="normal"
                            value={editData.name}
                            onChange={handleEditChange}
                        />
                        <TextField
                            label="Start Date"
                            name="start_date"
                            type="date"
                            fullWidth
                            required
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={editData.start_date}
                            onChange={handleEditChange}
                        />
                        <TextField
                            label="End Date"
                            name="end_date"
                            type="date"
                            fullWidth
                            required
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={editData.end_date}
                            onChange={handleEditChange}
                        />
                        <DialogActions>
                            <Button onClick={handleCloseEdit}>Cancel</Button>
                            <Button type="submit" variant="contained" color="primary">
                                Save
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default TermCard;
