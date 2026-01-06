import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { Calendar, Clock, MapPin, Video, User, Check, X, Plus, Filter } from 'lucide-react';
import './Bookings.css';

const Bookings = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [bookings, setBookings] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookings();
    }, [user]);

    const loadBookings = () => {
        try {
            const allBookings = JSON.parse(localStorage.getItem('castreach_bookings') || '[]');

            // Filter bookings based on user role
            const userBookings = allBookings.filter(booking => {
                if (user.role === 'host') {
                    return booking.hostId === user.id;
                } else {
                    // For guests, show bookings where they are invited (by name for now)
                    return booking.guestName.toLowerCase().includes(user.name.toLowerCase());
                }
            });

            setBookings(userBookings);
        } catch (error) {
            console.error('Error loading bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (bookingId) => {
        try {
            const allBookings = JSON.parse(localStorage.getItem('castreach_bookings') || '[]');
            const updatedBookings = allBookings.map(booking =>
                booking.id === bookingId
                    ? { ...booking, status: 'accepted' }
                    : booking
            );
            localStorage.setItem('castreach_bookings', JSON.stringify(updatedBookings));
            loadBookings();
            toast?.success('Booking request accepted!');
        } catch (error) {
            console.error('Error accepting booking:', error);
            toast?.error('Failed to accept booking');
        }
    };

    const handleDecline = async (bookingId) => {
        try {
            const allBookings = JSON.parse(localStorage.getItem('castreach_bookings') || '[]');
            const updatedBookings = allBookings.map(booking =>
                booking.id === bookingId
                    ? { ...booking, status: 'declined' }
                    : booking
            );
            localStorage.setItem('castreach_bookings', JSON.stringify(updatedBookings));
            loadBookings();
            toast?.success('Booking request declined');
        } catch (error) {
            console.error('Error declining booking:', error);
            toast?.error('Failed to decline booking');
        }
    };

    const handleCancel = async (bookingId) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;

        try {
            const allBookings = JSON.parse(localStorage.getItem('castreach_bookings') || '[]');
            const updatedBookings = allBookings.map(booking =>
                booking.id === bookingId
                    ? { ...booking, status: 'cancelled' }
                    : booking
            );
            localStorage.setItem('castreach_bookings', JSON.stringify(updatedBookings));
            loadBookings();
            toast?.success('Booking cancelled');
        } catch (error) {
            console.error('Error cancelling booking:', error);
            toast?.error('Failed to cancel booking');
        }
    };

    const getStatusBadgeClass = (status) => {
        const statusClasses = {
            pending: 'badge-warning',
            accepted: 'badge-success',
            declined: 'badge-danger',
            cancelled: 'badge-secondary',
            completed: 'badge-info',
        };
        return statusClasses[status] || 'badge-primary';
    };

    const filteredBookings = filterStatus === 'all'
        ? bookings
        : bookings.filter(b => b.status === filterStatus);

    if (loading) {
        return (
            <div className="bookings-page">
                <div className="container">
                    <div className="loading-state">Loading bookings...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bookings-page">
            <div className="container">
                <div className="bookings-header">
                    <div>
                        <h1 className="bookings-title">My Bookings</h1>
                        <p className="bookings-subtitle">
                            {user.role === 'host' ? 'Manage your podcast recordings' : 'Your upcoming appearances'}
                        </p>
                    </div>
                    {user.role === 'host' && (
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/booking/request')}
                        >
                            <Plus size={18} />
                            New Booking
                        </button>
                    )}
                </div>

                <div className="bookings-filters">
                    <div className="filter-group">
                        <Filter size={18} />
                        <select
                            className="filter-select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Bookings</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="declined">Declined</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>

                <div className="bookings-list">
                    {filteredBookings.map(booking => (
                        <div key={booking.id} className="booking-card">
                            <div className="booking-header">
                                <div className="booking-info">
                                    <h3 className="booking-title">{booking.episodeTopic}</h3>
                                    <p className="booking-podcast">{booking.podcastTitle}</p>
                                    <div className="booking-participants">
                                        <span className="participant">
                                            <User size={14} />
                                            Host: {booking.hostName}
                                        </span>
                                        <span className="participant">
                                            <User size={14} />
                                            Guest: {booking.guestName}
                                        </span>
                                    </div>
                                </div>
                                <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                            </div>

                            {booking.description && (
                                <p className="booking-description">{booking.description}</p>
                            )}

                            <div className="booking-details">
                                <div className="detail-item">
                                    <Calendar size={16} />
                                    <span>{new Date(booking.preferredDate).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</span>
                                </div>
                                <div className="detail-item">
                                    <Clock size={16} />
                                    <span>{booking.preferredTime} ({booking.duration} min)</span>
                                </div>
                                <div className="detail-item">
                                    {booking.recordingType === 'online' ? (
                                        <>
                                            <Video size={16} />
                                            <span>Online Recording</span>
                                        </>
                                    ) : (
                                        <>
                                            <MapPin size={16} />
                                            <span>{booking.location || 'In-Person'}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {booking.meetingLink && booking.status === 'accepted' && (
                                <div className="meeting-link">
                                    <Video size={16} />
                                    <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer">
                                        Join Meeting
                                    </a>
                                </div>
                            )}

                            {booking.notes && (
                                <div className="booking-notes">
                                    <strong>Notes:</strong> {booking.notes}
                                </div>
                            )}

                            <div className="booking-actions">
                                {user.role === 'guest' && booking.status === 'pending' && (
                                    <>
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => handleAccept(booking.id)}
                                        >
                                            <Check size={16} />
                                            Accept
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDecline(booking.id)}
                                        >
                                            <X size={16} />
                                            Decline
                                        </button>
                                    </>
                                )}
                                {user.role === 'host' && (booking.status === 'pending' || booking.status === 'accepted') && (
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => handleCancel(booking.id)}
                                    >
                                        <X size={16} />
                                        Cancel
                                    </button>
                                )}
                                <button
                                    className="btn btn-outline btn-sm"
                                    onClick={() => navigate(`/messages`)}
                                >
                                    Message
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredBookings.length === 0 && (
                    <div className="empty-state">
                        <Calendar className="empty-icon" size={64} />
                        <h3>No bookings found</h3>
                        <p>
                            {filterStatus === 'all'
                                ? user.role === 'host'
                                    ? "You haven't created any booking requests yet"
                                    : "You don't have any booking invitations"
                                : `No ${filterStatus} bookings`}
                        </p>
                        {user.role === 'host' && filterStatus === 'all' && (
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/booking/request')}
                            >
                                <Plus size={18} />
                                Create Your First Booking
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bookings;
