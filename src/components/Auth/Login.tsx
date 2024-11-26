import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { login } from '../../api/auth';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login: authLogin } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await login({ email, password });
            authLogin(data.access_token);
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default Login;
