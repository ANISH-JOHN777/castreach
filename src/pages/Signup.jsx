import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validation
            if (!name || !email || !password || !confirmPassword) {
                throw new Error('Please fill in all fields');
            }

            if (!email.includes('@')) {
                throw new Error('Please enter a valid email');
            }

            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            // Mock signup
            const user = signup(email, password, role, name);

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

                    <h2 className="auth-title">Create Account</h2>
                    <p className="auth-subtitle">Join the podcasting community</p>

                    {error && (
                        <div className="auth-error">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

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
                                    className="form-input"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
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
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <div className="input-with-icon">
                                <Lock size={18} />
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
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
