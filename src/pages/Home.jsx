import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import {
    Mic,
    Users,
    Calendar,
    MessageCircle,
    Star,
    TrendingUp,
    CheckCircle,
    ArrowRight
} from 'lucide-react';
import './Home.css';

const Home = () => {
    const { isAuthenticated } = useAuth();

    const features = [
        {
            icon: <Users size={32} />,
            title: 'Discover Talent',
            description: 'Find the perfect guests or hosts for your podcast from our curated community.',
        },
        {
            icon: <Calendar size={32} />,
            title: 'Easy Scheduling',
            description: 'Book and schedule podcast recordings with integrated calendar management.',
        },
        {
            icon: <MessageCircle size={32} />,
            title: 'Seamless Communication',
            description: 'Built-in messaging system to coordinate details and prepare for recordings.',
        },
        {
            icon: <Star size={32} />,
            title: 'Reviews & Ratings',
            description: 'Build your reputation with authentic reviews from hosts and guests.',
        },
    ];

    const benefits = [
        'Connect with verified podcast hosts and guests',
        'Streamlined booking and payment process',
        'Professional recording workflow management',
        'Secure escrow payment system',
        'Comprehensive review and rating system',
        'Real-time messaging and collaboration tools',
    ];

    return (
        <div className="home-page">
            <SEO
                title="CastReach - Connect. Record. Grow."
                description="The ultimate platform connecting podcast hosts and guests. Discover talent, book appearances, and create amazing content together."
                keywords="podcast, podcasting, podcast guests, podcast hosts, podcast booking, podcast collaboration, audio content, podcast platform"
            />
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <h1 className="hero-title">
                                Connect. Record. <span className="gradient-text">Grow.</span>
                            </h1>
                            <p className="hero-description">
                                CastReach is the ultimate platform connecting podcast hosts and guests.
                                Discover talent, book appearances, and create amazing content together.
                            </p>
                            <div className="hero-actions">
                                {isAuthenticated ? (
                                    <Link to="/discover" className="btn btn-primary btn-lg">
                                        Discover Now
                                        <ArrowRight size={20} />
                                    </Link>
                                ) : (
                                    <>
                                        <Link to="/signup" className="btn btn-primary btn-lg">
                                            Get Started
                                            <ArrowRight size={20} />
                                        </Link>
                                        <Link to="/login" className="btn btn-outline btn-lg">
                                            Sign In
                                        </Link>
                                    </>
                                )}
                            </div>
                            <div className="hero-stats">
                                <div className="stat">
                                    <div className="stat-number">10K+</div>
                                    <div className="stat-label">Active Users</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-number">50K+</div>
                                    <div className="stat-label">Episodes Recorded</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-number">4.9</div>
                                    <div className="stat-label">Average Rating</div>
                                </div>
                            </div>
                        </div>
                        <div className="hero-image">
                            <img
                                src="/images/hero-banner.png"
                                alt="Professional podcast studio setup"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: '16px',
                                    boxShadow: '0 20px 60px rgba(103, 77, 102, 0.3)'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Why Choose CastReach?</h2>
                        <p className="section-subtitle">
                            Everything you need to manage your podcast collaborations in one place
                        </p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">{feature.icon}</div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits">
                <div className="container">
                    <div className="benefits-content">
                        <div className="benefits-text">
                            <h2 className="section-title">Built for Podcasters, by Podcasters</h2>
                            <p className="section-subtitle">
                                We understand the challenges of podcast production. That's why we've created
                                a platform that handles everything from discovery to payment.
                            </p>
                            <ul className="benefits-list">
                                {benefits.map((benefit, index) => (
                                    <li key={index} className="benefit-item">
                                        <CheckCircle size={20} className="benefit-icon" />
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="benefits-visual">
                            <img
                                src="/images/collaboration.png"
                                alt="Podcast collaboration network"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: '16px'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Grow Your Podcast?</h2>
                        <p className="cta-description">
                            Join thousands of podcasters already using CastReach to create amazing content
                        </p>
                        <div className="cta-actions">
                            <Link to="/signup" className="btn btn-primary btn-lg">
                                Join Now
                            </Link>
                            <Link to="/discover" className="btn btn-outline btn-lg">
                                Explore Talent
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
