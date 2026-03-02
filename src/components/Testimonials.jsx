import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import api from '../api/config';
import './Testimonials.css';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await api.get('/testimonial'); // Fetches approved only by default
                setTestimonials(res.data.data);
            } catch (error) {
                console.error('Failed to load testimonials', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    if (loading || testimonials.length === 0) return null;

    // Duplicate testimonials to create an infinite smooth scroll effect
    const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

    return (
        <section className="testimonials-section" id="testimonials">
            <div className="container" style={{ textAlign: "center", marginBottom: "60px" }}>
                <span className="section-badge">Client Stories</span>
                <h2 className="section-title">What They <span>Say</span></h2>
            </div>

            <div className="testi-marquee-container">
                <div className="testi-marquee-track">
                    {extendedTestimonials.map((t, index) => (
                        <div key={`${t._id}-${index}`} className="testimonial-card-premium">
                            <Quote className="quote-premium" size={36} />
                            <p className="testimonial-text-premium">"{t.content}"</p>
                            <div className="testimonial-footer-premium">
                                <div className="testi-avatar-placeholder">
                                    {t.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="testi-info-premium">
                                    <h4>{t.name}</h4>
                                    <p>{t.role || 'Creative Partner'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
