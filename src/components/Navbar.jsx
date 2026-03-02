import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import api from '../api/config';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [settings, setSettings] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                setSettings(res.data.data);
            } catch (error) {
                // Settings might not be initialized yet, silence this expected initial load failure
            }
        };
        fetchSettings();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Me', path: '/about' },
        { name: 'Projects', path: '/projects' },
        { name: 'Blog', path: '/blog' },
    ];

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-text"> <img src="/logo.png" alt="logo" /></span>
                </Link>

                {/* Desktop Menu */}
                <div className="desktop-menu">
                    <ul className="nav-links">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link to={link.path} className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <Link to="/contact" className="nav-cta">Work with me</Link>
                </div>

                {/* Mobile Toggle */}
                <div className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </div>

                {/* Mobile Menu */}
                <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
                    <ul className="nav-links-mobile">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link to={link.path} onClick={() => setIsOpen(false)}>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
