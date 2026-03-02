import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquarePlus, X, Check, Loader2, Star, User, Building, Briefcase, MessageSquare } from 'lucide-react';
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
            // Map fields to match backend schema: 'message' -> 'content'
            // Role + Company -> 'role' (since model has one role field)
            const submissionData = {
                name: formData.name,
                role: formData.company ? `${formData.role} at ${formData.company}` : formData.role,
                content: formData.message,
                approved: false // Explicitly set to false (moderation)
            };

            await api.post('/testimonial', submissionData);
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
                                    <div className="review-header-text">
                                        <h2>Leave a Review</h2>
                                        <p>Share your authentic experience working with our creative studio.</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="modern-review-form">
                                        <div className="input-field">
                                            <label>Full Name</label>
                                            <div className="input-inner-box">
                                                <User size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Anand K"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-row-grid">
                                            <div className="input-field">
                                                <label>Company (Optional)</label>
                                                <div className="input-inner-box">
                                                    <Building size={18} />
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. AK Systems"
                                                        value={formData.company}
                                                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="input-field">
                                                <label>Role</label>
                                                <div className="input-inner-box">
                                                    <Briefcase size={18} />
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Founder"
                                                        value={formData.role}
                                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="input-field">
                                            <label>Your Feedback</label>
                                            <div className="input-inner-box textarea-box">
                                                <MessageSquare size={18} style={{ marginTop: '5px' }} />
                                                <textarea
                                                    rows="4"
                                                    placeholder="Tell us about the project outcome and your experience..."
                                                    value={formData.message}
                                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                                    required
                                                ></textarea>
                                            </div>
                                        </div>

                                        <button type="submit" className="btn-primary full-btn-glow" disabled={loading} style={{ marginTop: '10px' }}>
                                            {loading ? <Loader2 className="animate-spin" /> : 'Submit Review For Approval'}
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
