// src/components/Layout/BaseLayout.tsx

import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    AppBar,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BookIcon from '@mui/icons-material/Book';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { BookmarkAdded, Timer } from '@mui/icons-material';
import LogoutButton from '../Auth/LogoutButton.tsx'

const drawerWidth = 240;

const menuItems = [
    { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { text: 'Terms', path: '/terms', icon: <CalendarMonthIcon /> },
    { text: 'Courses', path: '/courses', icon: <BookIcon /> },
    { text: 'Assignments', path: '/assignments', icon: <AssignmentIcon /> },
    { text: 'Study Plans', path: '/plans', icon: <BookmarkAdded /> },
    { text: 'Study Sessions', path: '/sessions', icon: <Timer /> },
];

interface BaseLayoutProps {
    children: React.ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
    const location = useLocation();

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem
                                button
                                key={item.text}
                                component={RouterLink}
                                to={item.path}
                                selected={location.pathname === item.path}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
                {/* Logout Button */}
                <Box sx={{ mt: 'auto', mb: 2, px: 2}}>
                   <LogoutButton />
                </Box>
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: `calc(100% - ${drawerWidth}px)`,
                }}
            >
                <AppBar
                    position="fixed"
                    sx={{
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        marginLeft: drawerWidth,
                        width: `calc(100% - ${drawerWidth}px)`,
                    }}
                >
                    <Toolbar>
                        <Typography variant="h6" noWrap>
                            Studere
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Toolbar />
                <Box
                    sx={{
                        width: 'calc(100vw - 440px)', // Subtract the drawer width if present
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default BaseLayout;
