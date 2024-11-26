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
import { fetchCourses, createCourse, updateCourse, deleteCourse } from '../api/courses';
import { fetchTerms } from '../api/terms';
import { CourseRequest, CourseResponse } from '../types/courses';
import { TermResponse } from '../types/terms';
import BaseLayout from '../components/Layout/BaseLayout';
import CourseCard from '../components/Course/CourseCard';
import { SelectChangeEvent } from '@mui/material';

const CoursesPage: React.FC = () => {
    const [courses, setCourses] = useState<CourseResponse[]>([]);
    const [terms, setTerms] = useState<TermResponse[]>([]);
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCourseId, setCurrentCourseId] = useState<string | null>(null);
    const [newCourse, setNewCourse] = useState<CourseRequest>({
        name: '',
        term_id: '',
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const data = await fetchCourses();
                setCourses(data);
            } catch (err) {
                console.error('Error fetching courses:', err);
            }
        };

        const loadTerms = async () => {
            try {
                const data = await fetchTerms();
                setTerms(data);
            } catch (err) {
                console.error('Error fetching terms:', err);
            }
        };

        loadCourses();
        loadTerms();
    }, []);

    const handleOpen = () => {
        setOpen(true);
        setIsEditing(false);
        setNewCourse({ name: '', term_id: '' });
        setCurrentCourseId(null);
    };

    const handleClose = () => {
        setOpen(false);
        setNewCourse({ name: '', term_id: '' });
        setError(null);
    };

    const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const name = e.target.name as string;
        setNewCourse({ ...newCourse, [name]: e.target.value });
    };

    const handleNewCourseSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            if (isEditing && currentCourseId) {
                const updatedCourse = await updateCourse(currentCourseId, newCourse);
                setCourses((prev) =>
                    prev.map((course) =>
                        course.id === currentCourseId ? { ...course, ...updatedCourse } : course
                    )
                );
            } else {
                const createdCourse = await createCourse(newCourse);
                setCourses((prev) => [...prev, createdCourse]);
            }
            handleClose();
        } catch (err) {
            setError('Failed to save course. Please try again.');
        }
    };

    const handleEdit = (course: CourseResponse) => {
        setIsEditing(true);
        setCurrentCourseId(course.id);
        setNewCourse({ name: course.name, term_id: course.term_id });
        setOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteCourse(id);
            setCourses((prev) => prev.filter((course) => course.id !== id));
        } catch (err) {
            console.error('Error deleting course:', err);
        }
    };

    return (
        <BaseLayout>
            <Box sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Courses
                </Typography>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Add New Course
                </Button>

                {/* Courses List */}
                <Grid container spacing={3} sx={{ mt: 2 }}>
                    {courses.map((course) => (
                        <CourseCard course={course} onDelete={handleDelete} onEdit={handleEdit} />
                    ))}
                </Grid>

                {/* Add/Edit Course Modal */}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{isEditing ? 'Edit Course' : 'Add New Course'}</DialogTitle>
                    <DialogContent>
                        <form onSubmit={handleNewCourseSubmit}>
                            <TextField
                                label="Name"
                                name="name"
                                fullWidth
                                required
                                margin="normal"
                                value={newCourse.name}
                                onChange={handleTextFieldChange}
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="term-select-label">Term</InputLabel>
                                <Select
                                    labelId="term-select-label"
                                    name="term_id"
                                    value={newCourse.term_id}
                                    onChange={handleSelectChange}
                                    required
                                >
                                    {terms.map((term) => (
                                        <MenuItem key={term.id} value={term.id}>
                                            {term.name}
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

export default CoursesPage;
