import React, { useState, useEffect } from 'react';
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
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import BaseLayout from '../components/Layout/BaseLayout';
import { fetchStudyPlans, createStudyPlanWithAI, deleteStudyPlan } from '../api/plans';
import { fetchCourses } from '../api/courses';
import { StudyPlanRequest, StudyPlanResponse } from '../types/plans';
import { CourseResponse } from '../types/courses';
import { SelectChangeEvent } from '@mui/material';
import StudyPlanCard from '../components/Plans/PlansCard';

const StudyPlansPage: React.FC = () => {
    const [studyPlans, setStudyPlans] = useState<StudyPlanResponse[]>([]);
    const [courses, setCourses] = useState<CourseResponse[]>([]);
    const [open, setOpen] = useState(false);
    const [newPlan, setNewPlan] = useState<StudyPlanRequest>({
        prompt: '',
        course_id: '',
    });

    useEffect(() => {
        const loadData = async () => {
            const plans = await fetchStudyPlans();
            const courseData = await fetchCourses();
            setStudyPlans(plans);
            setCourses(courseData);
        };

        loadData();
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setNewPlan({ prompt: '', course_id: '' });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewPlan({ ...newPlan, [e.target.name]: e.target.value });
    };


    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setNewPlan({ ...newPlan, [name as keyof StudyPlanRequest]: value });
    };


    const handleCreate = async () => {
        const createdPlan = await createStudyPlanWithAI(newPlan);
        setStudyPlans((prev) => [...prev, createdPlan]);
        handleClose();
    };

    const handleDelete = async (id: string) => {
        await deleteStudyPlan(id);
        setStudyPlans((prev) => prev.filter((plan) => plan.id !== id));
    };

    return (
        <BaseLayout>
            <Box sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Study Plans
                </Typography>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    AI Generate
                </Button>
                <Grid container spacing={3} sx={{ marginTop: 2 }}>
                    {studyPlans.map((plan) => (
                        <StudyPlanCard studyPlan={plan} key={plan.id} onDelete={handleDelete} onEdit={handleCreate} />
                    ))}
                </Grid>

                {/* Modal for AI Plan Creation */}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>AI Generate</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Prompt"
                            name="prompt"
                            fullWidth
                            required
                            multiline
                            rows={3}
                            margin="normal"
                            value={newPlan.prompt}
                            onChange={handleInputChange}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="course-select-label">Course</InputLabel>
                            <Select
                                labelId="course-select-label"
                                name="course_id"
                                value={newPlan.course_id}
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
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button variant="contained" color="primary" onClick={handleCreate}>
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </BaseLayout>
    );
};

export default StudyPlansPage;
