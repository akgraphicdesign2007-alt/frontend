import { useState, useEffect } from 'react';
import { Trash2, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../../api/config';

const TestimonialManager = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const res = await api.get('/testimonials?all=true');
            setTestimonials(res.data.data);
        } catch (error) {
            console.error('Failed to load testimonials', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleApprove = async (id, currentStatus) => {
        try {
            const res = await api.put(`/testimonials/${id}`, { approved: !currentStatus });
            setTestimonials(prev => prev.map(t => t._id === id ? res.data.data : t));
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
        try {
            await api.delete(`/testimonials/${id}`);
            setTestimonials(prev => prev.filter(t => t._id !== id));
        } catch (error) {
            console.error('Failed to delete', error);
        }
    };

    if (loading) return <div style={{ color: '#fff' }}><Loader2 className="animate-spin" /> Loading testimonials...</div>;

    return (
        <div>
            <h2 style={{ color: '#fff', fontFamily: 'Oswald', marginBottom: '30px' }}>Testimonial Manager</h2>

            <div style={{ display: 'grid', gap: '15px' }}>
                {testimonials.length === 0 ? (
                    <p style={{ color: 'rgba(255,255,255,0.5)' }}>No testimonials yet.</p>
                ) : (
                    testimonials.map(t => (
                        <div key={t._id} style={{
                            background: '#151f19',
                            padding: '20px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            opacity: t.approved ? 1 : 0.7
                        }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                    <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: 0 }}>{t.name}</h3>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        background: t.approved ? '#28a74520' : '#fcc41920',
                                        color: t.approved ? '#28a745' : '#fcc419'
                                    }}>
                                        {t.approved ? 'Live' : 'Pending'}
                                    </span>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '10px' }}>
                                    {t.role} {t.company && `at ${t.company}`}
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>"{t.message}"</p>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginLeft: '20px' }}>
                                <button
                                    onClick={() => toggleApprove(t._id, t.approved)}
                                    title={t.approved ? "Unpublish" : "Approve"}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: t.approved ? '#fcc419' : '#28a745',
                                        padding: '8px',
                                        borderRadius: '6px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {t.approved ? <XCircle size={20} /> : <CheckCircle size={20} />}
                                </button>
                                <button
                                    onClick={() => handleDelete(t._id)}
                                    title="Delete"
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#ff4d4d',
                                        padding: '8px',
                                        borderRadius: '6px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TestimonialManager;
