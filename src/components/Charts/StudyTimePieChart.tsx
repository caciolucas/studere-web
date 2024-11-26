import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchStudyTimeByCourse } from '../../api/dashboard';
import { StudyTimeResponse } from '../../types/dashboard';
import { Box, Typography, Paper } from '@mui/material';

const generateColors = (numColors: number): string[] => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
        const hue = (i * 360) / numColors;
        colors.push(`hsl(${hue}, 80%, 75%)`);
    }
    return colors;
};

const secondsToHoursAndMinutes = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
};

const StudyTimePieChart: React.FC = () => {
    const [studyTimeData, setStudyTimeData] = useState<StudyTimeResponse[]>([]);
    const [totalTime, setTotalTime] = useState<number>(0);

    useEffect(() => {
        const loadStudyTimeData = async () => {
            try {
                const data = await fetchStudyTimeByCourse();
                setStudyTimeData(data);

                const total = data.reduce((sum, entry) => sum + entry.time, 0);
                setTotalTime(total);
            } catch (err) {
                console.error('Error fetching study time data:', err);
            }
        };

        loadStudyTimeData();
    }, []);

    const chartData = studyTimeData.map((item) => ({
        name: item.course,
        value: item.time / 60,
    }));

    const COLORS = generateColors(chartData.length);

    return (
        <Paper
            elevation={3}
            sx={{
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                height: '100%',
            }}
        >
            <Typography variant="h6" gutterBottom>
                Total Study Time
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={5}
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${secondsToHoursAndMinutes(value * 60)}`}
                        >
                            {chartData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </Box>
            <Typography variant="body1" sx={{ marginTop: 2, fontWeight: 'bold' }}>
                {secondsToHoursAndMinutes(totalTime)}
            </Typography>
        </Paper>
    );
};

export default StudyTimePieChart;
