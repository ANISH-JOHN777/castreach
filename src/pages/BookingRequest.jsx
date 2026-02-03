import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { supabase } from '../config/supabase';
import { Calendar, Clock, MapPin, Video, Users, Send, X, Globe } from 'lucide-react';
import './BookingRequest.css';

const BookingRequest = () => {
    const { user, usingSupabase } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        guestId: '',
        guestName: '',
        podcastTitle: '',
        episodeTopic: '',
        description: '',
        preferredDate: '',
        preferredTime: '',
        duration: '60',
        recordingType: 'online',
        location: '',
        meetingLink: '',
        notes: '',
    });

    // Pre-fill guest data if coming from Discover page
    useEffect(() => {
        if (location.state?.guestData) {
            const guest = location.state.guestData;
            setFormData(prev => ({
                ...prev,
                guestId: guest.id || '',
                guestName: guest.name || '',
            }));
        }
    }, [location.state]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (usingSupabase) {
                // Supabase booking creation
                console.log('📅 Creating booking request in Supabase:', formData);

                // Try to find guest by name to get their ID
                let guestId = null;
                if (formData.guestName) {
                    const { data: guestProfile } = await supabase
                        .from('profiles')
                        .select('id')
                        .ilike('name', formData.guestName)
                        .single();

                    if (guestProfile) {
                        guestId = guestProfile.id;
                    }
                }

                const bookingData = {
                    host_id: user.id,
                    host_name: user.name,
                    guest_id: guestId,
                    guest_name: formData.guestName,
                    podcast_title: formData.podcastTitle,
                    episode_topic: formData.episodeTopic,
                    description: formData.description,
                    preferred_date: formData.preferredDate,
                    preferred_time: formData.preferredTime,
                    duration: parseInt(formData.duration),
                    recording_type: formData.recordingType,
                    location: formData.location || null,
                    meeting_link: formData.meetingLink || null,
                    notes: formData.notes || null,
                    status: 'pending',
                };

                const { data, error } = await supabase
                    .from('bookings')
                    .insert(bookingData)
                    .select()
                    .single();

                if (error) throw error;

                console.log('✅ Booking created:', data);
                toast?.success('Booking request sent successfully!');
                navigate('/bookings');
            } else {
                // Mock booking creation (localStorage fallback)
                const bookingRequest = {
                    id: Date.now().toString(),
                    hostId: user.id,
                    hostName: user.name,
                    ...formData,
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                };

                const existingBookings = JSON.parse(localStorage.getItem('castreach_bookings') || '[]');
                existingBookings.push(bookingRequest);
                localStorage.setItem('castreach_bookings', JSON.stringify(existingBookings));

                toast?.success('Booking request sent successfully!');
                navigate('/bookings');
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            toast?.error(error.message || 'Failed to send booking request');
        } finally {
            setLoading(false);
        }
    };

    if (user?.role !== 'host') {
        return (
            <div className="booking-request-page">
                <div className="container">
                    <div className="error-message">
                        <h2>Access Denied</h2>
                        <p>Only hosts can create booking requests.</p>
                        <button onClick={() => navigate('/discover')} className="btn btn-primary">
                            Go to Discover
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-request-page">
            <div className="container">
                <div className="booking-request-container">
                    <div className="booking-header">
                        <h1 className="booking-title">Create Booking Request</h1>
                        <p className="booking-subtitle">Invite a guest to your podcast</p>
                    </div>

                    <form onSubmit={handleSubmit} className="booking-form">
                        {/* Guest Information */}
                        <div className="form-section">
                            <h2 className="section-title">
                                <Users size={20} />
                                Guest Information
                            </h2>

                            <div className="form-group">
                                <label className="form-label">Guest Name *</label>
                                <input
                                    type="text"
                                    name="guestName"
                                    className="form-input"
                                    placeholder="Enter guest name"
                                    value={formData.guestName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Episode Details */}
                        <div className="form-section">
                            <h2 className="section-title">
                                <Video size={20} />
                                Episode Details
                            </h2>

                            <div className="form-group">
                                <label className="form-label">Podcast Title *</label>
                                <input
                                    type="text"
                                    name="podcastTitle"
                                    className="form-input"
                                    placeholder="Your podcast name"
                                    value={formData.podcastTitle}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Episode Topic *</label>
                                <input
                                    type="text"
                                    name="episodeTopic"
                                    className="form-input"
                                    placeholder="What will you discuss?"
                                    value={formData.episodeTopic}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    name="description"
                                    className="form-textarea"
                                    rows="4"
                                    placeholder="Provide more details about the episode, talking points, etc."
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Scheduling */}
                        <div className="form-section">
                            <h2 className="section-title">
                                <Calendar size={20} />
                                Scheduling
                            </h2>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Preferred Date *</label>
                                    <input
                                        type="date"
                                        name="preferredDate"
                                        className="form-input"
                                        value={formData.preferredDate}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Preferred Time *</label>
                                    <input
                                        type="time"
                                        name="preferredTime"
                                        className="form-input"
                                        value={formData.preferredTime}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Duration (minutes) *</label>
                                <select
                                    name="duration"
                                    className="form-select"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="30">30 minutes</option>
                                    <option value="45">45 minutes</option>
                                    <option value="60">1 hour</option>
                                    <option value="90">1.5 hours</option>
                                    <option value="120">2 hours</option>
                                </select>
                            </div>
                        </div>

                        {/* Recording Type */}
                        <div className="form-section">
                            <h2 className="section-title">
                                <MapPin size={20} />
                                Recording Details
                            </h2>

                            <div className="form-group">
                                <label className="form-label">Recording Type *</label>
                                <div className="radio-group">
                                    <label className={`radio-option ${formData.recordingType === 'online' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="recordingType"
                                            value="online"
                                            checked={formData.recordingType === 'online'}
                                            onChange={handleChange}
                                        />
                                        <span><Globe size={16} /> Online (Remote)</span>
                                    </label>
                                    <label className={`radio-option ${formData.recordingType === 'offline' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="recordingType"
                                            value="offline"
                                            checked={formData.recordingType === 'offline'}
                                            onChange={handleChange}
                                        />
                                        <span><MapPin size={16} /> In-Person (Offline)</span>
                                    </label>
                                </div>
                            </div>

                            {formData.recordingType === 'online' ? (
                                <div className="form-group">
                                    <label className="form-label">Meeting Link</label>
                                    <input
                                        type="url"
                                        name="meetingLink"
                                        className="form-input"
                                        placeholder="https://zoom.us/j/... or your preferred platform"
                                        value={formData.meetingLink}
                                        onChange={handleChange}
                                    />
                                    <small className="form-hint">You can add this later if not decided yet</small>
                                </div>
                            ) : (
                                <div className="form-group">
                                    <label className="form-label">Location *</label>
                                    <input
                                        type="text"
                                        name="location"
                                        className="form-input"
                                        placeholder="Studio address or meeting location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required={formData.recordingType === 'offline'}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Additional Notes */}
                        <div className="form-section">
                            <h2 className="section-title">Additional Notes</h2>
                            <div className="form-group">
                                <textarea
                                    name="notes"
                                    className="form-textarea"
                                    rows="3"
                                    placeholder="Any special requirements, equipment needed, preparation materials, etc."
                                    value={formData.notes}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate(-1)}
                                disabled={loading}
                            >
                                <X size={18} />
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                <Send size={18} />
                                {loading ? 'Sending...' : 'Send Request'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingRequest;
