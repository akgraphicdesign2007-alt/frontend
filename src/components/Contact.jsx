import { useState } from 'react';
import { Instagram, Linkedin, Dribbble, Mail, Send, Loader2 } from 'lucide-react';
import api from '../api/config'; // Import API config
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
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
                    <h2 className="section-title">Let's Connect</h2>
                    <h3 className="contact-heading">Got a project in mind?</h3>
                    <p className="contact-text">
                        I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
                    </p>

                    <div className="social-links">
                        <a href="#" className="social-link"><Instagram /></a>
                        <a href="#" className="social-link"><Linkedin /></a>
                        <a href="#" className="social-link"><Dribbble /></a>
                        <a href="#" className="social-link"><Mail /></a>
                    </div>
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    {status.error && <p className="error-msg">{status.error}</p>}
                    {status.success && <p className="success-msg">Message sent successfully!</p>}

                    <button type="submit" className="submit-btn" disabled={status.loading}>
                        {status.loading ? (
                            <>Sending... <Loader2 className="animate-spin" size={18} /></>
                        ) : (
                            <>Send Message <Send size={18} /></>
                        )}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Contact;
