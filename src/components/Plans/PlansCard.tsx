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
    List,
    ListItem,
    ListItemText,
    Checkbox,
} from '@mui/material';
import { StudyPlanResponse, StudyPlanRequest } from '../../types/plans';

interface StudyPlanCardProps {
    studyPlan: StudyPlanResponse;
    onDelete: (id: string) => void;
    onEdit: (id: string, updatedPlan: StudyPlanRequest) => void;
}

const StudyPlanCard: React.FC<StudyPlanCardProps> = ({ studyPlan, onDelete }) => {
    const [confirmDelete, setConfirmDelete] = useState(false);


    const handleOpenDelete = () => setConfirmDelete(true);
    const handleCloseDelete = () => setConfirmDelete(false);


    const handleDelete = () => {
        onDelete(studyPlan.id);
        handleCloseDelete();
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">{studyPlan.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                    Course ID: {studyPlan.course_id}
                </Typography>
                <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
                    Topics:
                </Typography>
                <List>
                    {studyPlan.topics.map((topic) => (
                        <ListItem key={topic.id} disableGutters>
                            <Checkbox
                                edge="start"
                                checked={!!topic.completed_at}
                                disableRipple
                                inputProps={{ 'aria-labelledby': topic.title }}
                            />
                            <ListItemText
                                primary={topic.title}
                                secondary={topic.description}
                                sx={{
                                    textDecoration: topic.completed_at ? 'line-through' : 'none',
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
            <CardActions>
                <Button color="error" onClick={handleOpenDelete}>
                    Delete
                </Button>
            </CardActions>

            {/* Confirm Delete Dialog */}
            <Dialog open={confirmDelete} onClose={handleCloseDelete}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the study plan <strong>{studyPlan.title}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete}>Cancel</Button>
                    <Button color="error" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>


        </Card>
    );
};

export default StudyPlanCard;
