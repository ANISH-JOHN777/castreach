import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { supabase, isSupabaseConfigured } from '../config/supabase';
import { User, Mail, MapPin, DollarSign, Briefcase, FileText, Star, Upload, Globe, Twitter, Linkedin } from 'lucide-react';
import './Profile.css';

const ProfileEdit = () => {
    const { user, updateProfile } = useAuth();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        title: '',
        location: '',
        expertise: [],
        price: 0,
        availability: 'Available',
        website: '',
        twitter: '',
        linkedin: '',
    });
    const [newExpertise, setNewExpertise] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || '',
                title: user.title || '',
                location: user.location || '',
                expertise: user.expertise || [],
                price: user.price || 0,
                availability: user.availability || 'Available',
                website: user.website || '',
                twitter: user.twitter || '',
                linkedin: user.linkedin || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddExpertise = () => {
        if (newExpertise.trim() && !formData.expertise.includes(newExpertise.trim())) {
            setFormData(prev => ({
                ...prev,
                expertise: [...prev.expertise, newExpertise.trim()]
            }));
            setNewExpertise('');
        }
    };

    const handleRemoveExpertise = (item) => {
        setFormData(prev => ({
            ...prev,
            expertise: prev.expertise.filter(e => e !== item)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateProfile({
                name: formData.name,
                bio: formData.bio,
                title: formData.title,
                location: formData.location,
                expertise: formData.expertise,
                price: parseFloat(formData.price) || 0,
                availability: formData.availability,
            });

            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="container">Please log in to edit your profile.</div>;
    }

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-edit-container">
                    <h1 className="profile-title">Edit Profile</h1>
                    <p className="profile-subtitle">Update your information to help others find you</p>

                    <form onSubmit={handleSubmit} className="profile-edit-form">
                        {/* Basic Info */}
                        <div className="form-section">
                            <h2 className="section-title">Basic Information</h2>

                            <div className="form-group">
                                <label className="form-label">
                                    <User size={18} />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <Mail size={18} />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    value={formData.email}
                                    disabled
                                />
                                <small className="form-hint">Email cannot be changed</small>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <Briefcase size={18} />
                                    Professional Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-input"
                                    placeholder="e.g., Tech Entrepreneur, Marketing Expert"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <MapPin size={18} />
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    className="form-input"
                                    placeholder="e.g., New York, USA or Remote"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Professional Info */}
                        <div className="form-section">
                            <h2 className="section-title">Professional Details</h2>

                            <div className="form-group">
                                <label className="form-label">
                                    <FileText size={18} />
                                    Bio
                                </label>
                                <textarea
                                    name="bio"
                                    className="form-textarea"
                                    rows="4"
                                    placeholder="Tell us about yourself, your experience, and what you bring to podcasts..."
                                    value={formData.bio}
                                    onChange={handleChange}
                                />
                                <small className="form-hint">{formData.bio.length}/500 characters</small>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <Star size={18} />
                                    Areas of Expertise
                                </label>
                                <div className="expertise-input">
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Add expertise (e.g., Technology, Marketing)"
                                        value={newExpertise}
                                        onChange={(e) => setNewExpertise(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExpertise())}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleAddExpertise}
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="expertise-tags">
                                    {formData.expertise.map((item, index) => (
                                        <span key={index} className="expertise-tag">
                                            {item}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveExpertise(item)}
                                                className="remove-tag"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {user.role === 'guest' && (
                                <div className="form-group">
                                    <label className="form-label">
                                        <DollarSign size={18} />
                                        Appearance Fee (USD)
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        className="form-input"
                                        min="0"
                                        step="10"
                                        value={formData.price}
                                        onChange={handleChange}
                                    />
                                    <small className="form-hint">Set to 0 for free appearances</small>
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label">
                                    Availability Status
                                </label>
                                <select
                                    name="availability"
                                    className="form-select"
                                    value={formData.availability}
                                    onChange={handleChange}
                                >
                                    <option value="Available">Available</option>
                                    <option value="Limited">Limited Availability</option>
                                    <option value="Unavailable">Currently Unavailable</option>
                                </select>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="form-section">
                            <h2 className="section-title">Social Links</h2>

                            <div className="form-group">
                                <label className="form-label">
                                    <Globe size={18} />
                                    Website
                                </label>
                                <input
                                    type="url"
                                    name="website"
                                    className="form-input"
                                    placeholder="https://yourwebsite.com"
                                    value={formData.website}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <Twitter size={18} />
                                    Twitter / X
                                </label>
                                <input
                                    type="text"
                                    name="twitter"
                                    className="form-input"
                                    placeholder="@yourusername"
                                    value={formData.twitter}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <Linkedin size={18} />
                                    LinkedIn
                                </label>
                                <input
                                    type="text"
                                    name="linkedin"
                                    className="form-input"
                                    placeholder="linkedin.com/in/yourprofile"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileEdit;
