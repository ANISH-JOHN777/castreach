import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mic, Mail, Lock, AlertCircle } from 'lucide-react';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('guest');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Basic validation
            if (!email || !password) {
                throw new Error('Please fill in all fields');
            }

            if (!email.includes('@')) {
                throw new Error('Please enter a valid email');
            }

            // Mock login
            const user = login(email, password, role);

            // Navigate based on role
            switch (user.role) {
                case 'host':
                    navigate('/host/dashboard');
                    break;
                case 'guest':
                    navigate('/guest/dashboard');
                    break;
                case 'organizer':
                    navigate('/organizer/dashboard');
                    break;
                default:
                    navigate('/');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    {/* Logo */}
                    <div className="auth-logo">
                        <Mic className="auth-logo-icon" />
                        <h1>CastReach</h1>
                    </div>

                    <h2 className="auth-title">Welcome Back</h2>
                    <p className="auth-subtitle">Sign in to continue to your account</p>

                    {error && (
                        <div className="auth-error">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        {/* Role Selection */}
                        <div className="form-group">
                            <label className="form-label">I am a</label>
                            <div className="role-selector">
                                <label className={`role-option ${role === 'guest' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="guest"
                                        checked={role === 'guest'}
                                        onChange={(e) => setRole(e.target.value)}
                                    />
                                    <span>Guest</span>
                                </label>
                                <label className={`role-option ${role === 'host' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="host"
                                        checked={role === 'host'}
                                        onChange={(e) => setRole(e.target.value)}
                                    />
                                    <span>Host</span>
                                </label>
                                <label className={`role-option ${role === 'organizer' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="organizer"
                                        checked={role === 'organizer'}
                                        onChange={(e) => setRole(e.target.value)}
                                    />
                                    <span>Organizer</span>
                                </label>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <div className="input-with-icon">
                                <Mail size={18} />
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="input-with-icon">
                                <Lock size={18} />
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className="auth-link-container">
                            <Link to="/forgot-password" className="auth-link">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="auth-footer">
                        Don't have an account?{' '}
                        <Link to="/signup" className="auth-link">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
