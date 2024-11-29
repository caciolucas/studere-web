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
import { fetchStudyPlans, createStudyPlanWithAI, createStudyPlan, deleteStudyPlan } from '../api/plans';
import { fetchCourses } from '../api/courses';
import { StudyPlanManualRequest, StudyPlanRequest, StudyPlanResponse } from '../types/plans';
import { CourseResponse } from '../types/courses';
import { SelectChangeEvent } from '@mui/material';
import StudyPlanCard from '../components/Plans/PlansCard';

const StudyPlansPage: React.FC = () => {
    const [studyPlans, setStudyPlans] = useState<StudyPlanResponse[]>([]);
    const [courses, setCourses] = useState<CourseResponse[]>([]);
    const [openAI, setOpenAI] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [newPlan, setNewPlan] = useState<StudyPlanRequest | StudyPlanManualRequest>({
        prompt: '',        // Initially for AI generation
        course_id: '',     // Common field
        title: '',         // Initially empty (for manual creation)
        description: '',   // Initially empty (for manual creation)
        topics: [],        // Initially empty array (for manual creation)
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

    const handleOpenAI = () => setOpenAI(true);
    const handleCloseAI = () => {
        setOpenAI(false);
        setNewPlan({ prompt: '', course_id: '' });  // Reset AI-specific fields
    };

    const handleOpenCreate = () => setOpenCreate(true);
    const handleCloseCreate = () => {
        setOpenCreate(false);
        setNewPlan({ title: '', description: '', topics: [], course_id: '' });  // Reset manual fields
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewPlan({ ...newPlan, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setNewPlan({ ...newPlan, [name]: value });
    };

    const handleCreate = async () => {
        if (newPlan.topics.length === 0) {
            alert("Please add at least one topic.");
            return;
        }

        const createdPlan = await createStudyPlan(newPlan as StudyPlanManualRequest);  // Cast as manual request
        setStudyPlans((prev) => [...prev, createdPlan]);
        handleCloseCreate();
    };

    const handleCreateAI = async () => {
        const createdPlan = await createStudyPlanWithAI(newPlan as StudyPlanRequest);  // Cast as AI request
        setStudyPlans((prev) => [...prev, createdPlan]);
        handleCloseAI();
    };

    const handleDelete = async (id: string) => {
        await deleteStudyPlan(id);
        setStudyPlans((prev) => prev.filter((plan) => plan.id !== id));
    };

    const handleTopicChange = (index: number, field: string, value: string) => {
        const updatedTopics = [...newPlan.topics];
        updatedTopics[index] = {
            ...updatedTopics[index],
            [field]: value,
        };
        setNewPlan({
            ...newPlan,
            topics: updatedTopics,
        });
    };

    const handleAddTopic = () => {
        setNewPlan({
            ...newPlan,
            topics: [
                ...newPlan.topics,
                { id: '', title: '', description: '', completed_at: null, created_at: new Date().toISOString() },
            ],
        });
    };

    const handleRemoveTopic = (index: number) => {
        const updatedTopics = newPlan.topics.filter((_, i) => i !== index);
        setNewPlan({
            ...newPlan,
            topics: updatedTopics,
        });
    };

    return (
        <BaseLayout>
            <Box sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Study Plans
                </Typography>

                <Button variant="contained" color="primary" onClick={handleOpenCreate}>
                    Create Plan
                </Button>

                <Button variant="contained" color="primary" onClick={handleOpenAI} sx={{ marginLeft: 2 }}>
                    AI Generate
                </Button>

                <Grid container spacing={3} sx={{ marginTop: 2 }}>
                    {studyPlans.map((plan) => (
                        <StudyPlanCard studyPlan={plan} key={plan.id} onDelete={handleDelete} onEdit={handleCreateAI} />
                    ))}
                </Grid>

                {/* Modal for manual Create Plan */}
                <Dialog open={openCreate} onClose={handleCloseCreate}>
                    <DialogTitle>Create Study Plan</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Title"
                            name="title"
                            fullWidth
                            required
                            margin="normal"
                            value={newPlan.title}
                            onChange={handleInputChange}
                        />
                        <TextField
                            label="Description"
                            name="description"
                            fullWidth
                            required
                            margin="normal"
                            value={newPlan.description}
                            onChange={handleInputChange}
                        />

                        {/* Topics Input */}
                        {newPlan.topics.map((topic, index) => (
                            <Box key={index} sx={{ marginBottom: 2 }}>
                                <TextField
                                    label={`Topic ${index + 1} Title`}
                                    name="title"
                                    fullWidth
                                    required
                                    margin="normal"
                                    value={topic.title}
                                    onChange={(e) => handleTopicChange(index, 'title', e.target.value)}
                                />
                                <TextField
                                    label={`Topic ${index + 1} Description`}
                                    name="description"
                                    fullWidth
                                    required
                                    margin="normal"
                                    multiline
                                    rows={3}
                                    value={topic.description}
                                    onChange={(e) => handleTopicChange(index, 'description', e.target.value)}
                                />
                                {/* Add Remove Button */}
                                <Button color="secondary" onClick={() => handleRemoveTopic(index)}>
                                    Remove Topic
                                </Button>
                            </Box>
                        ))}

                        <Button variant="outlined" color="primary" onClick={handleAddTopic}>
                            Add Topic
                        </Button>

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
                        <Button onClick={handleCloseCreate}>Cancel</Button>
                        <Button variant="contained" color="primary" onClick={handleCreate}>
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Modal for AI Plan Creation */}
                <Dialog open={openAI} onClose={handleCloseAI}>
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
                        <Button onClick={handleCloseAI}>Cancel</Button>
                        <Button variant="contained" color="primary" onClick={handleCreateAI}>
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </BaseLayout>
    );
};

export default StudyPlansPage;
