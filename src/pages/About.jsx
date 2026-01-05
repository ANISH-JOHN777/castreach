import { Link } from 'react-router-dom';
import {
    Mic,
    Users,
    Target,
    Heart,
    Zap,
    Shield,
    TrendingUp,
    Award,
    Globe,
    ArrowRight
} from 'lucide-react';
import './About.css';

const About = () => {
    const values = [
        {
            icon: <Heart size={32} />,
            title: 'Community First',
            description: 'We believe in building a supportive community where podcasters help each other grow.',
        },
        {
            icon: <Shield size={32} />,
            title: 'Trust & Safety',
            description: 'Verified profiles, secure payments, and transparent reviews ensure peace of mind.',
        },
        {
            icon: <Zap size={32} />,
            title: 'Innovation',
            description: 'Constantly improving our platform with cutting-edge features and tools.',
        },
        {
            icon: <Globe size={32} />,
            title: 'Global Reach',
            description: 'Connecting podcasters from around the world to create diverse, engaging content.',
        },
    ];

    const stats = [
        { number: '10,000+', label: 'Active Users' },
        { number: '50,000+', label: 'Episodes Recorded' },
        { number: '150+', label: 'Countries' },
        { number: '4.9/5', label: 'Average Rating' },
    ];

    const team = [
        {
            name: 'Sarah Johnson',
            role: 'CEO & Founder',
            bio: 'Former podcast host with 10+ years of experience in media and technology.',
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366f1&color=fff',
        },
        {
            name: 'Michael Chen',
            role: 'CTO',
            bio: 'Tech veteran passionate about building platforms that connect people.',
            avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=8b5cf6&color=fff',
        },
        {
            name: 'Emily Rodriguez',
            role: 'Head of Community',
            bio: 'Dedicated to creating a welcoming environment for all podcasters.',
            avatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=ec4899&color=fff',
        },
    ];

    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <div className="about-hero-content">
                        <h1 className="about-hero-title">
                            Empowering Podcasters <span className="gradient-text">Worldwide</span>
                        </h1>
                        <p className="about-hero-description">
                            CastReach is on a mission to make podcast collaboration seamless, accessible,
                            and rewarding for hosts, guests, and organizers everywhere.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="about-mission">
                <div className="container">
                    <div className="mission-content">
                        <div className="mission-icon">
                            <Target size={64} />
                        </div>
                        <h2 className="section-title">Our Mission</h2>
                        <p className="mission-text">
                            We're building the world's largest marketplace for podcast collaborations.
                            Our platform connects talented guests with engaging hosts, making it easier
                            than ever to create compelling content that resonates with audiences globally.
                        </p>
                        <p className="mission-text">
                            Whether you're a seasoned podcast host looking for expert guests, a thought
                            leader wanting to share your insights, or an organizer managing multiple shows,
                            CastReach provides the tools and community you need to succeed.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="about-stats">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card">
                                <div className="stat-number">{stat.number}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="about-values">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Our Values</h2>
                        <p className="section-subtitle">
                            The principles that guide everything we do
                        </p>
                    </div>
                    <div className="values-grid">
                        {values.map((value, index) => (
                            <div key={index} className="value-card">
                                <div className="value-icon">{value.icon}</div>
                                <h3 className="value-title">{value.title}</h3>
                                <p className="value-description">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="about-team">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Meet the Team</h2>
                        <p className="section-subtitle">
                            Passionate people building the future of podcasting
                        </p>
                    </div>
                    <div className="team-grid">
                        {team.map((member, index) => (
                            <div key={index} className="team-card">
                                <img src={member.avatar} alt={member.name} className="team-avatar" />
                                <h3 className="team-name">{member.name}</h3>
                                <p className="team-role">{member.role}</p>
                                <p className="team-bio">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about-cta">
                <div className="container">
                    <div className="cta-content">
                        <Award size={48} className="cta-icon" />
                        <h2 className="cta-title">Ready to Join Our Community?</h2>
                        <p className="cta-description">
                            Start connecting with amazing podcasters today
                        </p>
                        <div className="cta-actions">
                            <Link to="/signup" className="btn btn-primary btn-lg">
                                Get Started
                                <ArrowRight size={20} />
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

export default About;
