import { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '../../api/config';
import '../../components/Contact.css'; // Re-use form styles

const ProjectManager = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        category: 'Branding',
        description: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/gallery');
            setProjects(res.data.data || res.data);
        } catch (error) {
            console.error('Failed to load projects', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this project?')) return;
        try {
            await api.delete(`/gallery/${id}`);
            setProjects(prev => prev.filter(p => p._id !== id));
        } catch (error) {
            console.error('Failed to delete', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('description', formData.description);
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            const res = await api.post('/gallery', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProjects([res.data.data, ...projects]);
            setIsAdding(false);
            setFormData({ title: '', category: 'Branding', description: '' });
            setImageFile(null);
        } catch (error) {
            console.error('Failed to create project', error);
            alert('Failed to create project');
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) return <div style={{ color: '#fff' }}><Loader2 className="animate-spin" /> Loading projects...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: '#fff', fontFamily: 'Oswald', margin: 0 }}>Projects</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="submit-btn"
                    style={{ width: 'auto', padding: '10px 20px', margin: 0 }}
                >
                    {isAdding ? 'Cancel' : <><Plus size={18} /> Add Project</>}
                </button>
            </div>

            {isAdding && (
                <div style={{ background: '#151f19', padding: '25px', borderRadius: '8px', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 style={{ color: '#fff', marginBottom: '20px' }}>New Project</h3>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Project Title"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px' }}
                            >
                                <option value="Branding">Branding</option>
                                <option value="UI/UX">UI/UX</option>
                                <option value="Motion">Motion</option>
                                <option value="Posters">Posters</option>
                                <option value="Social Media">Social Media</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <textarea
                                placeholder="Description"
                                rows="3"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>Project Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setImageFile(e.target.files[0])}
                                required
                                style={{ color: '#fff' }}
                            />
                        </div>
                        <button type="submit" className="submit-btn" disabled={submitLoading}>
                            {submitLoading ? <Loader2 className="animate-spin" /> : 'Create Project'}
                        </button>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {projects.map(p => (
                    <div key={p._id} style={{
                        background: '#151f19',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <div style={{ height: '180px', background: p.imageUrl?.startsWith('http') ? `url(${p.imageUrl}) center/cover` : '#222' }}></div>
                        <div style={{ padding: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                                <div>
                                    <h4 style={{ color: '#fff', margin: '0 0 5px 0' }}>{p.title}</h4>
                                    <span style={{ color: 'var(--accent-color)', fontSize: '0.8rem' }}>{p.category}</span>
                                </div>
                                <button
                                    onClick={() => handleDelete(p._id)}
                                    style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectManager;
