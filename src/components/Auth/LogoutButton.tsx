import React from 'react';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();           // Clear the token
        navigate('/login'); // Redirect to the login page
    };

    return (
        <Button 
            onClick={handleLogout}
            variant="outlined"
            color="error"
            endIcon={<LogoutIcon />}
        >
            Logout
        </Button>
    );
};

export default LogoutButton;
