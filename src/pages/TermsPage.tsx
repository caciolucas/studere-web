import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Grid2 as Grid, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { fetchTerms, createTerm, deleteTerm, updateTerm } from '../api/terms';
import { TermRequest, TermResponse } from '../types/terms';
import BaseLayout from '../components/Layout/BaseLayout';
import TermCard from '../components/Term/TermCard';

const TermsPage: React.FC = () => {
    const [terms, setTerms] = useState<TermResponse[]>([]);
    const [open, setOpen] = useState(false); // For the "Add New Term" modal
    const [newTerm, setNewTerm] = useState<TermRequest>({
        name: '',
        start_date: '',
        end_date: '',
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTerms = async () => {
            try {
                const data = await fetchTerms();
                setTerms(data);
            } catch (err) {
                console.error('Error fetching terms:', err);
            }
        };

        loadTerms();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteTerm(id);
            setTerms((prev) => prev.filter((term) => term.id !== id));
        } catch (err) {
            console.error('Error deleting term:', err);
        }
    };

    const handleEdit = async (id: string, updatedTerm: TermRequest) => {
        try {
            const updated = await updateTerm(id, updatedTerm);
            setTerms((prev) =>
                prev.map((term) => (term.id === id ? { ...term, ...updated } : term))
            );
        } catch (err) {
            console.error('Error updating term:', err);
        }
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setNewTerm({ name: '', start_date: '', end_date: '' });
        setError(null);
    };

    const handleNewTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTerm({ ...newTerm, [e.target.name]: e.target.value });
    };

    const handleNewTermSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const createdTerm = await createTerm(newTerm);
            setTerms((prev) => [...prev, createdTerm]);
            handleClose();
        } catch (err) {
            setError('Failed to create new term. Please try again.');
        }
    };

    return (
        <BaseLayout>
            <Box sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Terms
                </Typography>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Add New Term
                </Button>

                {/* Terms List */}
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    {terms.map((term) => (
                        <TermCard term={term} onDelete={handleDelete} onEdit={handleEdit} />
                    ))}
                </Grid>

                {/* Add New Term Modal */}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Add New Term</DialogTitle>
                    <DialogContent>
                        <form onSubmit={handleNewTermSubmit}>
                            <TextField
                                label="Name"
                                name="name"
                                fullWidth
                                required
                                margin="normal"
                                value={newTerm.name}
                                onChange={handleNewTermChange}
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
                                value={newTerm.start_date}
                                onChange={handleNewTermChange}
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
                                value={newTerm.end_date}
                                onChange={handleNewTermChange}
                            />
                            {error && (
                                <Typography color="error" sx={{ mt: 1 }}>
                                    {error}
                                </Typography>
                            )}
                            <DialogActions>
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button type="submit" variant="contained" color="primary">
                                    Save
                                </Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>
            </Box>
        </BaseLayout>
    );
};

export default TermsPage;
