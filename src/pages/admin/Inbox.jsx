import { useState, useEffect } from 'react';
import { Mail, MessageSquare, Trash2, Loader2, Eye, X } from 'lucide-react';
import api from '../../api/config';

const Inbox = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMsg, setSelectedMsg] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await api.get('/contact');
            setMessages(res.data.data);
        } catch (error) {
            console.error('Error fetching messages');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this message?')) return;
        try {
            await api.delete(`/contact/${id}`);
            fetchMessages();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    if (loading) return <Loader2 className="animate-spin" />;

    return (
        <div className="admin-page">
            <header className="admin-page-header">
                <div>
                    <h2>Communication Hub</h2>
                </div>
            </header>

            <div className="inbox-container">
                {messages.length === 0 ? (
                    <div className="empty-inbox card">
                        <MessageSquare size={48} />
                        <h3>Your inbox is clear</h3>
                        <p>When clients reach out, their messages will appear here.</p>
                    </div>
                ) : (
                    <div className="messages-grid">
                        {messages.map(msg => (
                            <div key={msg._id} className="message-strip card">
                                <div className="msg-status-indicator"></div>
                                <div className="msg-main-info">
                                    <div className="sender-avatar">
                                        {msg.name.charAt(0)}
                                    </div>
                                    <div className="sender-details">
                                        <h4>{msg.name}</h4>
                                        <span>{msg.email}</span>
                                    </div>
                                </div>
                                <div className="msg-excerpt">
                                    <strong>{msg.subject || 'New Inquiry'}</strong>
                                    <p>{msg.message.substring(0, 80)}...</p>
                                </div>
                                <div className="msg-strip-actions">
                                    <button onClick={() => setSelectedMsg(msg)} className="action-btn view">
                                        <Eye size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(msg._id)} className="action-btn delete">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedMsg && (
                <div className="modal-overlay">
                    <div className="modal-window card glass-panel">
                        <header className="modal-header">
                            <div className="sender-profile">
                                <div className="large-avatar">{selectedMsg.name.charAt(0)}</div>
                                <div>
                                    <h3>{selectedMsg.name}</h3>
                                    <p>{selectedMsg.email}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedMsg(null)} className="close-btn"><X size={24} /></button>
                        </header>

                        <div className="modal-body">
                            <div className="msg-subject-line">
                                <span>Subject:</span>
                                <h4>{selectedMsg.subject || 'Incoming Transmission'}</h4>
                            </div>
                            <div className="msg-content-box">
                                {selectedMsg.message}
                            </div>
                        </div>

                        <footer className="modal-footer">
                            <a href={`mailto:${selectedMsg.email}`} className="btn-primary">
                                <Mail size={18} /> Reply via Email
                            </a>
                        </footer>
                    </div>
                </div>
            )}

            <style>{`
                .inbox-count { background: var(--hover); color: var(--primary); padding: 8px 16px; border-radius: 50px; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 8px; }
                
                .empty-inbox { text-align: center; padding: 100px 20px; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; gap: 15px; }
                .empty-inbox h3 { color: #fff; margin: 0; }
                
                .messages-grid { display: flex; flex-direction: column; gap: 16px; }
                .message-strip { display: flex; align-items: center; padding: 15px 25px; gap: 30px; position: relative; overflow: hidden; transition: transform 0.2s; }
                .message-strip:hover { transform: translateX(10px); background: rgba(255,255,255,0.02); }
                
                .msg-status-indicator { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--primary); }
                
                .msg-main-info { display: flex; align-items: center; gap: 15px; min-width: 250px; }
                .sender-avatar { width: 40px; height: 40px; background: var(--hover); color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; }
                .sender-details h4 { margin: 0; font-size: 1rem; }
                .sender-details span { font-size: 0.8rem; color: var(--text-muted); }
                
                .msg-excerpt { flex: 1; }
                .msg-excerpt strong { display: block; font-size: 0.9rem; margin-bottom: 4px; color: #fff; }
                .msg-excerpt p { margin: 0; font-size: 0.85rem; color: var(--text-muted); }
                
                .msg-strip-actions { display: flex; gap: 12px; }
                .action-btn { background: transparent; border: none; cursor: pointer; width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
                .action-btn.view { color: var(--primary); background: var(--hover); }
                .action-btn.delete { color: #f87171; background: rgba(248, 113, 113, 0.1); }

                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
                .modal-window { max-width: 700px; width: 100%; border-radius: 30px; position: relative; display: flex; flex-direction: column; max-height: 90vh; }
                
                .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 30px; border-bottom: 1px solid var(--border); }
                .sender-profile { display: flex; align-items: center; gap: 20px; }
                .large-avatar { width: 60px; height: 60px; background: var(--primary); color: var(--bg-main); border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 800; }
                .sender-profile h3 { margin: 0; font-size: 1.5rem; }
                .sender-profile p { margin: 5px 0 0 0; color: var(--text-muted); }
                .close-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; }
                
                .modal-body { padding: 30px; overflow-y: auto; }
                .msg-subject-line { margin-bottom: 25px; display: flex; align-items: center; gap: 10px; }
                .msg-subject-line span { color: var(--text-muted); font-size: 0.9rem; }
                .msg-subject-line h4 { margin: 0; font-size: 1.1rem; color: var(--primary); }
                .msg-content-box { line-height: 1.8; color: #cbd5e1; font-size: 1.1rem; white-space: pre-wrap; background: rgba(255,255,255,0.02); padding: 25px; border-radius: 20px; border: 1px solid var(--border); }
                
                .modal-footer { padding: 30px; border-top: 1px solid var(--border); display: flex; justify-content: center; }
            `}</style>
        </div>
    );
};

export default Inbox;
