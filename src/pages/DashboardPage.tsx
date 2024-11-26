import React from 'react';
import { Grid, Box } from '@mui/material';
import BaseLayout from '../components/Layout/BaseLayout';
import StreaksCard from '../components/Charts/StreakCard';
import StudyTimePieChart from '../components/Charts/StudyTimePieChart';

const DashboardPage: React.FC = () => {
    return (
        <BaseLayout>
            <Box sx={{ padding: 3 }}>
                <Grid container spacing={12}>
                    {/* Streaks Card */}
                    <Grid item xs={12} md={3}>
                        <StreaksCard />
                    </Grid>
                    {/* Study Time Pie Chart */}
                    <Grid item xs={12} md={6}>
                        <StudyTimePieChart />
                    </Grid>
                </Grid>
            </Box>
        </BaseLayout>
    );
};

export default DashboardPage;
