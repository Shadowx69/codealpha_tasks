import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

export const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const SERVER_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    React.useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

        try {
            const res = await fetch(`${SERVER_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/');
            } else {
                alert(data.message || 'Authentication failed');
            }
        } catch (err) {
            console.error(err);
            alert('Network error. Is the server running?');
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: 20 }}>
            <div style={{ background: '#0f381c', padding: 32, borderRadius: 12, width: '100%', maxWidth: 400, boxShadow: '0 8px 16px rgba(2, 44, 34, 0.5)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: 24, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, color: '#f8f4e6', fontWeight: 'bold' }}>
                    {isLogin ? <><LogIn /> Login</> : <><UserPlus /> Register</>}
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {!isLogin && (
                        <div>
                            <label style={{ display: 'block', marginBottom: 8, color: '#8b9d83' }}>Username</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, color: '#8b9d83' }}>Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: 8, color: '#8b9d83' }}>Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <button className="btn btn-primary" type="submit" style={{ justifyContent: 'center', marginTop: 8, color: '#f8f4e6', fontWeight: 'bold' }}>
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <button className="btn" style={{ background: 'transparent', width: '100%', justifyContent: 'center', color: '#f8f4e6', fontWeight: 'bold' }} onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                    </button>
                </div>
            </div>
        </div>
    );
};
