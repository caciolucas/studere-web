import React from 'react';
import { Card, CardContent, Typography, Button, CardActions } from '@mui/material';
import { AssignmentResponse } from '../../types/assignments';

interface AssignmentCardProps {
    assignment: AssignmentResponse;
    onDelete: (id: string) => void;
    onEdit: (assignment: AssignmentResponse) => void;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment, onDelete, onEdit }) => {
    const handleDelete = () => onDelete(assignment.id);
    const handleEdit = () => onEdit(assignment);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">{assignment.title}</Typography>
                <Typography variant="body2">Type: {assignment.type}</Typography>
                <Typography variant="body2">Due Date: {new Date(assignment.due_at).toLocaleString()}</Typography>
                <Typography variant="body2">Description: {assignment.description}</Typography>
            </CardContent>
            <CardActions>
                <Button color="primary" onClick={handleEdit}>
                    Edit
                </Button>
                <Button color="error" onClick={handleDelete}>
                    Delete
                </Button>
            </CardActions>
        </Card>
    );
};

export default AssignmentCard;
