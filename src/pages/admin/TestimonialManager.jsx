import { useState, useEffect } from 'react';
import { Trash2, Quote, Loader2, CheckCircle2, User, XCircle } from 'lucide-react';
import api from '../../api/config';

const TestimonialManager = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const res = await api.get('/testimonial?all=true');
            // Sort to show pending ones first usually, or latest first.
            const sortedData = (res.data.data || []).sort((a, b) => {
                if (a.approved === b.approved) return new Date(b.createdAt) - new Date(a.createdAt);
                return a.approved ? 1 : -1;
            });
            setTestimonials(sortedData);
        } catch (error) {
            console.error('Error fetching testimonials', error);
            setTestimonials([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this review?')) return;
        try {
            await api.delete(`/testimonial/${id}`);
            fetchTestimonials();
        } catch (error) {
            alert('Error deleting review');
        }
    };

    const toggleApproval = async (id, currentStatus) => {
        try {
            await api.put(`/testimonial/${id}`, { approved: !currentStatus });
            fetchTestimonials();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    if (loading) return (
        <div className="admin-loader-container">
            <Loader2 className="animate-spin" size={40} />
        </div>
    );

    const pendingCount = testimonials.filter(t => !t.approved).length;

    return (
        <div className="admin-page">
            <header className="admin-page-header">
                <div>
                    <h2>Review Moderation</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '5px' }}>
                        {pendingCount > 0 ? `You have ${pendingCount} pending reviews requiring attention.` : 'All reviews have been processed.'}
                    </p>
                </div>
            </header>

            <div className="grid-responsive-layout moderation-grid">
                {testimonials.length === 0 ? (
                    <div className="empty-state-card card">
                        <Quote size={40} opacity={0.2} />
                        <p>No reviews have been submitted yet.</p>
                    </div>
                ) : (
                    testimonials.map(t => (
                        <div key={t._id} className={`card testimonial-preview-card ${!t.approved ? 'pending-review-card' : ''}`}>
                            <div className="preview-header">
                                <div className="preview-user">
                                    <div className="user-avatar-placeholder">
                                        <User size={24} color="#000" />
                                    </div>
                                    <div className="user-meta">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <h4>{t.name}</h4>
                                            {!t.approved && <span className="pending-badge">Action Required</span>}
                                        </div>
                                        <span>{t.role}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="preview-body">
                                <Quote size={20} className="quote-icon-bg" />
                                <p>"{t.content}"</p>
                            </div>

                            <div className="moderation-actions">
                                {t.approved ? (
                                    <>
                                        <div className="status-label approved-label">
                                            <CheckCircle2 size={16} /> Live on Site
                                        </div>
                                        <div className="action-buttons-group">
                                            <button onClick={() => toggleApproval(t._id, t.approved)} className="btn-hide">
                                                <XCircle size={16} /> Hide
                                            </button>
                                            <button onClick={() => handleDelete(t._id)} className="btn-delete-icon">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => toggleApproval(t._id, t.approved)} className="btn-approve full-btn">
                                            <CheckCircle2 size={18} /> Approve & Publish
                                        </button>
                                        <button onClick={() => handleDelete(t._id)} className="btn-reject full-btn">
                                            <Trash2 size={18} /> Reject & Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .admin-loader-container { height: 60vh; display: flex; align-items: center; justify-content: center; color: var(--primary); }
                
                .moderation-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 30px; margin-top: 30px; align-items: stretch; }
                
                .testimonial-preview-card { padding: 40px 35px; position: relative; border-radius: 24px; display: flex; flex-direction: column; transition: transform 0.3s; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); }
                .testimonial-preview-card:hover { transform: translateY(-5px); }
                
                .pending-review-card { border-color: rgba(251, 191, 36, 0.4); background: rgba(251, 191, 36, 0.02); box-shadow: 0 0 30px rgba(251, 191, 36, 0.05); }

                .preview-header { margin-bottom: 30px; }
                .preview-user { display: flex; align-items: center; gap: 15px; }
                
                .user-avatar-placeholder { width: 48px; height: 48px; border-radius: 14px; background: var(--primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 5px 15px rgba(251, 191, 36, 0.2); }
                
                .user-meta h4 { margin: 0; font-size: 1.1rem; color: #fff; font-family: 'Outfit'; }
                .user-meta span { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
                
                .pending-badge { background: rgba(251, 191, 36, 0.15); color: var(--primary); font-size: 0.65rem; padding: 4px 10px; border-radius: 50px; font-weight: 800; border: 1px solid rgba(251, 191, 36, 0.3); }

                .preview-body { position: relative; flex-grow: 1; margin-bottom: 30px; }
                .quote-icon-bg { position: absolute; top: -5px; left: -10px; opacity: 0.1; color: var(--primary); transform: scale(2); z-index: 0; }
                .preview-body p { color: rgba(255,255,255,0.85); font-style: italic; line-height: 1.8; font-size: 1.05rem; margin: 0; position: relative; z-index: 1; }

                .moderation-actions { display: flex; align-items: center; justify-content: space-between; gap: 15px; padding-top: 25px; border-top: 1px solid rgba(255,255,255,0.05); }

                .full-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; cursor: pointer; transition: all 0.2s; border: none; }
                
                .btn-approve { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
                .btn-approve:hover { background: #10b981; color: #000; }
                
                .btn-reject { background: rgba(239, 68, 68, 0.05); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.1); }
                .btn-reject:hover { background: #ef4444; color: #fff; }

                .status-label { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; }
                .approved-label { color: #10b981; }

                .action-buttons-group { display: flex; align-items: center; gap: 10px; }
                
                .btn-hide { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 8px; display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .btn-hide:hover { background: rgba(255,255,255,0.1); }
                
                .btn-delete-icon { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: none; width: 35px; height: 35px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
                .btn-delete-icon:hover { background: #ef4444; color: #fff; }

                .empty-state-card { grid-column: 1 / -1; height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; color: var(--text-muted); border: 2px dashed var(--border); background: transparent; }
                
                @media (max-width: 768px) {
                    .moderation-grid { grid-template-columns: 1fr; }
                    .testimonial-preview-card { padding: 30px 25px; }
                }
            `}</style>
        </div>
    );
};

export default TestimonialManager;
