import { useState, useEffect } from 'react';
import { UserPlus, ShieldCheck, Mail, Loader2, Trash2, Fingerprint, Activity, UserCog } from 'lucide-react';
import api from '../../api/config';

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [inviting, setInviting] = useState(false);
    const [inviteData, setInviteData] = useState({ name: '', email: '', password: '', role: 'admin' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/auth/users');
            setUsers(res.data.data);
        } catch (error) {
            console.error('Error fetching users');
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        setInviting(true);
        try {
            await api.post('/auth/invite', {
                name: inviteData.name,
                email: inviteData.email,
                role: inviteData.role
            });
            alert('Invitation email sent successfully');
            setInviteData({ name: '', email: '', password: '', role: 'admin' });
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to send invitation');
        } finally {
            setInviting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Temporarily revoke access for this user?')) return;
        try {
            await api.delete(`/auth/users/${id}`);
            fetchUsers();
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    if (loading) return (
        <div className="admin-loader-container">
            <Loader2 className="animate-spin" size={40} />
        </div>
    );

    return (
        <div className="admin-page">
            <header className="admin-page-header">
                <div>
                    <h2>Team Access</h2>
                </div>
            </header>

            <div className="user-management-layout">
                <div className="card invite-section-card">
                    <div className="card-header-premium">
                        <UserPlus size={20} />
                        <h3>Provision User</h3>
                    </div>
                    <div className="card-subtitle">Send a secure invitation link via email.</div>
                    <form onSubmit={handleInvite} className="modern-admin-form">
                        <div className="input-field">
                            <label>Recipient Name</label>
                            <div className="input-inner-box">
                                <Fingerprint size={18} />
                                <input type="text" placeholder="Full Name" value={inviteData.name} onChange={e => setInviteData({ ...inviteData, name: e.target.value })} required />
                            </div>
                        </div>
                        <div className="input-field">
                            <label>Recipient Email</label>
                            <div className="input-inner-box">
                                <Mail size={18} />
                                <input type="email" placeholder="email@example.com" value={inviteData.email} onChange={e => setInviteData({ ...inviteData, email: e.target.value })} required />
                            </div>
                        </div>
                        <button type="submit" disabled={inviting} className="btn-primary full-btn-glow">
                            {inviting ? <Loader2 className="animate-spin" /> : <>Send Invitation</>}
                        </button>
                    </form>
                </div>

                <div className="card team-list-card">
                    <div className="card-header-premium">
                        <UserCog size={20} />
                        <h3>Administrative Core</h3>
                    </div>

                    <div className="user-grid-display">
                        {users.map(u => (
                            <div key={u._id} className="user-profile-tile">
                                <div className="user-tile-main">
                                    <div className="profile-initials-box">
                                        {u.name.charAt(0)}
                                    </div>
                                    <div className="user-text-info">
                                        <strong>{u.name}</strong>
                                        <span>{u.email}</span>
                                    </div>
                                </div>
                                <div className="user-tile-actions">
                                    <div className={`status-tag-refined ${u.status || 'active'}`}>{u.status || 'active'}</div>
                                    <div className="role-tag-premium">{u.role}</div>
                                    {u.role !== 'admin' && (
                                        <button onClick={() => handleDelete(u._id)} className="icon-burn-btn">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .status-tag-refined { font-size: 0.65rem; font-weight: 900; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; letter-spacing: 0.5px; }
                .status-tag-refined.active { background: rgba(16, 185, 129, 0.1); color: #10b981; }
                .status-tag-refined.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
                .admin-loader-container { height: 60vh; display: flex; align-items: center; justify-content: center; color: var(--primary); }
                .security-status-badge { background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 8px 16px; border-radius: 50px; font-size: 0.75rem; font-weight: 800; display: flex; align-items: center; gap: 8px; text-transform: uppercase; }
                
                .user-management-layout { display: grid; grid-template-columns: 400px 1fr; gap: 30px; margin-top: 20px; }
                
                .card-header-premium { display: flex; align-items: center; gap: 15px; color: var(--primary); margin-bottom: 5px; }
                .card-header-premium h3 { margin: 0; font-size: 1.2rem; color: #fff; }
                .card-subtitle { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 30px; }

                .input-inner-box { display: flex; align-items: center; gap: 12px; background: rgba(0,0,0,0.25); border: 1px solid var(--border); border-radius: 14px; padding: 0 15px; transition: all 0.3s; }
                .input-inner-box:focus-within { border-color: var(--primary); background: rgba(251, 191, 36, 0.03); }
                .input-inner-box svg { color: var(--text-muted); }
                .input-inner-box input { background: transparent; border: none; padding: 14px 0; color: #fff; width: 100%; outline: none; font-size: 0.95rem; }

                .full-btn-glow { width: 100%; justify-content: center; box-shadow: 0 10px 20px rgba(251, 191, 36, 0.15); margin-top: 10px; }
                
                .user-grid-display { display: flex; flex-direction: column; gap: 12px; }
                .user-profile-tile { background: rgba(255,255,255,0.02); border: 1px solid var(--border); padding: 15px 20px; border-radius: 18px; display: flex; align-items: center; justify-content: space-between; transition: all 0.2s; }
                .user-profile-tile:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); transform: translateX(5px); }
                
                .user-tile-main { display: flex; align-items: center; gap: 15px; }
                .profile-initials-box { width: 45px; height: 45px; background: var(--hover); color: var(--primary); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; border: 1px solid rgba(251, 191, 36, 0.2); }
                
                .user-text-info { display: flex; flex-direction: column; }
                .user-text-info strong { font-size: 1rem; color: #fff; }
                .user-text-info span { font-size: 0.8rem; color: var(--text-muted); }
                
                .user-tile-actions { display: flex; align-items: center; gap: 15px; }
                .role-tag-premium { background: rgba(251, 191, 36, 0.1); color: var(--primary); font-size: 0.7rem; font-weight: 800; text-transform: uppercase; padding: 5px 12px; border-radius: 8px; letter-spacing: 1px; }
                
                .icon-burn-btn { background: rgba(239, 68, 68, 0.1); border: none; color: #ef4444; width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
                .icon-burn-btn:hover { background: #ef4444; color: #fff; transform: scale(1.05); }

                @media (max-width: 900px) { .user-management-layout { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
};

export default UserManager;
