import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail } from '../utils/validation';
import { Mic, Mail, Lock, User, AlertCircle } from 'lucide-react';
import './Auth.css';

const Signup = () => {
    const [searchParams] = useSearchParams();
    const initialRole = searchParams.get('role') || 'guest';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState(initialRole);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const validateForm = () => {
        const newErrors = {};

        if (!name || name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        const emailError = validateEmail(email);
        if (emailError) newErrors.email = emailError;

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
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
            // Await the signup
            const user = await signup(email, password, role, name);

            toast.success(`Welcome to CastReach, ${name}!`);

            // Small delay to show the toast
            await new Promise(resolve => setTimeout(resolve, 500));

            // Navigate based on role
            switch (user.role || role) {
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
            console.error('Signup error:', err);
            toast.error(err.message || 'Failed to create account. Please try again.');
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

                    <h2 className="auth-title">Create Account</h2>
                    <p className="auth-subtitle">Join the podcasting community</p>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {/* Role Selection */}
                        <div className="form-group">
                            <label className="form-label">I want to be a</label>
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

                        {/* Name */}
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <div className="input-with-icon">
                                <User size={18} />
                                <input
                                    type="text"
                                    className={`form-input ${errors.name ? 'error' : ''}`}
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            {errors.name && (
                                <span className="field-error">
                                    <AlertCircle size={14} />
                                    {errors.name}
                                </span>
                            )}
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
                                    placeholder="Create a password"
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

                        {/* Confirm Password */}
                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <div className="input-with-icon">
                                <Lock size={18} />
                                <input
                                    type="password"
                                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            {errors.confirmPassword && (
                                <span className="field-error">
                                    <AlertCircle size={14} />
                                    {errors.confirmPassword}
                                </span>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <p className="auth-footer">
                        Already have an account?{' '}
                        <Link to="/login" className="auth-link">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
