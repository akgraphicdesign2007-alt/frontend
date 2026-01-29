import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Dribbble, Twitter } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-brand">
                        <img src="/logo.png" alt="AK Design Logo" className="footer-logo-img" />
                        <p className="footer-tagline">Crafting digital experiences that matter.</p>
                    </div>

                    <div className="footer-nav">
                        <h4>Explore</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/projects">Projects</Link></li>
                            <li><Link to="/blog">Blog</Link></li>
                        </ul>
                    </div>

                    <div className="footer-nav">
                        <h4>Connect</h4>
                        <ul>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><a href="mailto:hello@akdesign.com">hello@akdesign.com</a></li>
                        </ul>
                        <div className="footer-socials">
                            <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
                            <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
                            <a href="#" aria-label="Dribbble"><Dribbble size={20} /></a>
                            <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} AK Design. All rights reserved.</p>
                    <div className="legal-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
