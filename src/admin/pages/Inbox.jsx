import { useState, useEffect } from 'react';
import { Mail, Calendar, Loader2 } from 'lucide-react';
import api from '../../api/config';

const Inbox = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await api.get('/contact');
            setMessages(res.data.data);
        } catch (error) {
            console.error('Failed to load messages', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ color: '#fff' }}><Loader2 className="animate-spin" /> Loading messages...</div>;

    return (
        <div>
            <h2 style={{ color: '#fff', fontFamily: 'Oswald', marginBottom: '30px' }}>Inbox</h2>

            <div style={{ display: 'grid', gap: '15px' }}>
                {messages.length === 0 ? (
                    <p style={{ color: 'rgba(255,255,255,0.5)' }}>No messages yet.</p>
                ) : (
                    messages.map(msg => (
                        <div key={msg._id} style={{
                            background: '#151f19',
                            padding: '20px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <h3 style={{ color: '#E6EA1A', fontSize: '1.1rem', margin: 0 }}>{msg.name}</h3>
                                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <Calendar size={14} /> {new Date(msg.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Mail size={14} /> {msg.email}
                            </div>
                            <p style={{ color: '#fff', lineHeight: '1.6', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '6px' }}>
                                {msg.message}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Inbox;
