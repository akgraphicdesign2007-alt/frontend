import { useState, useEffect } from 'react';
import { Trash2, User, Loader2, Shield, AlertTriangle } from 'lucide-react';
import api from '../../api/config';
import '../../components/Contact.css'; // Re-use styles

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/auth/users');
            setUsers(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to load users');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await api.delete(`/auth/users/${id}`);
                setUsers(users.filter(user => user._id !== id));
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.message || 'Failed to delete user');
            }
        }
    };

    if (loading) return <div style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}><Loader2 className="animate-spin" /> Loading users...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: '#fff', fontFamily: 'Oswald', margin: 0 }}>User Management</h2>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem', color: '#ccc' }}>
                    Total Users: {users.length}
                </div>
            </div>

            <div style={{ background: '#151f19', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '15px 20px', textAlign: 'left', fontWeight: '500', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>User</th>
                            <th style={{ padding: '15px 20px', textAlign: 'left', fontWeight: '500', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Role</th>
                            <th style={{ padding: '15px 20px', textAlign: 'left', fontWeight: '500', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Joined</th>
                            <th style={{ padding: '15px 20px', textAlign: 'right', fontWeight: '500', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '35px',
                                        height: '35px',
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#ccc'
                                    }}>
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '500' }}>{user.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{user.email}</div>
                                    </div>
                                </td>
                                <td style={{ padding: '15px 20px' }}>
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        padding: '4px 10px',
                                        borderRadius: '4px',
                                        background: user.role === 'admin' ? 'rgba(230, 234, 26, 0.15)' : 'rgba(255,255,255,0.05)',
                                        color: user.role === 'admin' ? '#E6EA1A' : '#ccc',
                                        fontSize: '0.8rem',
                                        fontWeight: '500'
                                    }}>
                                        {user.role === 'admin' && <Shield size={12} />}
                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </span>
                                </td>
                                <td style={{ padding: '15px 20px', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#ff4d4d',
                                            cursor: 'pointer',
                                            padding: '8px',
                                            borderRadius: '4px',
                                            opacity: 0.7,
                                            transition: 'all 0.2s'
                                        }}
                                        title="Delete User"
                                        onMouseOver={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = 'rgba(255,77,77,0.1)'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.opacity = '0.7'; e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                        <div style={{ marginBottom: '10px' }}><AlertTriangle size={30} /></div>
                        No users found
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManager;
