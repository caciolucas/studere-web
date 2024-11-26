import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Grid2 as Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import { fetchAssignments, createAssignment, updateAssignment, deleteAssignment } from '../api/assignments';
import { fetchCourses } from '../api/courses';
import { AssignmentRequest, AssignmentResponse, AssignmentType } from '../types/assignments';
import { CourseResponse } from '../types/courses';
import BaseLayout from '../components/Layout/BaseLayout';
import AssignmentCard from '../components/Assignment/AssignmentCard';
import { SelectChangeEvent } from '@mui/material';

const AssignmentsPage: React.FC = () => {
    const [assignments, setAssignments] = useState<AssignmentResponse[]>([]);
    const [courses, setCourses] = useState<CourseResponse[]>([]);
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAssignmentId, setCurrentAssignmentId] = useState<string | null>(null);
    const [newAssignment, setNewAssignment] = useState<AssignmentRequest>({
        title: '',
        description: '',
        due_at: '',
        type: AssignmentType.PROJECT,
        course_id: '',
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAssignments = async () => {
            try {
                const data = await fetchAssignments();
                setAssignments(data);
            } catch (err) {
                console.error('Error fetching assignments:', err);
            }
        };

        const loadCourses = async () => {
            try {
                const data = await fetchCourses();
                setCourses(data);
            } catch (err) {
                console.error('Error fetching courses:', err);
            }
        };

        loadAssignments();
        loadCourses();
    }, []);

    const handleOpen = () => {
        setOpen(true);
        setIsEditing(false);
        setNewAssignment({ title: '', description: '', due_at: '', type: AssignmentType.PROJECT, course_id: '' });
        setCurrentAssignmentId(null);
    };

    const handleClose = () => {
        setOpen(false);
        setNewAssignment({ title: '', description: '', due_at: '', type: AssignmentType.PROJECT, course_id: '' });
        setError(null);
    };

    const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewAssignment({ ...newAssignment, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const name = e.target.name as string;
        setNewAssignment({ ...newAssignment, [name]: e.target.value as AssignmentType | string });
    };

    const handleNewAssignmentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            if (isEditing && currentAssignmentId) {
                const updatedAssignment = await updateAssignment(currentAssignmentId, newAssignment);
                setAssignments((prev) =>
                    prev.map((assignment) =>
                        assignment.id === currentAssignmentId ? { ...assignment, ...updatedAssignment } : assignment
                    )
                );
            } else {
                const createdAssignment = await createAssignment(newAssignment);
                setAssignments((prev) => [...prev, createdAssignment]);
            }
            handleClose();
        } catch (err) {
            setError('Failed to save assignment. Please try again.');
        }
    };

    const handleEdit = (assignment: AssignmentResponse) => {
        setIsEditing(true);
        setCurrentAssignmentId(assignment.id);
        setNewAssignment({
            title: assignment.title,
            description: assignment.description,
            due_at: assignment.due_at,
            type: assignment.type,
            course_id: assignment.course_id,
        });
        setOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteAssignment(id);
            setAssignments((prev) => prev.filter((assignment) => assignment.id !== id));
        } catch (err) {
            console.error('Error deleting assignment:', err);
        }
    };

    return (
        <BaseLayout>
            <Box sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Assignments
                </Typography>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Add New Assignment
                </Button>

                {/* Assignments List */}
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    {assignments.map((assignment) => (
                        <AssignmentCard assignment={assignment} onDelete={handleDelete} onEdit={handleEdit} />
                    ))}
                </Grid>

                {/* Add/Edit Assignment Modal */}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{isEditing ? 'Edit Assignment' : 'Add New Assignment'}</DialogTitle>
                    <DialogContent>
                        <form onSubmit={handleNewAssignmentSubmit}>
                            <TextField
                                label="Title"
                                name="title"
                                fullWidth
                                required
                                margin="normal"
                                value={newAssignment.title}
                                onChange={handleTextFieldChange}
                            />
                            <TextField
                                label="Description"
                                name="description"
                                fullWidth
                                required
                                margin="normal"
                                multiline
                                rows={4}
                                value={newAssignment.description}
                                onChange={handleTextFieldChange}
                            />
                            <TextField
                                label="Due Date"
                                name="due_at"
                                type="datetime-local"
                                fullWidth
                                required
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={newAssignment.due_at}
                                onChange={handleTextFieldChange}
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="type-select-label">Type</InputLabel>
                                <Select
                                    labelId="type-select-label"
                                    name="type"
                                    value={newAssignment.type}
                                    onChange={handleSelectChange}
                                    required
                                >
                                    <MenuItem value={AssignmentType.EXAM}>Exam</MenuItem>
                                    <MenuItem value={AssignmentType.PROJECT}>Project</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="course-select-label">Course</InputLabel>
                                <Select
                                    labelId="course-select-label"
                                    name="course_id"
                                    value={newAssignment.course_id}
                                    onChange={handleSelectChange}
                                    required
                                >
                                    {courses.map((course) => (
                                        <MenuItem key={course.id} value={course.id}>
                                            {course.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
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

export default AssignmentsPage;
