import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquarePlus, X, Check, Loader2, Star } from 'lucide-react';
import api from '../api/config';
import './ReviewButton.css';
import './Contact.css'; // Re-use input styles

const ReviewButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        role: '',
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/testimonials', formData);
            setSuccess(true);
            setFormData({ name: '', company: '', role: '', message: '' });
            setTimeout(() => {
                setSuccess(false);
                setIsOpen(false);
            }, 3000);
        } catch (error) {
            console.error('Failed to submit review', error);
            alert('Failed to submit review. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="review-btn-container">
                <motion.button
                    initial={{ x: 100 }}
                    animate={{ x: 0 }}
                    whileHover={{ x: -5 }}
                    className="review-trigger-btn"
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setIsOpen(true);
                    }}
                >
                    <Star size={18} fill="#050a07" /> Review Me
                </motion.button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <div className="review-modal-overlay">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="review-modal"
                        >
                            <button className="close-modal-btn" onClick={() => setIsOpen(false)}>
                                <X size={24} />
                            </button>

                            {success ? (
                                <div className="success-message">
                                    <div className="success-icon">
                                        <Check size={30} />
                                    </div>
                                    <h3 style={{ color: '#fff', marginBottom: '10px' }}>Thank You!</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>Your review has been submitted for approval.</p>
                                </div>
                            ) : (
                                <>
                                    <h2 style={{ color: '#fff', fontFamily: 'Oswald', marginBottom: '5px' }}>Leave a Review</h2>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '25px', fontSize: '0.9rem' }}>Share your experience working with us.</p>

                                    <form onSubmit={handleSubmit} className="contact-form">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                placeholder="Your Name"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                            <input
                                                type="text"
                                                placeholder="Company (Optional)"
                                                value={formData.company}
                                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Role"
                                                value={formData.role}
                                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <textarea
                                                rows="4"
                                                placeholder="Your Feedback..."
                                                value={formData.message}
                                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                                required
                                            ></textarea>
                                        </div>
                                        <button type="submit" className="submit-btn" disabled={loading}>
                                            {loading ? <Loader2 className="animate-spin" /> : 'Submit Review'}
                                        </button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ReviewButton;
