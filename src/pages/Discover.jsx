import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import { mockGuests, mockHosts } from '../mock-data/data';
import { Search, Star, MapPin, DollarSign, Calendar, Filter, X } from 'lucide-react';
import './Discover.css';

const Discover = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(user?.role === 'host' ? 'guests' : 'hosts');
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        priceRange: [0, 1000],
        minRating: 0,
        location: '',
        availability: 'all',
    });
    const [showFilters, setShowFilters] = useState(false);

    const handleBookGuest = (guest) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        navigate('/bookings', { state: { type: 'guest', profile: guest } });
    };

    const handleApplyToHost = (host) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        navigate('/bookings', { state: { type: 'host', profile: host } });
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({
            priceRange: [0, 1000],
            minRating: 0,
            location: '',
            availability: 'all',
        });
    };

    const filteredGuests = mockGuests.filter(guest => {
        const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guest.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesPrice = guest.price >= filters.priceRange[0] && guest.price <= filters.priceRange[1];
        const matchesRating = guest.rating >= filters.minRating;
        const matchesLocation = !filters.location || guest.location.toLowerCase().includes(filters.location.toLowerCase());
        const matchesAvailability = filters.availability === 'all' || guest.availability === filters.availability;

        return matchesSearch && matchesPrice && matchesRating && matchesLocation && matchesAvailability;
    });

    const filteredHosts = mockHosts.filter(host => {
        const matchesSearch = host.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            host.podcastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            host.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRating = host.rating >= filters.minRating;
        const matchesCategory = !filters.location || host.category.toLowerCase().includes(filters.location.toLowerCase());

        return matchesSearch && matchesRating && matchesCategory;
    });

    return (
        <div className="discover-page">
            <SEO
                title={`Discover ${activeTab === 'guests' ? 'Podcast Guests' : 'Podcast Hosts'} - CastReach`}
                description={activeTab === 'guests'
                    ? 'Find expert podcast guests for your show. Browse verified professionals, thought leaders, and industry experts ready to share their insights.'
                    : 'Discover podcast hosts looking for guests. Connect with engaging shows across all categories and grow your audience.'}
                keywords={`podcast ${activeTab}, find podcast ${activeTab}, book podcast ${activeTab}, ${activeTab === 'guests' ? 'expert guests' : 'podcast shows'}`}
            />
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
                    <button
                        className="filter-toggle btn btn-secondary"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter size={20} />
                        Filters
                    </button>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="filters-panel">
                        <div className="filters-header">
                            <h3>Advanced Filters</h3>
                            <button onClick={() => setShowFilters(false)} className="close-filters">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="filters-grid">
                            {activeTab === 'guests' && (
                                <>
                                    <div className="filter-group">
                                        <label className="filter-label">
                                            Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                                        </label>
                                        <div className="price-inputs">
                                            <input
                                                type="number"
                                                min="0"
                                                max="1000"
                                                value={filters.priceRange[0]}
                                                onChange={(e) => handleFilterChange('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                                                className="form-input"
                                                placeholder="Min"
                                            />
                                            <span>to</span>
                                            <input
                                                type="number"
                                                min="0"
                                                max="1000"
                                                value={filters.priceRange[1]}
                                                onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                                                className="form-input"
                                                placeholder="Max"
                                            />
                                        </div>
                                    </div>
                                    <div className="filter-group">
                                        <label className="filter-label">Availability</label>
                                        <select
                                            value={filters.availability}
                                            onChange={(e) => handleFilterChange('availability', e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="all">All</option>
                                            <option value="Available">Available</option>
                                            <option value="Limited">Limited</option>
                                        </select>
                                    </div>
                                </>
                            )}
                            <div className="filter-group">
                                <label className="filter-label">Minimum Rating: {filters.minRating || 'Any'}</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="5"
                                    step="0.5"
                                    value={filters.minRating}
                                    onChange={(e) => handleFilterChange('minRating', Number(e.target.value))}
                                    className="rating-slider"
                                />
                                <div className="rating-labels">
                                    <span>Any</span>
                                    <span>5★</span>
                                </div>
                            </div>
                            <div className="filter-group">
                                <label className="filter-label">
                                    {activeTab === 'guests' ? 'Location' : 'Category'}
                                </label>
                                <input
                                    type="text"
                                    value={filters.location}
                                    onChange={(e) => handleFilterChange('location', e.target.value)}
                                    className="form-input"
                                    placeholder={activeTab === 'guests' ? 'Enter location...' : 'Enter category...'}
                                />
                            </div>
                        </div>
                        <div className="filters-actions">
                            <button onClick={resetFilters} className="btn btn-secondary">
                                Reset Filters
                            </button>
                            <button onClick={() => setShowFilters(false)} className="btn btn-primary">
                                Apply Filters
                            </button>
                        </div>
                    </div>
                )}

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
