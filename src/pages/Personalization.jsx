import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import './Personalization.css';

const TOPICS = [
    'Technology', 'Business', 'Marketing', 'Health & Wellness', 'Finance',
    'Education', 'Entertainment', 'Sports', 'Science', 'Politics',
    'Arts & Culture', 'Travel', 'Food & Cooking', 'Fashion', 'Gaming',
    'Music', 'Film & TV', 'Books & Literature', 'Personal Development',
    'Entrepreneurship', 'Investing', 'Real Estate', 'Cryptocurrency',
    'AI & Machine Learning', 'Web Development', 'Mobile Apps', 'Design',
    'Photography', 'Fitness', 'Mental Health', 'Parenting', 'Relationships',
    'Comedy', 'News & Current Events', 'History', 'Philosophy', 'Spirituality',
    'Environment', 'Social Issues', 'True Crime', 'Mystery', 'Self-Help'
];

const Personalization = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedTopics, setSelectedTopics] = useState(user?.interests || []);
    const [selectedExpertise, setSelectedExpertise] = useState(user?.expertise || []);

    const toggleTopic = (topic) => {
        setSelectedTopics(prev =>
            prev.includes(topic)
                ? prev.filter(t => t !== topic)
                : [...prev, topic]
        );
    };

    const toggleExpertise = (topic) => {
        setSelectedExpertise(prev =>
            prev.includes(topic)
                ? prev.filter(t => t !== topic)
                : [...prev, topic]
        );
    };

    const handleNext = () => {
        if (step === 1 && selectedTopics.length === 0) {
            toast?.error('Please select at least one topic of interest');
            return;
        }
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleComplete = async () => {
        if (selectedExpertise.length === 0) {
            toast?.error('Please select at least one area of expertise');
            return;
        }

        setLoading(true);
        try {
            await updateProfile({
                interests: selectedTopics,
                expertise: selectedExpertise,
                onboardingCompleted: true,
            });

            toast?.success('Personalization complete! 🎉');

            // Navigate based on role
            if (user.role === 'host') {
                navigate('/host/dashboard');
            } else {
                navigate('/guest/dashboard');
            }
        } catch (error) {
            console.error('Error saving personalization:', error);
            toast?.error('Failed to save preferences');
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        if (user.role === 'host') {
            navigate('/host/dashboard');
        } else {
            navigate('/guest/dashboard');
        }
    };

    return (
        <div className="personalization-page">
            <div className="container">
                <div className="personalization-container">
                    {/* Header */}
                    <div className="personalization-header">
                        <div className="sparkle-icon">
                            <Sparkles size={40} />
                        </div>
                        <h1 className="personalization-title">
                            {step === 1 ? 'What topics interest you?' : 'What are you an expert in?'}
                        </h1>
                        <p className="personalization-subtitle">
                            {step === 1
                                ? 'Select topics you\'d like to discuss or hear about in podcasts'
                                : 'Choose areas where you can provide valuable insights'}
                        </p>
                        <div className="progress-indicator">
                            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
                            <div className="progress-line"></div>
                            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
                        </div>
                    </div>

                    {/* Step 1: Interests */}
                    {step === 1 && (
                        <div className="topics-section">
                            <div className="selected-count">
                                {selectedTopics.length} topic{selectedTopics.length !== 1 ? 's' : ''} selected
                            </div>
                            <div className="topics-grid">
                                {TOPICS.map(topic => (
                                    <button
                                        key={topic}
                                        className={`topic-chip ${selectedTopics.includes(topic) ? 'selected' : ''}`}
                                        onClick={() => toggleTopic(topic)}
                                    >
                                        {selectedTopics.includes(topic) && (
                                            <Check size={16} className="check-icon" />
                                        )}
                                        {topic}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Expertise */}
                    {step === 2 && (
                        <div className="topics-section">
                            <div className="selected-count">
                                {selectedExpertise.length} area{selectedExpertise.length !== 1 ? 's' : ''} selected
                            </div>
                            <div className="topics-grid">
                                {TOPICS.map(topic => (
                                    <button
                                        key={topic}
                                        className={`topic-chip ${selectedExpertise.includes(topic) ? 'selected' : ''}`}
                                        onClick={() => toggleExpertise(topic)}
                                    >
                                        {selectedExpertise.includes(topic) && (
                                            <Check size={16} className="check-icon" />
                                        )}
                                        {topic}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="personalization-actions">
                        <button
                            className="btn btn-text"
                            onClick={handleSkip}
                            disabled={loading}
                        >
                            Skip for now
                        </button>
                        <div className="action-buttons">
                            {step === 2 && (
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleBack}
                                    disabled={loading}
                                >
                                    Back
                                </button>
                            )}
                            {step === 1 ? (
                                <button
                                    className="btn btn-primary"
                                    onClick={handleNext}
                                    disabled={selectedTopics.length === 0}
                                >
                                    Next
                                    <ArrowRight size={18} />
                                </button>
                            ) : (
                                <button
                                    className="btn btn-primary"
                                    onClick={handleComplete}
                                    disabled={loading || selectedExpertise.length === 0}
                                >
                                    {loading ? 'Saving...' : 'Complete'}
                                    <Check size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Personalization;
