import React from 'react';
import { Card, CardContent, Typography, Button, CardActions } from '@mui/material';
import { CourseResponse } from '../../types/courses';

interface CourseCardProps {
    course: CourseResponse;
    onDelete: (id: string) => void;
    onEdit: (course: CourseResponse) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onDelete, onEdit }) => {
    const handleDelete = () => onDelete(course.id);
    const handleEdit = () => onEdit(course);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">{course.name}</Typography>
                <Typography variant="body2">Term ID: {course.term_id}</Typography>
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

export default CourseCard;
