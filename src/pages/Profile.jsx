import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, Mail, MapPin, Globe, Edit2, Save } from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: 'Passionate about creating amazing content and connecting with audiences.',
        location: 'San Francisco, CA',
        website: 'https://example.com',
        expertise: ['Technology', 'Business', 'Innovation'],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile(formData);
        setIsEditing(false);
    };

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-container">
                    {/* Profile Header */}
                    <div className="profile-banner">
                        <div className="profile-avatar-large">
                            <img src={user?.avatar} alt={user?.name} />
                            <button className="avatar-edit-btn">
                                <Camera size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="profile-content">
                        <div className="profile-main">
                            <div className="profile-header-section">
                                <div>
                                    <h1 className="profile-name-large">{user?.name}</h1>
                                    <p className="profile-role-badge">{user?.role}</p>
                                </div>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
                                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                                </button>
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleSubmit} className="profile-form">
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Bio</label>
                                        <textarea
                                            className="form-textarea"
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            rows={4}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Location</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Website</label>
                                        <input
                                            type="url"
                                            className="form-input"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        />
                                    </div>
                                </form>
                            ) : (
                                <div className="profile-info">
                                    <p className="profile-bio-text">{formData.bio}</p>

                                    <div className="profile-details">
                                        <div className="detail-item">
                                            <Mail size={18} />
                                            <span>{formData.email}</span>
                                        </div>
                                        <div className="detail-item">
                                            <MapPin size={18} />
                                            <span>{formData.location}</span>
                                        </div>
                                        <div className="detail-item">
                                            <Globe size={18} />
                                            <a href={formData.website} target="_blank" rel="noopener noreferrer">
                                                {formData.website}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="profile-expertise-section">
                                        <h3>Expertise</h3>
                                        <div className="expertise-tags">
                                            {formData.expertise.map((skill, index) => (
                                                <span key={index} className="expertise-tag">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Stats Sidebar */}
                        <div className="profile-sidebar">
                            <div className="stats-card">
                                <h3>Statistics</h3>
                                <div className="stat-row">
                                    <span>Total Bookings</span>
                                    <strong>12</strong>
                                </div>
                                <div className="stat-row">
                                    <span>Completed</span>
                                    <strong>8</strong>
                                </div>
                                <div className="stat-row">
                                    <span>Rating</span>
                                    <strong>4.9 ⭐</strong>
                                </div>
                                <div className="stat-row">
                                    <span>Reviews</span>
                                    <strong>45</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
