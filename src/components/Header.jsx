import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Mic,
    LogOut,
    User,
    Bell,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';
import './Header.css';

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMobileMenuOpen(false);
    };

    const getDashboardLink = () => {
        if (!user) return '/';
        switch (user.role) {
            case 'host':
                return '/host/dashboard';
            case 'guest':
                return '/guest/dashboard';
            default:
                return '/';
        }
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    {/* Logo */}
                    <Link to="/" className="logo">
                        <Mic className="logo-icon" />
                        <span className="logo-text">CastReach</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="nav-desktop">
                        {isAuthenticated ? (
                            <>
                                <Link to={getDashboardLink()} className="nav-link">
                                    Dashboard
                                </Link>
                                <Link to="/discover" className="nav-link">
                                    Discover
                                </Link>
                                <Link to="/bookings" className="nav-link">
                                    Bookings
                                </Link>
                                <Link to="/room" className="nav-link nav-link-highlight">
                                    <Mic size={16} /> Recording Room
                                </Link>
                                <Link to="/messages" className="nav-link">
                                    Messages
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/discover" className="nav-link">
                                    Discover
                                </Link>
                                <Link to="/about" className="nav-link">
                                    About
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Right Side Actions */}
                    <div className="header-actions">
                        {isAuthenticated ? (
                            <>
                                <button className="icon-btn">
                                    <Bell size={20} />
                                </button>
                                <div className="user-menu">
                                    <Link to="/profile" className="user-avatar">
                                        <img src={user.avatar} alt={user.name} />
                                    </Link>
                                    <div className="user-dropdown">
                                        <Link to="/profile" className="dropdown-item">
                                            <User size={16} />
                                            Profile
                                        </Link>
                                        <button onClick={handleLogout} className="dropdown-item">
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-secondary btn-sm">
                                    Login
                                </Link>
                                <Link to="/signup" className="btn btn-primary btn-sm">
                                    Sign Up
                                </Link>
                            </>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="mobile-menu-toggle"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <nav className="nav-mobile">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to={getDashboardLink()}
                                    className="nav-link-mobile"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/discover"
                                    className="nav-link-mobile"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Discover
                                </Link>
                                <Link
                                    to="/bookings"
                                    className="nav-link-mobile"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Bookings
                                </Link>
                                <Link
                                    to="/room"
                                    className="nav-link-mobile nav-link-highlight"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Mic size={16} /> Recording Room
                                </Link>
                                <Link
                                    to="/messages"
                                    className="nav-link-mobile"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Messages
                                </Link>
                                <Link
                                    to="/profile"
                                    className="nav-link-mobile"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="nav-link-mobile"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/discover"
                                    className="nav-link-mobile"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Discover
                                </Link>
                                <Link
                                    to="/about"
                                    className="nav-link-mobile"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    About
                                </Link>
                                <Link
                                    to="/login"
                                    className="nav-link-mobile"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="nav-link-mobile"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
