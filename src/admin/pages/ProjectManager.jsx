import { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, Loader2, Edit } from 'lucide-react';
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
        aboutProject: '',
        date: '',
        client: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [brandingImagesFiles, setBrandingImagesFiles] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

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
        data.append('aboutProject', formData.aboutProject);
        data.append('date', formData.date);
        data.append('client', formData.client);

        if (imageFile) {
            data.append('image', imageFile);
        }

        if (brandingImagesFiles && brandingImagesFiles.length > 0) {
            Array.from(brandingImagesFiles).forEach(file => {
                data.append('brandingImages', file);
            });
        }

        try {
            if (editingId) {
                const res = await api.put(`/gallery/${editingId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setProjects(projects.map(p => p._id === editingId ? res.data.data : p));
            } else {
                const res = await api.post('/gallery', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setProjects([res.data.data, ...projects]);
            }

            setIsAdding(false);
            setEditingId(null);
            setFormData({ title: '', category: 'Branding', description: '', aboutProject: '', date: '', client: '' });
            setImageFile(null);
            setBrandingImagesFiles([]);
        } catch (error) {
            console.error('Failed to save project', error);
            alert('Failed to save project');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleEdit = (p) => {
        setFormData({
            title: p.title || '',
            category: p.category || 'Branding',
            description: p.description || '',
            aboutProject: p.aboutProject || '',
            date: p.date || '',
            client: p.client || ''
        });
        setEditingId(p._id);
        setIsAdding(true);
        setImageFile(null);
        setBrandingImagesFiles([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <div style={{ color: '#fff' }}><Loader2 className="animate-spin" /> Loading projects...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: '#fff', fontFamily: 'Oswald', margin: 0 }}>Projects</h2>
                <button
                    onClick={() => {
                        if (isAdding) {
                            setIsAdding(false);
                            setEditingId(null);
                            setFormData({ title: '', category: 'Branding', description: '', aboutProject: '', date: '', client: '' });
                        } else {
                            setIsAdding(true);
                        }
                    }}
                    className="submit-btn"
                    style={{ width: 'auto', padding: '10px 20px', margin: 0 }}
                >
                    {isAdding ? 'Cancel' : <><Plus size={18} /> Add Project</>}
                </button>
            </div>

            {isAdding && (
                <div style={{ background: '#151f19', padding: '25px', borderRadius: '8px', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 style={{ color: '#fff', marginBottom: '20px' }}>{editingId ? 'Edit Project' : 'New Project'}</h3>
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
                            <input
                                type="text"
                                placeholder="Client Name"
                                value={formData.client}
                                onChange={e => setFormData({ ...formData, client: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Project Date (e.g. October 2023)"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                placeholder="Short Description"
                                rows="3"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <textarea
                                placeholder="About the Project (Detailed)"
                                rows="5"
                                value={formData.aboutProject}
                                onChange={e => setFormData({ ...formData, aboutProject: e.target.value })}
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>
                                Cover Image (Thumbnail) {editingId && <span style={{ fontSize: '0.8rem', color: '#888' }}>(Leave blank to keep existing)</span>}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setImageFile(e.target.files[0])}
                                required={!editingId}
                                style={{ color: '#fff' }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>Branding Images (Multiple)</label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={e => setBrandingImagesFiles(e.target.files)}
                                style={{ color: '#fff' }}
                            />
                        </div>
                        <button type="submit" className="submit-btn" disabled={submitLoading}>
                            {submitLoading ? <Loader2 className="animate-spin" /> : (editingId ? 'Update Project' : 'Create Project')}
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
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => handleEdit(p)}
                                        style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7 }}
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p._id)}
                                        style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectManager;
