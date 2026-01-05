import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Calendar,
    DollarSign,
    Star,
    TrendingUp,
    Clock,
    CheckCircle,
    MessageCircle,
    Search
} from 'lucide-react';
import { mockBookings } from '../mock-data/data';
import './Dashboard.css';

const GuestDashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState(mockBookings);

    const handleAcceptRequest = (booking) => {
        alert(`Accepted booking request for: ${booking.podcastName}\n\nThe host will be notified and you can proceed with scheduling.`);
        // In a real app, this would update the booking status in the backend
        setBookings(prev => prev.map(b =>
            b.id === booking.id ? { ...b, status: 'scheduled' } : b
        ));
    };

    const handleDeclineRequest = (booking) => {
        const reason = prompt(`Decline booking for: ${booking.podcastName}\n\nOptional: Provide a reason:`);
        alert(`Booking request declined. The host will be notified.`);
        // In a real app, this would update the booking status in the backend
        setBookings(prev => prev.filter(b => b.id !== booking.id));
    };

    const stats = [
        {
            icon: <Calendar size={24} />,
            label: 'Total Bookings',
            value: bookings.length,
            color: 'primary',
        },
        {
            icon: <CheckCircle size={24} />,
            label: 'Completed',
            value: bookings.filter(b => b.status === 'completed').length,
            color: 'success',
        },
        {
            icon: <Clock size={24} />,
            label: 'Upcoming',
            value: bookings.filter(b => b.status === 'scheduled').length,
            color: 'warning',
        },
        {
            icon: <DollarSign size={24} />,
            label: 'Total Earnings',
            value: `$${bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.price, 0)}`,
            color: 'info',
        },
    ];

    const upcomingBookings = bookings.filter(b => b.status === 'scheduled');
    const pendingBookings = bookings.filter(b => b.status === 'pending');

    return (
        <div className="dashboard-page">
            <div className="container">
                {/* Header */}
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Welcome back, {user?.name}!</h1>
                        <p className="dashboard-subtitle">Here's what's happening with your podcast appearances</p>
                    </div>
                    <Link to="/discover" className="btn btn-primary">
                        <Search size={18} />
                        Find Opportunities
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className={`stat-card stat-${stat.color}`}>
                            <div className="stat-icon">{stat.icon}</div>
                            <div className="stat-content">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="dashboard-grid">
                    {/* Upcoming Bookings */}
                    <div className="dashboard-section">
                        <div className="section-header-inline">
                            <h2 className="section-title-small">Upcoming Recordings</h2>
                            <Link to="/bookings" className="link-small">View All</Link>
                        </div>
                        <div className="bookings-list">
                            {upcomingBookings.length > 0 ? (
                                upcomingBookings.map(booking => (
                                    <div key={booking.id} className="booking-card">
                                        <div className="booking-header">
                                            <div>
                                                <h3 className="booking-title">{booking.podcastName}</h3>
                                                <p className="booking-host">with {booking.hostName}</p>
                                            </div>
                                            <span className="badge badge-success">Scheduled</span>
                                        </div>
                                        <p className="booking-topic">{booking.topic}</p>
                                        <div className="booking-footer">
                                            <div className="booking-meta">
                                                <Calendar size={16} />
                                                {new Date(booking.scheduledDate).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                            <div className="booking-meta">
                                                <Clock size={16} />
                                                {booking.duration} min
                                            </div>
                                        </div>
                                        <div className="booking-actions">
                                            <Link to={`/messages?booking=${booking.id}`} className="btn btn-secondary btn-sm">
                                                <MessageCircle size={16} />
                                                Message
                                            </Link>
                                            <Link to={`/bookings/${booking.id}`} className="btn btn-primary btn-sm">
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    <Calendar className="empty-state-icon" size={48} />
                                    <p className="empty-state-title">No upcoming recordings</p>
                                    <p className="empty-state-description">
                                        Browse available opportunities to book your next appearance
                                    </p>
                                    <Link to="/discover" className="btn btn-primary">
                                        Discover Podcasts
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pending Requests */}
                    <div className="dashboard-section">
                        <div className="section-header-inline">
                            <h2 className="section-title-small">Pending Requests</h2>
                            <Link to="/bookings?status=pending" className="link-small">View All</Link>
                        </div>
                        <div className="requests-list">
                            {pendingBookings.length > 0 ? (
                                pendingBookings.map(booking => (
                                    <div key={booking.id} className="request-card">
                                        <div className="request-header">
                                            <h4 className="request-title">{booking.podcastName}</h4>
                                            <span className="badge badge-warning">Pending</span>
                                        </div>
                                        <p className="request-host">Host: {booking.hostName}</p>
                                        <p className="request-topic">{booking.topic}</p>
                                        <div className="request-meta">
                                            <span className="request-price">${booking.price}</span>
                                            <span className="request-date">
                                                {new Date(booking.requestedDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="request-actions">
                                            <button className="btn btn-success btn-sm" onClick={() => handleAcceptRequest(booking)}>Accept</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDeclineRequest(booking)}>Decline</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state-small">
                                    <Clock size={32} />
                                    <p>No pending requests</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <h2 className="section-title-small">Quick Actions</h2>
                    <div className="actions-grid">
                        <Link to="/profile" className="action-card">
                            <Star size={24} />
                            <span>Update Profile</span>
                        </Link>
                        <Link to="/discover" className="action-card">
                            <Search size={24} />
                            <span>Find Podcasts</span>
                        </Link>
                        <Link to="/messages" className="action-card">
                            <MessageCircle size={24} />
                            <span>Messages</span>
                        </Link>
                        <Link to="/bookings" className="action-card">
                            <TrendingUp size={24} />
                            <span>View Analytics</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestDashboard;
