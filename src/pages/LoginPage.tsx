import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Link,
} from '@mui/material';
import { login } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { LoginRequest } from '../types/auth';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        const loginData: LoginRequest = { email, password };

        try {
            const response = await login(loginData);
            authLogin(response.access_token);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/register');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100vw',
                bgcolor: 'background.default',
                padding: 2,
            }}
        >
            <Card sx={{ maxWidth: 400, width: '100%', boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>
                        Login
                    </Typography>
                    <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            required
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            required
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Login
                        </Button>
                    </Box>
                    {error && (
                        <Typography color="error" align="center" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <Typography align="center" sx={{ mt: 2 }}>
                        Don't have an account?{' '}
                        <Link
                            component="button"
                            variant="body2"
                            onClick={handleRegisterRedirect}
                        >
                            Register here
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LoginPage;
