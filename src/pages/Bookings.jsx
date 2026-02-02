import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { supabase } from '../config/supabase';
import {
    Calendar, Clock, MapPin, Video, User, Check, X, Plus, Filter,
    Search, Download, MoreVertical, Edit, Copy, Trash2, Mail,
    BarChart3, TrendingUp, AlertCircle, CheckCircle, XCircle,
    Grid, List, RefreshCw, ArrowUpDown, ChevronDown
} from 'lucide-react';
import './Bookings.css';

const Bookings = () => {
    const { user, usingSupabase } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [bookings, setBookings] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    const [sortBy, setSortBy] = useState('date'); // 'date', 'status', 'title'
    const [loading, setLoading] = useState(true);
    const [selectedBookings, setSelectedBookings] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadBookings();
    }, [user]);

    const loadBookings = async () => {
        try {
            if (usingSupabase) {
                const { data, error } = await supabase
                    .from('bookings')
                    .select('*')
                    .or(`host_id.eq.${user.id},guest_id.eq.${user.id}`)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setBookings(data || []);
            } else {
                const allBookings = JSON.parse(localStorage.getItem('castreach_bookings') || '[]');
                const userBookings = allBookings.filter(booking => {
                    if (user.role === 'host') {
                        return booking.hostId === user.id;
                    } else {
                        return booking.guestName.toLowerCase().includes(user.name.toLowerCase());
                    }
                });
                setBookings(userBookings);
            }
        } catch (error) {
            console.error('Error loading bookings:', error);
            toast?.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (bookingId) => {
        try {
            if (usingSupabase) {
                const { error } = await supabase
                    .from('bookings')
                    .update({ status: 'accepted' })
                    .eq('id', bookingId);
                if (error) throw error;
            } else {
                const allBookings = JSON.parse(localStorage.getItem('castreach_bookings') || '[]');
                const updatedBookings = allBookings.map(booking =>
                    booking.id === bookingId ? { ...booking, status: 'accepted' } : booking
                );
                localStorage.setItem('castreach_bookings', JSON.stringify(updatedBookings));
            }
            loadBookings();
            toast?.success('Booking request accepted!');
        } catch (error) {
            console.error('Error accepting booking:', error);
            toast?.error('Failed to accept booking');
        }
    };

    const handleDecline = async (bookingId) => {
        try {
            if (usingSupabase) {
                const { error } = await supabase
                    .from('bookings')
                    .update({ status: 'declined' })
                    .eq('id', bookingId);
                if (error) throw error;
            } else {
                const allBookings = JSON.parse(localStorage.getItem('castreach_bookings') || '[]');
                const updatedBookings = allBookings.map(booking =>
                    booking.id === bookingId ? { ...booking, status: 'declined' } : booking
                );
                localStorage.setItem('castreach_bookings', JSON.stringify(updatedBookings));
            }
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
            if (usingSupabase) {
                const { error } = await supabase
                    .from('bookings')
                    .update({ status: 'cancelled' })
                    .eq('id', bookingId);
                if (error) throw error;
            } else {
                const allBookings = JSON.parse(localStorage.getItem('castreach_bookings') || '[]');
                const updatedBookings = allBookings.map(booking =>
                    booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
                );
                localStorage.setItem('castreach_bookings', JSON.stringify(updatedBookings));
            }
            loadBookings();
            toast?.success('Booking cancelled');
        } catch (error) {
            console.error('Error cancelling booking:', error);
            toast?.error('Failed to cancel booking');
        }
    };

    const normalizeBooking = (booking) => {
        return {
            id: booking.id,
            episodeTopic: booking.episode_topic || booking.episodeTopic,
            podcastTitle: booking.podcast_title || booking.podcastTitle,
            hostName: booking.host_name || booking.hostName,
            guestName: booking.guest_name || booking.guestName,
            description: booking.description,
            preferredDate: booking.preferred_date || booking.preferredDate,
            preferredTime: booking.preferred_time || booking.preferredTime,
            duration: booking.duration,
            recordingType: booking.recording_type || booking.recordingType,
            location: booking.location,
            meetingLink: booking.meeting_link || booking.meetingLink,
            notes: booking.notes,
            status: booking.status,
        };
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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'accepted':
                return <CheckCircle size={16} />;
            case 'declined':
            case 'cancelled':
                return <XCircle size={16} />;
            case 'pending':
                return <AlertCircle size={16} />;
            case 'completed':
                return <Check Circle size={16} />;
            default:
                return <Clock size={16} />;
        }
    };

    // Calculate statistics
    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        accepted: bookings.filter(b => b.status === 'accepted').length,
        completed: bookings.filter(b => b.status === 'completed').length,
    };

    // Filter and search bookings
    const normalizedBookings = bookings.map(normalizeBooking);
    let filteredBookings = normalizedBookings;

    // Apply status filter
    if (filterStatus !== 'all') {
        filteredBookings = filteredBookings.filter(b => b.status === filterStatus);
    }

    // Apply search
    if (searchQuery) {
        filteredBookings = filteredBookings.filter(b =>
            b.episodeTopic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.podcastTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.guestName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.hostName?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Apply sorting
    filteredBookings.sort((a, b) => {
        switch (sortBy) {
            case 'date':
                return new Date(b.preferredDate) - new Date(a.preferredDate);
            case 'status':
                return a.status.localeCompare(b.status);
            case 'title':
                return a.episodeTopic.localeCompare(b.episodeTopic);
            default:
                return 0;
        }
    });

    if (loading) {
        return (
            <div className="bookings-page">
                <div className="container">
                    <div className="loading-state">
                        <RefreshCw className="loading-spinner" size={32} />
                        <p>Loading bookings...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bookings-page">
            <div className="container">
                {/* Header */}
                <div className="bookings-header">
                    <div>
                        <h1 className="bookings-title">My Bookings</h1>
                        <p className="bookings-subtitle">
                            {user.role === 'host' ? 'Manage your podcast recordings' : 'Your upcoming appearances'}
                        </p>
                    </div>
                    <div className="header-actions">
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
                </div>

                {/* Statistics Dashboard */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon stat-icon-primary">
                            <Calendar size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-label">Total Bookings</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon stat-icon-warning">
                            <Clock size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stats.pending}</div>
                            <div className="stat-label">Pending</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon stat-icon-success">
                            <CheckCircle size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stats.accepted}</div>
                            <div className="stat-label">Accepted</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon stat-icon-info">
                            <TrendingUp size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stats.completed}</div>
                            <div className="stat-label">Completed</div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bookings-toolbar">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search bookings..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="toolbar-actions">
                        <div className="filter-group">
                            <Filter size={18} />
                            <select
                                className="filter-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="accepted">Accepted</option>
                                <option value="declined">Declined</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <ArrowUpDown size={18} />
                            <select
                                className="filter-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="date">Sort by Date</option>
                                <option value="status">Sort by Status</option>
                                <option value="title">Sort by Title</option>
                            </select>
                        </div>

                        <div className="view-toggle">
                            <button
                                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                                title="List View"
                            >
                                <List size={18} />
                            </button>
                            <button
                                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                                title="Grid View"
                            >
                                <Grid size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bookings List/Grid */}
                <div className={`bookings-list ${viewMode === 'grid' ? 'grid-view' : ''}`}>
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
                                <div className="booking-status-wrapper">
                                    <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                                        {getStatusIcon(booking.status)}
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            {booking.description && (
                                <p className="booking-description">{booking.description}</p>
                            )}

                            <div className="booking-details">
                                <div className="detail-item">
                                    <Calendar size={16} />
                                    <span>{new Date(booking.preferredDate).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
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
                                {booking.status === 'accepted' && (
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => navigate(`/room/${booking.id}`)}
                                    >
                                        <Video size={16} />
                                        Join Recording Room
                                    </button>
                                )}

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
                                    <Mail size={16} />
                                    Message
                                </button>

                                <div className="dropdown">
                                    <button className="btn btn-icon btn-sm">
                                        <MoreVertical size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredBookings.length === 0 && (
                    <div className="empty-state">
                        <Calendar className="empty-icon" size={64} />
                        <h3>No bookings found</h3>
                        <p>
                            {searchQuery
                                ? `No bookings match "${searchQuery}"`
                                : filterStatus === 'all'
                                    ? user.role === 'host'
                                        ? "You haven't created any booking requests yet"
                                        : "You don't have any booking invitations"
                                    : `No ${filterStatus} bookings`}
                        </p>
                        {user.role === 'host' && filterStatus === 'all' && !searchQuery && (
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
