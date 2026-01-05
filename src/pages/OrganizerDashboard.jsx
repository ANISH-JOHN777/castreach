import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Users,
    Calendar,
    DollarSign,
    TrendingUp,
    CheckCircle,
    Clock,
    Star,
    BarChart
} from 'lucide-react';
import { mockBookings, mockGuests, mockHosts } from '../mock-data/data';
import './Dashboard.css';

const OrganizerDashboard = () => {
    const { user } = useAuth();
    const [bookings] = useState(mockBookings);

    const stats = [
        {
            icon: <Users size={24} />,
            label: 'Total Users',
            value: mockGuests.length + mockHosts.length,
            color: 'primary',
        },
        {
            icon: <Calendar size={24} />,
            label: 'Total Bookings',
            value: bookings.length,
            color: 'info',
        },
        {
            icon: <CheckCircle size={24} />,
            label: 'Completed',
            value: bookings.filter(b => b.status === 'completed').length,
            color: 'success',
        },
        {
            icon: <DollarSign size={24} />,
            label: 'Revenue',
            value: `$${bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.price * 0.1, 0).toFixed(0)}`,
            color: 'warning',
        },
    ];

    const recentBookings = bookings.slice(0, 5);

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Organizer Dashboard</h1>
                        <p className="dashboard-subtitle">Platform overview and management</p>
                    </div>
                    <Link to="/discover" className="btn btn-primary">
                        <BarChart size={18} />
                        View Analytics
                    </Link>
                </div>

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
                    <div className="dashboard-section">
                        <div className="section-header-inline">
                            <h2 className="section-title-small">Recent Bookings</h2>
                            <Link to="/bookings" className="link-small">View All</Link>
                        </div>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Guest</th>
                                        <th>Host</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBookings.map(booking => (
                                        <tr key={booking.id}>
                                            <td>{booking.guestName}</td>
                                            <td>{booking.hostName}</td>
                                            <td>
                                                {booking.scheduledDate
                                                    ? new Date(booking.scheduledDate).toLocaleDateString()
                                                    : 'TBD'
                                                }
                                            </td>
                                            <td>
                                                <span className={`badge badge-${booking.status === 'completed' ? 'success' :
                                                        booking.status === 'scheduled' ? 'info' :
                                                            booking.status === 'pending' ? 'warning' : 'error'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td>${booking.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="dashboard-section">
                        <h2 className="section-title-small">Platform Stats</h2>
                        <div className="platform-stats">
                            <div className="platform-stat-card">
                                <div className="platform-stat-header">
                                    <span className="platform-stat-label">Active Guests</span>
                                    <Users size={20} className="platform-stat-icon" />
                                </div>
                                <div className="platform-stat-value">{mockGuests.length}</div>
                                <div className="platform-stat-change positive">
                                    <TrendingUp size={14} />
                                    +12% this month
                                </div>
                            </div>

                            <div className="platform-stat-card">
                                <div className="platform-stat-header">
                                    <span className="platform-stat-label">Active Hosts</span>
                                    <Users size={20} className="platform-stat-icon" />
                                </div>
                                <div className="platform-stat-value">{mockHosts.length}</div>
                                <div className="platform-stat-change positive">
                                    <TrendingUp size={14} />
                                    +8% this month
                                </div>
                            </div>

                            <div className="platform-stat-card">
                                <div className="platform-stat-header">
                                    <span className="platform-stat-label">Avg Rating</span>
                                    <Star size={20} className="platform-stat-icon" />
                                </div>
                                <div className="platform-stat-value">4.9</div>
                                <div className="platform-stat-change positive">
                                    <TrendingUp size={14} />
                                    +0.2 this month
                                </div>
                            </div>

                            <div className="platform-stat-card">
                                <div className="platform-stat-header">
                                    <span className="platform-stat-label">Success Rate</span>
                                    <CheckCircle size={20} className="platform-stat-icon" />
                                </div>
                                <div className="platform-stat-value">94%</div>
                                <div className="platform-stat-change positive">
                                    <TrendingUp size={14} />
                                    +3% this month
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="quick-actions">
                    <h2 className="section-title-small">Management</h2>
                    <div className="actions-grid">
                        <Link to="/users" className="action-card">
                            <Users size={24} />
                            <span>Manage Users</span>
                        </Link>
                        <Link to="/bookings" className="action-card">
                            <Calendar size={24} />
                            <span>All Bookings</span>
                        </Link>
                        <Link to="/analytics" className="action-card">
                            <BarChart size={24} />
                            <span>Analytics</span>
                        </Link>
                        <Link to="/settings" className="action-card">
                            <Star size={24} />
                            <span>Settings</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizerDashboard;
