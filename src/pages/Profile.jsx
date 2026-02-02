import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Camera, Mail, MapPin, Globe, Edit2, Save, Star, Award,
    Briefcase, Calendar, TrendingUp, Users, Mic, Play,
    Twitter, Linkedin, Instagram, Youtube, ExternalLink,
    Upload, X, Check, Clock, DollarSign, MessageSquare,
    Share2, Settings, BarChart3, Headphones, Video,
    Target, Flame, Gem
} from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [showShareMenu, setShowShareMenu] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        title: user?.title || 'Podcast Enthusiast',
        bio: user?.bio || 'Passionate about creating amazing content and connecting with audiences.',
        location: user?.location || 'San Francisco, CA',
        website: user?.website || '',
        twitter: user?.twitter || '',
        linkedin: user?.linkedin || '',
        instagram: user?.instagram || '',
        youtube: user?.youtube || '',
        expertise: user?.expertise || ['Technology', 'Business', 'Innovation'],
        price: user?.price || 0,
        availability: user?.availability || 'Available',
        role: user?.role || 'guest',
    });

    // Mock data for showcase
    const [stats, setStats] = useState({
        totalEpisodes: 24,
        totalHours: 48,
        avgRating: 4.9,
        totalReviews: 127,
        followers: 1542,
        following: 234
    });

    const [pastEpisodes, setPastEpisodes] = useState([
        {
            id: 1,
            title: 'The Future of AI in Business',
            podcast: 'Tech Talks Daily',
            date: '2024-01-15',
            duration: '45 min',
            thumbnail: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=400&h=400&fit=crop',
            plays: '12.5K'
        },
        {
            id: 2,
            title: 'Building Successful Startups',
            podcast: 'Entrepreneur Hour',
            date: '2024-01-08',
            duration: '60 min',
            thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop',
            plays: '8.2K'
        },
        {
            id: 3,
            title: 'Innovation in Tech Industry',
            podcast: 'Future Forward',
            date: '2023-12-20',
            duration: '38 min',
            thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop',
            plays: '15.7K'
        }
    ]);

    const [achievements, setAchievements] = useState([
        { id: 1, icon: 'Target', title: 'Top Contributor', description: '100+ episodes' },
        { id: 2, icon: 'Star', title: 'Highly Rated', description: '4.9+ rating' },
        { id: 3, icon: 'Flame', title: 'Trending Guest', description: 'Featured this month' },
        { id: 4, icon: 'Gem', title: 'Premium Member', description: 'Verified profile' }
    ]);

    const [testimonials, setTestimonials] = useState([
        {
            id: 1,
            author: 'Sarah Johnson',
            role: 'Podcast Host',
            avatar: 'https://i.pravatar.cc/150?img=1',
            rating: 5,
            text: 'Amazing guest! Very professional and brought incredible insights to our show.',
            date: '2024-01-10'
        },
        {
            id: 2,
            author: 'Mike Chen',
            role: 'Producer',
            avatar: 'https://i.pravatar.cc/150?img=2',
            rating: 5,
            text: 'Highly recommend! Great communication and excellent content delivery.',
            date: '2024-01-05'
        }
    ]);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || prev.name,
                email: user.email || prev.email,
                title: user.title || prev.title,
                bio: user.bio || prev.bio,
                location: user.location || prev.location,
                expertise: user.expertise || prev.expertise,
                price: user.price || prev.price,
                availability: user.availability || prev.availability,
                role: user.role || 'guest',
            }));
        }
    }, [user]);

    // Helper function to render achievement icons
    const renderAchievementIcon = (iconName) => {
        const iconProps = { size: 32, className: "achievement-icon-svg" };
        switch (iconName) {
            case 'Target':
                return <Target {...iconProps} />;
            case 'Star':
                return <Star {...iconProps} fill="currentColor" />;
            case 'Flame':
                return <Flame {...iconProps} />;
            case 'Gem':
                return <Gem {...iconProps} />;
            default:
                return <Award {...iconProps} />;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(formData);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const shareProfile = (platform) => {
        const url = window.location.href;
        const text = `Check out ${user?.name}'s profile on CastReach!`;

        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            copy: url
        };

        if (platform === 'copy') {
            navigator.clipboard.writeText(url);
            alert('Profile link copied to clipboard!');
        } else {
            window.open(shareUrls[platform], '_blank');
        }
        setShowShareMenu(false);
    };

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-container">
                    {/* Cover Banner */}
                    <div className="profile-cover">
                        <img
                            src="https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop"
                            alt="Cover"
                            className="cover-image"
                        />
                        <button className="cover-edit-btn">
                            <Camera size={18} />
                            <span>Change Cover</span>
                        </button>

                        {/* Avatar */}
                        <div className="profile-avatar-container">
                            <div className="profile-avatar-large">
                                <img src={user?.avatar} alt={user?.name} />
                                <button className="avatar-edit-btn">
                                    <Camera size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Profile Header */}
                    <div className="profile-header">
                        <div className="profile-header-info">
                            <div className="profile-name-section">
                                <h1 className="profile-name-large">{user?.name}</h1>
                                <span className="profile-role-badge">
                                    <Mic size={14} />
                                    {user?.role === 'host' ? 'Podcast Host' : 'Podcast Guest'}
                                </span>
                                {user?.availability === 'Available' && (
                                    <span className="availability-badge available">
                                        <div className="status-dot"></div>
                                        Available for bookings
                                    </span>
                                )}
                            </div>
                            <p className="profile-title">{formData.title}</p>
                            <div className="profile-meta">
                                {formData.location && (
                                    <span className="meta-item">
                                        <MapPin size={16} />
                                        {formData.location}
                                    </span>
                                )}
                                <span className="meta-item">
                                    <Users size={16} />
                                    {stats.followers} followers
                                </span>
                                <span className="meta-item">
                                    <Star size={16} fill="currentColor" />
                                    {stats.avgRating} ({stats.totalReviews} reviews)
                                </span>
                            </div>
                        </div>

                        <div className="profile-header-actions">
                            {user?.role === 'guest' && formData.price > 0 && (
                                <div className="price-tag">
                                    <DollarSign size={18} />
                                    <span>${formData.price}/session</span>
                                </div>
                            )}
                            <button
                                className="btn btn-primary"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
                                {isEditing ? 'Save Changes' : 'Edit Profile'}
                            </button>
                            <div className="share-menu-container">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowShareMenu(!showShareMenu)}
                                >
                                    <Share2 size={18} />
                                    Share
                                </button>
                                {showShareMenu && (
                                    <div className="share-dropdown">
                                        <button onClick={() => shareProfile('twitter')}>
                                            <Twitter size={16} />
                                            Share on Twitter
                                        </button>
                                        <button onClick={() => shareProfile('linkedin')}>
                                            <Linkedin size={16} />
                                            Share on LinkedIn
                                        </button>
                                        <button onClick={() => shareProfile('copy')}>
                                            <ExternalLink size={16} />
                                            Copy Link
                                        </button>
                                    </div>
                                )}
                            </div>
                            <button className="btn btn-secondary">
                                <Settings size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="profile-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            <Briefcase size={18} />
                            Overview
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'episodes' ? 'active' : ''}`}
                            onClick={() => setActiveTab('episodes')}
                        >
                            <Headphones size={18} />
                            Past Episodes ({pastEpisodes.length})
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            <Star size={18} />
                            Reviews ({testimonials.length})
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                            onClick={() => setActiveTab('analytics')}
                        >
                            <BarChart3 size={18} />
                            Analytics
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="profile-content">
                        <div className="profile-main">
                            {activeTab === 'overview' && (
                                <>
                                    {/* About Section */}
                                    <section className="profile-section">
                                        <h2 className="section-title">
                                            <Users size={20} />
                                            About
                                        </h2>
                                        {isEditing ? (
                                            <form onSubmit={handleSubmit} className="profile-form">
                                                <div className="form-group">
                                                    <label className="form-label">Bio</label>
                                                    <textarea
                                                        name="bio"
                                                        className="form-textarea"
                                                        value={formData.bio}
                                                        onChange={handleChange}
                                                        rows={4}
                                                        placeholder="Tell us about yourself..."
                                                    />
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label className="form-label">Professional Title</label>
                                                        <input
                                                            type="text"
                                                            name="title"
                                                            className="form-input"
                                                            value={formData.title}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Location</label>
                                                        <input
                                                            type="text"
                                                            name="location"
                                                            className="form-input"
                                                            value={formData.location}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>
                                            </form>
                                        ) : (
                                            <p className="profile-bio-text">{formData.bio}</p>
                                        )}
                                    </section>

                                    {/* Expertise Section */}
                                    <section className="profile-section">
                                        <h2 className="section-title">
                                            <Award size={20} />
                                            Areas of Expertise
                                        </h2>
                                        <div className="expertise-grid">
                                            {formData.expertise.map((skill, index) => (
                                                <div key={index} className="expertise-card">
                                                    <div className="expertise-icon">
                                                        <Star size={20} fill="currentColor" />
                                                    </div>
                                                    <span>{skill}</span>
                                                    <span className="endorsement-count">24 endorsements</span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Achievements */}
                                    <section className="profile-section">
                                        <h2 className="section-title">
                                            <Award size={20} />
                                            Achievements & Badges
                                        </h2>
                                        <div className="achievements-grid">
                                            {achievements.map(achievement => (
                                                <div key={achievement.id} className="achievement-card">
                                                    <div className="achievement-icon">{renderAchievementIcon(achievement.icon)}</div>
                                                    <h4>{achievement.title}</h4>
                                                    <p>{achievement.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Social Links */}
                                    <section className="profile-section">
                                        <h2 className="section-title">
                                            <Globe size={20} />
                                            Connect
                                        </h2>
                                        <div className="social-links-grid">
                                            {formData.website && (
                                                <a href={formData.website} target="_blank" rel="noopener noreferrer" className="social-link-card">
                                                    <Globe size={24} />
                                                    <span>Website</span>
                                                    <ExternalLink size={16} className="external-icon" />
                                                </a>
                                            )}
                                            {formData.twitter && (
                                                <a href={`https://twitter.com/${formData.twitter}`} target="_blank" rel="noopener noreferrer" className="social-link-card">
                                                    <Twitter size={24} />
                                                    <span>Twitter</span>
                                                    <ExternalLink size={16} className="external-icon" />
                                                </a>
                                            )}
                                            {formData.linkedin && (
                                                <a href={formData.linkedin} target="_blank" rel="noopener noreferrer" className="social-link-card">
                                                    <Linkedin size={24} />
                                                    <span>LinkedIn</span>
                                                    <ExternalLink size={16} className="external-icon" />
                                                </a>
                                            )}
                                            {formData.youtube && (
                                                <a href={formData.youtube} target="_blank" rel="noopener noreferrer" className="social-link-card">
                                                    <Youtube size={24} />
                                                    <span>YouTube</span>
                                                    <ExternalLink size={16} className="external-icon" />
                                                </a>
                                            )}
                                        </div>
                                    </section>
                                </>
                            )}

                            {activeTab === 'episodes' && (
                                <section className="profile-section">
                                    <h2 className="section-title">
                                        <Headphones size={20} />
                                        Past Episodes
                                    </h2>
                                    <div className="episodes-grid">
                                        {pastEpisodes.map(episode => (
                                            <div key={episode.id} className="episode-card">
                                                <div className="episode-thumbnail">
                                                    <img src={episode.thumbnail} alt={episode.title} />
                                                    <button className="play-btn">
                                                        <Play size={24} fill="currentColor" />
                                                    </button>
                                                </div>
                                                <div className="episode-info">
                                                    <h3>{episode.title}</h3>
                                                    <p className="episode-podcast">{episode.podcast}</p>
                                                    <div className="episode-meta">
                                                        <span><Clock size={14} /> {episode.duration}</span>
                                                        <span><Headphones size={14} /> {episode.plays}</span>
                                                        <span>{new Date(episode.date).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {activeTab === 'reviews' && (
                                <section className="profile-section">
                                    <h2 className="section-title">
                                        <Star size={20} />
                                        Reviews & Testimonials
                                    </h2>
                                    <div className="reviews-list">
                                        {testimonials.map(review => (
                                            <div key={review.id} className="review-card">
                                                <div className="review-header">
                                                    <img src={review.avatar} alt={review.author} className="review-avatar" />
                                                    <div className="review-author-info">
                                                        <h4>{review.author}</h4>
                                                        <p>{review.role}</p>
                                                    </div>
                                                    <div className="review-rating">
                                                        {[...Array(review.rating)].map((_, i) => (
                                                            <Star key={i} size={16} fill="currentColor" />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="review-text">{review.text}</p>
                                                <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {activeTab === 'analytics' && (
                                <section className="profile-section">
                                    <h2 className="section-title">
                                        <BarChart3 size={20} />
                                        Performance Analytics
                                    </h2>
                                    <div className="analytics-grid">
                                        <div className="analytics-card">
                                            <div className="analytics-icon">
                                                <Headphones size={24} />
                                            </div>
                                            <h3>{stats.totalEpisodes}</h3>
                                            <p>Total Episodes</p>
                                            <span className="analytics-trend positive">
                                                <TrendingUp size={14} /> +12% this month
                                            </span>
                                        </div>
                                        <div className="analytics-card">
                                            <div className="analytics-icon">
                                                <Clock size={24} />
                                            </div>
                                            <h3>{stats.totalHours}h</h3>
                                            <p>Total Recording Time</p>
                                            <span className="analytics-trend positive">
                                                <TrendingUp size={14} /> +8% this month
                                            </span>
                                        </div>
                                        <div className="analytics-card">
                                            <div className="analytics-icon">
                                                <Star size={24} />
                                            </div>
                                            <h3>{stats.avgRating}</h3>
                                            <p>Average Rating</p>
                                            <span className="analytics-trend positive">
                                                <TrendingUp size={14} /> +0.2 this month
                                            </span>
                                        </div>
                                        <div className="analytics-card">
                                            <div className="analytics-icon">
                                                <Users size={24} />
                                            </div>
                                            <h3>{stats.followers}</h3>
                                            <p>Followers</p>
                                            <span className="analytics-trend positive">
                                                <TrendingUp size={14} /> +156 this month
                                            </span>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="profile-sidebar">
                            {/* Quick Stats */}
                            <div className="sidebar-card">
                                <h3 className="sidebar-title">Quick Stats</h3>
                                <div className="quick-stats">
                                    <div className="quick-stat">
                                        <span className="stat-label">Episodes</span>
                                        <span className="stat-value">{stats.totalEpisodes}</span>
                                    </div>
                                    <div className="quick-stat">
                                        <span className="stat-label">Hours</span>
                                        <span className="stat-value">{stats.totalHours}</span>
                                    </div>
                                    <div className="quick-stat">
                                        <span className="stat-label">Rating</span>
                                        <span className="stat-value">{stats.avgRating} ⭐</span>
                                    </div>
                                    <div className="quick-stat">
                                        <span className="stat-label">Reviews</span>
                                        <span className="stat-value">{stats.totalReviews}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Availability */}
                            <div className="sidebar-card">
                                <h3 className="sidebar-title">Availability</h3>
                                <div className="availability-status">
                                    <div className={`status-indicator ${formData.availability.toLowerCase()}`}>
                                        <div className="status-dot"></div>
                                        <span>{formData.availability}</span>
                                    </div>
                                    <p className="availability-text">
                                        {formData.availability === 'Available'
                                            ? 'Open for new bookings'
                                            : 'Currently not accepting bookings'}
                                    </p>
                                    <button className="btn btn-primary btn-sm">
                                        <Calendar size={16} />
                                        View Calendar
                                    </button>
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="sidebar-card">
                                <h3 className="sidebar-title">Get in Touch</h3>
                                <button className="btn btn-primary btn-block">
                                    <MessageSquare size={18} />
                                    Send Message
                                </button>
                                <button className="btn btn-secondary btn-block">
                                    <Calendar size={18} />
                                    Book a Session
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
