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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Collapse from '@mui/material/Collapse';
import { fetchStudyPlans } from '../api/plans';
import {
    startSession,
    getCurrentSession,
    endSession,
    pauseSession,
    unpauseSession,
    fetchSessionHistory,
    fetchUserSessions,
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
    const [userSessions, setUserSessions] = useState<StudySessionResponse[]>([]); // New state for user sessions
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [newSession, setNewSession] = useState<StudySessionRequest>({
        title: '',
        description: '',
        plan_id: '',
    });
    const [notes, setNotes] = useState<string>('');
    const [updatedTopics, setUpdatedTopics] = useState<string[]>([]);
    const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

    useEffect(() => {
        const loadPlans = async () => {
            const data = await fetchStudyPlans();
            setPlans(data);
        };

        loadPlans();
    }, []);

    // Function to load user sessions (when no plan is selected)
    useEffect(() => {
        const loadUserSessions = async () => {
            const data = await fetchUserSessions();  // Fetch all sessions for the user
            setUserSessions(data);
        };

        if (!selectedPlan) {
            loadUserSessions();
        }
    }, [selectedPlan]);

    const loadActiveSession = async () => {
        const data = await getCurrentSession(selectedPlan?.id || '');
        setActiveSession(data);
        setNotes(data.notes || '');
        setUpdatedTopics(data.topics.filter((topic) => topic.completed_at).map((topic) => topic.id));
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
            await loadActiveSession();
            const updatedSession = await getCurrentSession(activeSession.plan.id); // Fetch fresh session data
            setActiveSession(updatedSession); // Update the active session
            setUpdatedTopics(updatedSession.topics.map((topic) => topic.id)); // Sync topics
            setEditOpen(false); // Close the dialog
        }
    };

    const toggleTopic = (topicId: string) => {
        setUpdatedTopics((prev) =>
            prev.includes(topicId)
                ? prev.filter((id) => id !== topicId)
                : [...prev, topicId]
        );
    };

    const toggleSessionDetails = (sessionId: string) => {
        setExpandedSessionId((prev) => (prev === sessionId ? null : sessionId));
    };

    const formatDateTime = (datetime: string) => {
        const date = new Date(datetime);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }).format(date);
    };

    const formatStudyTime = (seconds: number) => {
        if (seconds < 60) {
            return `${Math.round(seconds)} seconds`;
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else {
            const hours = (seconds / 3600).toFixed(1);
            return `${hours} hour${parseFloat(hours) > 1 ? 's' : ''}`;
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
                            value={selectedPlan?.id || ''}
                            onChange={(e) => setSelectedPlan(plans.find((plan) => plan.id === e.target.value) || null)}
                        >
                            <MenuItem value="">
                                Show all
                            </MenuItem>
                            {plans.map((plan) => (
                                <MenuItem key={plan.id} value={plan.id}>
                                    {plan.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* If no plan is selected, show the user’s sessions */}
                    {!selectedPlan ? (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Your Sessions
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Start Time</TableCell>
                                            <TableCell>End Time</TableCell>
                                            <TableCell>Total Duration</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {userSessions.map((session) => (
                                            <React.Fragment key={session.id}>
                                                <TableRow>
                                                    <TableCell>{session.title}</TableCell>
                                                    <TableCell>{session.description}</TableCell>
                                                    <TableCell>{formatDateTime(session.started_at)}</TableCell>
                                                    <TableCell>{formatDateTime(session.ended_at)}</TableCell>
                                                    <TableCell>{formatStudyTime(session.study_time)}</TableCell>
                                                    <TableCell>
                                                        <IconButton onClick={() => toggleSessionDetails(session.id)}>
                                                            {expandedSessionId === session.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={6}>
                                                        <Collapse in={expandedSessionId === session.id} timeout="auto" unmountOnExit>
                                                            <Box sx={{ padding: 2, borderTop: '1px solid #e0e0e0' }}>
                                                                <Typography variant="h6">Notes</Typography>
                                                                <Typography>{session.notes || 'No notes available'}</Typography>
                                                                <Typography variant="h6" sx={{ marginTop: 2 }}>
                                                                    Topics
                                                                </Typography>
                                                                <List>
                                                                    {session.topics.length > 0 ? (
                                                                        session.topics.map((topic) => (
                                                                            <ListItem key={topic.id} disableGutters>
                                                                                <Checkbox
                                                                                    edge="start"
                                                                                    checked={topic.completed_at != null}
                                                                                    disabled
                                                                                />
                                                                                <ListItemText primary={topic.title} />
                                                                            </ListItem>
                                                                        ))) : (
                                                                        <Typography>
                                                                            No topics added.
                                                                        </Typography>
                                                                    )}
                                                                </List>
                                                            </Box>
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>
                                            </React.Fragment>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    ) : (
                        <Box>
                            {/* Show active session and session history for selected plan */}
                            {activeSession ? (
                                <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
                                    <Typography variant="h6">Active Session</Typography>
                                    <Typography>Title: {activeSession.title}</Typography>
                                    <Typography>Description: {activeSession.description}</Typography>
                                    <Typography>Status: {activeSession.status}</Typography>
                                    <Typography variant="h6" sx={{ marginTop: 2 }}>
                                        Notes
                                    </Typography>
                                    <Typography>{activeSession.notes || 'No notes added.'}</Typography>

                                    <Typography variant="h6" sx={{ marginTop: 2 }}>
                                        Topics
                                    </Typography>
                                    <List>
                                        {activeSession.topics.length > 0 ? (
                                            activeSession.topics.map((topic) => (
                                                <ListItem key={topic.id} disableGutters>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={topic.completed_at != null}
                                                        disabled
                                                    />
                                                    <ListItemText primary={topic.title} />
                                                </ListItem>
                                            ))) : (
                                            <Typography>
                                                No topics added.
                                            </Typography>
                                        )}
                                    </List>

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
                                                <TableCell>Description</TableCell>
                                                <TableCell>Start Time</TableCell>
                                                <TableCell>End Time</TableCell>
                                                <TableCell>Total Duration</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {history.map((session) => (
                                                <React.Fragment key={session.id}>
                                                    <TableRow>
                                                        <TableCell>{session.title}</TableCell>
                                                        <TableCell>{session.description}</TableCell>
                                                        <TableCell>{formatDateTime(session.started_at)}</TableCell>
                                                        <TableCell>{formatDateTime(session.ended_at)}</TableCell>
                                                        <TableCell>{formatStudyTime(session.study_time)}</TableCell>
                                                        <TableCell>
                                                            <IconButton onClick={() => toggleSessionDetails(session.id)}>
                                                                {expandedSessionId === session.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell colSpan={6}>
                                                            <Collapse in={expandedSessionId === session.id} timeout="auto" unmountOnExit>
                                                                <Box sx={{ padding: 2, borderTop: '1px solid #e0e0e0' }}>
                                                                    <Typography variant="h6">Notes</Typography>
                                                                    <Typography>{session.notes || 'No notes added.'}</Typography>
                                                                    <Typography variant="h6" sx={{ marginTop: 2 }}>
                                                                        Topics
                                                                    </Typography>
                                                                    <List>
                                                                        {session.topics.length > 0 ? (
                                                                            session.topics.map((topic) => (
                                                                                <ListItem key={topic.id} disableGutters>
                                                                                    <Checkbox
                                                                                        edge="start"
                                                                                        checked={topic.completed_at != null}
                                                                                        disabled
                                                                                    />
                                                                                    <ListItemText primary={topic.title} />
                                                                                </ListItem>
                                                                            ))) : (
                                                                            <Typography>
                                                                                No topics added.
                                                                            </Typography>
                                                                        )}
                                                                    </List>
                                                                </Box>
                                                            </Collapse>
                                                        </TableCell>
                                                    </TableRow>
                                                </React.Fragment>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Paper>
        </BaseLayout>
    );
};

export default StudySessionsPage;
