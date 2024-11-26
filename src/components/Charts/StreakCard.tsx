import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import CheckCircle from '@mui/icons-material/CheckCircle';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import { fetchStreaks } from '../../api/dashboard';

const StreaksCard: React.FC = () => {
    const [streakData, setStreakData] = useState<boolean[]>([]);

    useEffect(() => {
        const loadStreakData = async () => {
            const data = await fetchStreaks();
            setStreakData(data.streaks);
        };

        loadStreakData();
    }, []);

    const streakCount = streakData.filter((studied) => studied).length;

    return (
        <Paper
            elevation={3}
            sx={{
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                width: '100%',
                height: '100%',
            }}
        >
            <Typography variant="h6" gutterBottom>
                Streaks
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                Your track record in the last 7 days:
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1,
                    marginTop: 2,
                }}
            >
                {streakData.map((studied, index) => (
                    <Box key={index}>
                        {studied ? (
                            <CheckCircle color="success" />
                        ) : (
                            <CheckCircleOutline color="disabled" />
                        )}
                    </Box>
                ))}
            </Box>
            <Typography
                variant="body1"
                sx={{
                    marginTop: 2,
                    fontWeight: 'bold',
                    color: streakCount > 0 ? '#28a745' : '#ddd',
                }}
            >
                🔥 {streakCount} days
            </Typography>
        </Paper>
    );
};

export default StreaksCard;
