import { Link } from 'react-router-dom';
import { Mic, Mail, Twitter, Linkedin, Github } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* Brand Section */}
                    <div className="footer-section">
                        <Link to="/" className="footer-logo">
                            <Mic className="footer-logo-icon" />
                            <span>CastReach</span>
                        </Link>
                        <p className="footer-description">
                            Connecting podcast hosts and guests to create amazing content together.
                        </p>
                        <div className="footer-social">
                            <a href="#" className="social-link" aria-label="Twitter">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="social-link" aria-label="LinkedIn">
                                <Linkedin size={20} />
                            </a>
                            <a href="#" className="social-link" aria-label="GitHub">
                                <Github size={20} />
                            </a>
                            <a href="#" className="social-link" aria-label="Email">
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Platform Links */}
                    <div className="footer-section">
                        <h4 className="footer-title">Platform</h4>
                        <ul className="footer-links">
                            <li><Link to="/discover">Discover</Link></li>
                            <li><Link to="/how-it-works">How It Works</Link></li>
                            <li><Link to="/pricing">Pricing</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                        </ul>
                    </div>

                    {/* For Users */}
                    <div className="footer-section">
                        <h4 className="footer-title">For Users</h4>
                        <ul className="footer-links">
                            <li><Link to="/signup">Join CastReach</Link></li>
                            <li><Link to="/discover">Browse Talent</Link></li>
                            <li><Link to="/help">Help Center</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="footer-section">
                        <h4 className="footer-title">Legal</h4>
                        <ul className="footer-links">
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                            <li><Link to="/cookies">Cookie Policy</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © {currentYear} CastReach. All rights reserved.
                    </p>
                    <p className="footer-tagline">
                        Built with ❤️ for the podcasting community
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
