import { useState } from 'react';
import { mockBookings, bookingStatuses } from '../mock-data/data';
import { Calendar, Clock, DollarSign, Filter } from 'lucide-react';
import './Bookings.css';

const Bookings = () => {
    const [bookings] = useState(mockBookings);
    const [filterStatus, setFilterStatus] = useState('all');

    const handleViewDetails = (booking) => {
        alert(`Viewing details for: ${booking.topic}\n\nGuest: ${booking.guestName}\nHost: ${booking.hostName}\nDate: ${booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleString() : 'Not scheduled'}\nDuration: ${booking.duration} minutes\nPrice: $${booking.price}`);
    };

    const handleJoinRecording = (booking) => {
        // In a real app, this would open a video conferencing link
        alert(`Joining recording for: ${booking.topic}\n\nThis would typically open your video conferencing platform.`);
        window.open('https://meet.google.com/', '_blank');
    };

    const handleLeaveReview = (booking) => {
        // In a real app, this would open a review modal
        const rating = prompt(`Leave a review for: ${booking.topic}\n\nRate your experience (1-5):`);
        if (rating && rating >= 1 && rating <= 5) {
            alert(`Thank you for your ${rating}-star review!`);
        }
    };

    const filteredBookings = filterStatus === 'all'
        ? bookings
        : bookings.filter(b => b.status === filterStatus);

    return (
        <div className="bookings-page">
            <div className="container">
                <div className="bookings-header">
                    <h1 className="bookings-title">My Bookings</h1>
                    <div className="filter-group">
                        <Filter size={18} />
                        <select
                            className="filter-select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Bookings</option>
                            <option value="pending">Pending</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div className="bookings-list">
                    {filteredBookings.map(booking => (
                        <div key={booking.id} className="booking-item">
                            <div className="booking-item-header">
                                <div>
                                    <h3 className="booking-item-title">{booking.topic}</h3>
                                    <p className="booking-item-subtitle">
                                        {booking.guestName} × {booking.hostName}
                                    </p>
                                    <p className="booking-item-podcast">{booking.podcastName}</p>
                                </div>
                                <span className={`badge badge-${bookingStatuses[booking.status]?.color || 'primary'}`}>
                                    {bookingStatuses[booking.status]?.label || booking.status}
                                </span>
                            </div>

                            <div className="booking-item-details">
                                <div className="detail-row">
                                    <Calendar size={16} />
                                    <span>
                                        {booking.scheduledDate
                                            ? new Date(booking.scheduledDate).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : 'Not scheduled yet'
                                        }
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <Clock size={16} />
                                    <span>{booking.duration} minutes</span>
                                </div>
                                <div className="detail-row">
                                    <DollarSign size={16} />
                                    <span>${booking.price}</span>
                                </div>
                            </div>

                            {booking.notes && (
                                <div className="booking-item-notes">
                                    <strong>Notes:</strong> {booking.notes}
                                </div>
                            )}

                            <div className="booking-item-actions">
                                <button className="btn btn-secondary btn-sm" onClick={() => handleViewDetails(booking)}>View Details</button>
                                {booking.status === 'scheduled' && (
                                    <button className="btn btn-primary btn-sm" onClick={() => handleJoinRecording(booking)}>Join Recording</button>
                                )}
                                {booking.status === 'completed' && !booking.rating && (
                                    <button className="btn btn-primary btn-sm" onClick={() => handleLeaveReview(booking)}>Leave Review</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredBookings.length === 0 && (
                    <div className="empty-state">
                        <Calendar className="empty-state-icon" size={64} />
                        <p className="empty-state-title">No bookings found</p>
                        <p className="empty-state-description">
                            {filterStatus === 'all'
                                ? 'You don\'t have any bookings yet'
                                : `No ${filterStatus} bookings`
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bookings;
