import { useState, useEffect } from 'react';
import { Instagram, Linkedin, Mail, Send, Loader2, Globe } from 'lucide-react';
import api from '../api/config'; // Import API config
import './Contact.css';

const Contact = () => {
    const [settings, setSettings] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                setSettings(res.data.data);
            } catch (error) {
                console.error('Failed to load contact settings');
            }
        };
        fetchSettings();
    }, []);

    const s = settings || { socialLinks: {} };
    const [status, setStatus] = useState({ loading: false, success: false, error: null });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: null });

        try {
            await api.post('/contact', formData);
            setStatus({ loading: false, success: true, error: null });
            setFormData({ name: '', email: '', message: '' }); // Reset form

            // Allow sending another message after 5 seconds
            setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 5000);
        } catch (err) {
            console.error(err);
            setStatus({
                loading: false,
                success: false,
                error: err.response?.data?.message || 'Something went wrong. Please try again.'
            });
        }
    };

    return (
        <section id="contact" className="contact-section">
            <div className="container contact-container">
                <div className="contact-info">
                    <span className="contact-badge">Available for projects</span>
                    <h2 className="contact-heading">Let's Build Something Great</h2>
                    <p className="contact-text">
                        I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
                    </p>

                    <div className="contact-cards-grid">
                        <div className="contact-card-premium">
                            <div className="card-icon-box"><Mail size={22} /></div>
                            <div className="card-info-text">
                                <h4>Email Me</h4>
                                <p>{s.email || 'hello@akdesigns.space'}</p>
                            </div>
                        </div>

                        {s.phone && (
                            <div className="contact-card-premium">
                                <div className="card-icon-box"><Send size={22} /></div>
                                <div className="card-info-text">
                                    <h4>Call Me</h4>
                                    <p>{s.phone}</p>
                                </div>
                            </div>
                        )}

                        <div className="contact-card-premium">
                            <div className="card-icon-box"><Globe size={22} /></div>
                            <div className="card-info-text">
                                <h4>Location</h4>
                                <p>{s.address || 'India / Remote'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="social-links-footer">
                        {s.socialLinks?.instagram && <a href={s.socialLinks.instagram} target="_blank" rel="noreferrer" className="social-link"><Instagram size={20} /></a>}
                        {s.socialLinks?.linkedin && <a href={s.socialLinks.linkedin} target="_blank" rel="noreferrer" className="social-link"><Linkedin size={20} /></a>}
                        {s.socialLinks?.behance && <a href={s.socialLinks.behance} target="_blank" rel="noreferrer" className="social-link"><Globe size={20} /></a>}
                    </div>
                </div>

                <div className="contact-form-premium">
                    <h3 className="form-premium-title">Send a Message</h3>

                    {status.success && <div className="success-msg-premium">Message sent successfully! I'll get back to you soon.</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="input-premium-group">
                            <label>Professional Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                className="premium-input"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-premium-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="name@company.com"
                                className="premium-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-premium-group">
                            <label>Your Message / Project Brief</label>
                            <textarea
                                name="message"
                                placeholder="Tell me about your project..."
                                rows="5"
                                className="premium-textarea"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        {status.error && <p className="error-msg" style={{ marginBottom: '20px' }}>{status.error}</p>}

                        <button type="submit" className="btn-premium-submit" disabled={status.loading}>
                            {status.loading ? (
                                <>Sending... <Loader2 className="animate-spin" size={18} /></>
                            ) : (
                                <>Initiate Contact <Send size={18} /></>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
