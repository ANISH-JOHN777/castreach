import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockGuests, mockHosts } from '../mock-data/data';
import { Search, Star, MapPin, DollarSign, Calendar } from 'lucide-react';
import './Discover.css';

const Discover = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(user?.role === 'host' ? 'guests' : 'hosts');
    const [searchQuery, setSearchQuery] = useState('');

    const handleBookGuest = (guest) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        // Navigate to bookings page with guest info
        navigate('/bookings', { state: { type: 'guest', profile: guest } });
    };

    const handleApplyToHost = (host) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        // Navigate to bookings page with host info
        navigate('/bookings', { state: { type: 'host', profile: host } });
    };

    const filteredGuests = mockGuests.filter(guest =>
        guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const filteredHosts = mockHosts.filter(host =>
        host.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        host.podcastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        host.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="discover-page">
            <div className="container">
                <div className="discover-header">
                    <h1 className="discover-title">Discover</h1>
                    <p className="discover-subtitle">
                        Find the perfect {activeTab === 'guests' ? 'guests' : 'hosts'} for your podcast
                    </p>
                </div>

                {/* Search Bar */}
                <div className="search-container">
                    <div className="search-bar">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'guests' ? 'active' : ''}`}
                        onClick={() => setActiveTab('guests')}
                    >
                        Guests
                    </button>
                    <button
                        className={`tab ${activeTab === 'hosts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('hosts')}
                    >
                        Hosts
                    </button>
                </div>

                {/* Results */}
                {activeTab === 'guests' ? (
                    <div className="results-grid">
                        {filteredGuests.map(guest => (
                            <div key={guest.id} className="profile-card">
                                <div className="profile-header">
                                    <img src={guest.avatar} alt={guest.name} className="profile-avatar" />
                                    <div className="profile-rating">
                                        <Star size={16} fill="currentColor" />
                                        {guest.rating}
                                    </div>
                                </div>
                                <h3 className="profile-name">{guest.name}</h3>
                                <p className="profile-title">{guest.title}</p>
                                <p className="profile-bio">{guest.bio}</p>
                                <div className="profile-expertise">
                                    {guest.expertise.slice(0, 3).map((skill, index) => (
                                        <span key={index} className="expertise-tag">{skill}</span>
                                    ))}
                                </div>
                                <div className="profile-meta">
                                    <div className="meta-item">
                                        <MapPin size={14} />
                                        {guest.location}
                                    </div>
                                    <div className="meta-item">
                                        <Calendar size={14} />
                                        {guest.episodeCount} episodes
                                    </div>
                                </div>
                                <div className="profile-footer">
                                    <div className="profile-price">
                                        <DollarSign size={16} />
                                        {guest.price}/episode
                                    </div>
                                    <button className="btn btn-primary btn-sm" onClick={() => handleBookGuest(guest)}>Book Now</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="results-grid">
                        {filteredHosts.map(host => (
                            <div key={host.id} className="profile-card">
                                <div className="profile-header">
                                    <img src={host.avatar} alt={host.name} className="profile-avatar" />
                                    <div className="profile-rating">
                                        <Star size={16} fill="currentColor" />
                                        {host.rating}
                                    </div>
                                </div>
                                <h3 className="profile-name">{host.name}</h3>
                                <p className="profile-title">{host.podcastName}</p>
                                <p className="profile-bio">{host.description}</p>
                                <div className="profile-expertise">
                                    <span className="expertise-tag">{host.category}</span>
                                    <span className="expertise-tag">{host.recordingFormat}</span>
                                </div>
                                <div className="profile-meta">
                                    <div className="meta-item">
                                        <Calendar size={14} />
                                        {host.episodeCount} episodes
                                    </div>
                                    <div className="meta-item">
                                        {host.subscribers.toLocaleString()} subscribers
                                    </div>
                                </div>
                                <div className="profile-footer">
                                    <div className="profile-platforms">
                                        {host.platforms.slice(0, 2).map((platform, index) => (
                                            <span key={index} className="platform-badge">{platform}</span>
                                        ))}
                                    </div>
                                    <button className="btn btn-primary btn-sm" onClick={() => handleApplyToHost(host)}>Apply</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {((activeTab === 'guests' && filteredGuests.length === 0) ||
                    (activeTab === 'hosts' && filteredHosts.length === 0)) && (
                        <div className="empty-state">
                            <Search className="empty-state-icon" size={64} />
                            <p className="empty-state-title">No results found</p>
                            <p className="empty-state-description">
                                Try adjusting your search query
                            </p>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default Discover;
