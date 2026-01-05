import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail } from '../utils/validation';
import { Mic, Mail, Lock, AlertCircle } from 'lucide-react';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('guest');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const validateForm = () => {
        const newErrors = {};

        const emailError = validateEmail(email);
        if (emailError) newErrors.email = emailError;

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setLoading(true);

        try {
            // Mock login with delay to simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            const user = login(email, password, role);

            toast.success(`Welcome back, ${user.name}!`);

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
            toast.error(err.message || 'Failed to sign in. Please try again.');
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
                                    className={`form-input ${errors.email ? 'error' : ''}`}
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            {errors.email && (
                                <span className="field-error">
                                    <AlertCircle size={14} />
                                    {errors.email}
                                </span>
                            )}
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="input-with-icon">
                                <Lock size={18} />
                                <input
                                    type="password"
                                    className={`form-input ${errors.password ? 'error' : ''}`}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {errors.password && (
                                <span className="field-error">
                                    <AlertCircle size={14} />
                                    {errors.password}
                                </span>
                            )}
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
