import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    Grid,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import { fetchStudyPlans } from '../api/plans';
import {
    startSession,
    getCurrentSession,
    endSession,
    pauseSession,
    unpauseSession,
    fetchSessionHistory,
    updateSession,
} from '../api/sessions';
import { StudyPlanResponse } from '../types/plans';
import { StudySessionResponse, StudySessionRequest } from '../types/sessions';
import BaseLayout from '../components/Layout/BaseLayout';

const StudySessionsPage: React.FC = () => {
    const [plans, setPlans] = useState<StudyPlanResponse[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<StudyPlanResponse | null>(null);
    const [activeSession, setActiveSession] = useState<StudySessionResponse | null>(null);
    const [history, setHistory] = useState<StudySessionResponse[]>([]);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [newSession, setNewSession] = useState<StudySessionRequest>({
        title: '',
        description: '',
        plan_id: '',
    });
    const [notes, setNotes] = useState<string>('');
    const [updatedTopics, setUpdatedTopics] = useState<string[]>([]);

    useEffect(() => {
        const loadPlans = async () => {
            const data = await fetchStudyPlans();
            setPlans(data);
        };

        loadPlans();
    }, []);

    const loadActiveSession = async () => {
        console.log(selectedPlan?.id);
        const data = await getCurrentSession(selectedPlan?.id || '');
        setActiveSession(data);
        setNotes(data.notes || '');
        // setUpdatedTopics(data.topics.filter((topic) => topic.completed_at).map((topic) => topic.id));
    };

    useEffect(() => {
        const loadHistory = async () => {
            const data = await fetchSessionHistory(selectedPlan?.id || '');
            setHistory(data);
        };

        if (selectedPlan) {
            loadActiveSession();
            loadHistory();
        }
    }, [selectedPlan]);

    const handleStartSession = async () => {
        const session = await startSession({ ...newSession, plan_id: selectedPlan?.id || '' });
        setActiveSession(session);
        setOpen(false);
    };

    const handleEndSession = async () => {
        if (activeSession?.plan.id) {
            await endSession(activeSession.plan.id);
            setActiveSession(null);
            fetchSessionHistory(selectedPlan?.id || '').then((data) => setHistory(data));
        }
    };

    const handlePauseSession = async () => {
        if (activeSession?.plan.id) {
            const session = await pauseSession(activeSession.plan.id);
            setActiveSession(session);
        }
    };

    const handleUnpauseSession = async () => {
        if (activeSession?.plan.id) {
            const session = await unpauseSession(activeSession.plan.id);
            setActiveSession(session);
        }
    };

    const handleEditSession = async () => {
        if (activeSession?.id) {
            await updateSession(activeSession.plan.id, {
                notes,
                topics: updatedTopics,
            });
            setEditOpen(false);
            loadActiveSession();
        }
    };

    const toggleTopic = (topicId: string) => {
        setUpdatedTopics((prev) =>
            prev.includes(topicId)
                ? prev.filter((id) => id !== topicId)
                : [...prev, topicId]
        );
    };

    return (
        <BaseLayout>
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
                <Box sx={{ padding: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        Study Sessions
                    </Typography>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="plan-select-label">Select Study Plan</InputLabel>
                        <Select
                            labelId="plan-select-label"
                            value={selectedPlan?.title}
                            onChange={(e) => setSelectedPlan(plans.find((plan) => plan.id === e.target.value) as StudyPlanResponse)}
                        >
                            {plans.map((plan) => (
                                <MenuItem key={plan.id} value={plan.id}>
                                    {plan.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {activeSession ? (
                        <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
                            <Typography variant="h6">Active Session</Typography>
                            <Typography>Title: {activeSession.title}</Typography>
                            <Typography>Description: {activeSession.description}</Typography>
                            <Typography>Status: {activeSession.status}</Typography>
                            <IconButton color="error" onClick={handleEndSession}>
                                <StopIcon />
                            </IconButton>
                            {activeSession.status === 'active' ? (
                                <IconButton color="warning" onClick={handlePauseSession}>
                                    <PauseIcon />
                                </IconButton>
                            ) : (
                                    <IconButton color="success" onClick={handleUnpauseSession}>
                                        <PlayArrowIcon />
                                    </IconButton>
                            )}
                            <IconButton color="info" onClick={() => setEditOpen(true)}>
                                <EditIcon />
                            </IconButton>
                        </Paper>
                    ) : (
                        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                            Start Session
                        </Button>
                    )}

                    {/* Edit Modal */}
                    <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                        <DialogTitle>Edit Session</DialogTitle>
                        <DialogContent>
                            <Typography variant="h6" sx={{ marginTop: 2 }}>
                                Notes
                            </Typography>
                            <TextField
                                label="Notes"
                                name="notes"
                                fullWidth
                                multiline
                                rows={3}
                                margin="normal"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                            <Typography variant="h6" sx={{ marginTop: 2 }}>
                                Topics
                            </Typography>
                            <List>
                                {selectedPlan?.topics.map((topic) => (
                                    <ListItem key={topic.id} disableGutters>
                                        <Checkbox
                                            edge="start"
                                            checked={updatedTopics.includes(topic.id)}
                                            onChange={() => toggleTopic(topic.id)}
                                        />
                                        <ListItemText primary={topic.title} />
                                    </ListItem>
                                ))}
                            </List>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                            <Button variant="contained" color="primary" onClick={handleEditSession}>
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Start Session Modal */}
                    <Dialog open={open} onClose={() => setOpen(false)}>
                        <DialogTitle>Start New Session</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Title"
                                name="title"
                                fullWidth
                                required
                                margin="normal"
                                value={newSession.title}
                                onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                            />
                            <TextField
                                label="Description"
                                name="description"
                                fullWidth
                                required
                                margin="normal"
                                value={newSession.description}
                                onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)}>Cancel</Button>
                            <Button variant="contained" color="primary" onClick={handleStartSession}>
                                Start
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Box sx={{ marginTop: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Session History
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Started At</TableCell>
                                        <TableCell>Ended At</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {history.map((session) => (
                                        <TableRow key={session.id}>
                                            <TableCell>{session.title}</TableCell>
                                            <TableCell>{session.status}</TableCell>
                                            <TableCell>{session.started_at}</TableCell>
                                            <TableCell>{session.ended_at || 'Ongoing'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </Paper>
        </BaseLayout>
    );
};

export default StudySessionsPage;
