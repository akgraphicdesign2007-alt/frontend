import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import api from '../api/config';
import LoadingScreen from './LoadingScreen';
import './Testimonials.css';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await api.get('/testimonials'); // Fetches approved only by default
                setTestimonials(res.data.data);
            } catch (error) {
                console.error('Failed to load testimonials', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    if (loading) return <LoadingScreen />;
    if (testimonials.length === 0) return null;

    return (
        <section className="testimonials-section">
            <div className="container">
                <h2 className="section-title">Client Words</h2>

                <div className="testimonials-grid">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={t._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="testimonial-card"
                        >
                            <Quote size={40} className="quote-icon" />
                            <p className="testimonial-text">"{t.message}"</p>
                            <div className="testimonial-author">
                                <div>
                                    <h4>{t.name}</h4>
                                    <span>{t.role} {t.company && `at ${t.company}`}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
