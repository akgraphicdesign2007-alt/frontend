import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Globe, Phone, Mail, Facebook } from 'lucide-react';
import api from '../api/config';
import './Footer.css';

const XIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
    </svg>
);

const TelegramIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
    </svg>
);

const BehanceIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-12h4.5a3 3 0 0 1 0 6a3 3 0 0 1 0 6h-4.5" />
        <path d="M3 12h4.5" />
        <path d="M14 13h7a3.5 3.5 0 0 0 -7 0v2a3.5 3.5 0 0 0 6.64 1" />
        <path d="M16 6h3" />
    </svg>
);

const Footer = () => {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                setSettings(res.data.data);
            } catch (error) {
                console.error('Failed to load footer settings');
            }
        };
        fetchSettings();
    }, []);

    const s = settings || {
        siteName: 'AK Design',
        email: 'hello@akdesigns.space',
        phone: '',
        socialLinks: {
            instagram: 'https://www.instagram.com/akcreative._',
            linkedin: 'https://www.linkedin.com/in/ak-design-9bb1173a1',
            behance: 'https://www.behance.net/akdesign_hub',
            facebook: 'https://www.facebook.com/share/1GUwsErRAH/',
            telegram: 'https://t.me/Akcreativex',
        }
    };

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-brand">
                        <span className="logo-text"> <img src="/logo.png" alt="logo" loading="lazy" /></span>
                        <p className="footer-tagline">Crafting digital experiences that matter.</p>
                    </div>

                    <div className="footer-nav">
                        <h4>Explore</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About Me</Link></li>
                            <li><Link to="/projects">Core Projects</Link></li>
                            <li><Link to="/blog">Design Blog</Link></li>
                        </ul>
                    </div>

                    <div className="footer-nav">
                        <h4>Connect</h4>
                        <ul>
                            <li><Link to="/contact">Get in Touch</Link></li>
                            <li><a href={`mailto:${s.email}`}>{s.email}</a></li>
                            {s.phone && <li><a href={`tel:${s.phone}`}>{s.phone}</a></li>}
                        </ul>
                        <div className="footer-socials">
                            {s.socialLinks?.instagram && <a href={s.socialLinks.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={20} /></a>}
                            {s.socialLinks?.linkedin && <a href={s.socialLinks.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={20} /></a>}
                            {s.socialLinks?.twitter && <a href={s.socialLinks.twitter} target="_blank" rel="noreferrer" aria-label="X"><XIcon size={20} /></a>}
                            {s.socialLinks?.facebook && <a href={s.socialLinks.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={20} /></a>}
                            {s.socialLinks?.telegram && <a href={s.socialLinks.telegram} target="_blank" rel="noreferrer" aria-label="Telegram"><TelegramIcon size={20} /></a>}
                            {s.socialLinks?.behance && <a href={s.socialLinks.behance} target="_blank" rel="noreferrer" aria-label="Behance"><BehanceIcon size={20} /></a>}
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
