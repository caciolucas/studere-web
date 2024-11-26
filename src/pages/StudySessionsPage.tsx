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
} from '@mui/material';
import { fetchStudyPlans } from '../api/plans';
import {
    startSession,
    getCurrentSession,
    endSession,
    pauseSession,
    unpauseSession,
    fetchSessionHistory,
} from '../api/sessions';
import { StudyPlanResponse } from '../types/plans';
import { StudySessionResponse, StudySessionRequest } from '../types/sessions';
import BaseLayout from '../components/Layout/BaseLayout';

const StudySessionsPage: React.FC = () => {
    const [plans, setPlans] = useState<StudyPlanResponse[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<string>('');
    const [activeSession, setActiveSession] = useState<StudySessionResponse | null>(null);
    const [history, setHistory] = useState<StudySessionResponse[]>([]);
    const [open, setOpen] = useState(false);
    const [newSession, setNewSession] = useState<StudySessionRequest>({
        title: '',
        description: '',
        plan_id: '',
    });

    useEffect(() => {
        const loadPlans = async () => {
            const data = await fetchStudyPlans();
            setPlans(data);
        };

        loadPlans();
    }, []);

    const loadActiveSession = async () => {
        const data = await getCurrentSession(selectedPlan);
        setActiveSession(data);
        console.log(data);
    };

    useEffect(() => {
        const loadHistory = async () => {
            const data = await fetchSessionHistory(selectedPlan);
            setHistory(data);
        };

        loadActiveSession();
        loadHistory();
    }, [selectedPlan]);

    const handleStartSession = async () => {
        const session = await startSession({ ...newSession, plan_id: selectedPlan });
        setActiveSession(session);
        setOpen(false);
    };


    const handleEndSession = async () => {
        if (activeSession?.plan.id) {
            await endSession(activeSession.plan.id);
            setActiveSession(null);
            fetchSessionHistory(selectedPlan).then((data) => setHistory(data));
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
                            value={selectedPlan}
                            onChange={(e) => setSelectedPlan(e.target.value)}
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
                            <Button variant="contained" color="error" onClick={handleEndSession}>
                                End Session
                            </Button>
                            {activeSession.status === 'active' ? (
                                <Button variant="contained" color="warning" onClick={handlePauseSession}>
                                    Pause
                                </Button>
                            ) : (
                                <Button variant="contained" color="success" onClick={handleUnpauseSession}>
                                    Unpause
                                </Button>
                            )}
                        </Paper>
                    ) : (
                        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                            Start Session
                        </Button>
                    )}

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
