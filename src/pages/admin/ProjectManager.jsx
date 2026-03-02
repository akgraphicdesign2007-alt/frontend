import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '../../api/config';

const ProjectManager = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentProject, setCurrentProject] = useState({
        title: '', description: '', category: 'Branding', client: '', date: '', aboutProject: ''
    });
    const [mainImage, setMainImage] = useState(null);
    const [brandingImages, setBrandingImages] = useState([]);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/gallery');
            setProjects(res.data.data);
        } catch (error) {
            console.error('Error fetching projects', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData();
        Object.keys(currentProject).forEach(key => {
            if (currentProject[key] !== null && currentProject[key] !== undefined) {
                formData.append(key, currentProject[key]);
            }
        });
        if (mainImage) formData.append('image', mainImage);
        brandingImages.forEach(img => formData.append('brandingImages', img));

        try {
            if (editMode) {
                await api.put(`/gallery/${currentProject._id}`, formData);
            } else {
                await api.post('/gallery', formData);
            }
            fetchProjects();
            setShowModal(false);
            resetForm();
        } catch (error) {
            alert('Error saving project');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/gallery/${id}`);
            fetchProjects();
        } catch (error) {
            alert('Error deleting');
        }
    };

    const handleEdit = (project) => {
        setCurrentProject(project);
        setEditMode(true);
        setShowModal(true);
    };

    const resetForm = () => {
        setEditMode(false);
        setCurrentProject({ title: '', description: '', category: 'Branding', client: '', date: '', aboutProject: '' });
        setMainImage(null);
        setBrandingImages([]);
    };

    if (loading) return <Loader2 className="animate-spin" />;

    return (
        <div className="admin-page">
            <header className="admin-page-header">
                <div>
                    <h2>Project Portfolio</h2>
                </div>
                <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary add-project-btn">
                    <Plus size={18} /> Add New Project
                </button>
            </header>

            <div className="inventory-section">
                <h3>Current Inventory</h3>
                <div className="inventory-grid">
                    {projects.length === 0 ? (
                        <div className="empty-state-full card">No projects documented yet.</div>
                    ) : (
                        projects.map(p => (
                            <div key={p._id} className="inventory-card card">
                                <div className="item-preview">
                                    <img src={p.imageUrl} alt="" />
                                    <div className="category-tag">{p.category}</div>
                                </div>
                                <div className="item-details">
                                    <h4>{p.title}</h4>
                                    <p>{p.client || 'Personal Project'}</p>
                                </div>
                                <div className="item-footer">
                                    <button onClick={() => handleEdit(p)} className="action-btn edit"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(p._id)} className="action-btn delete"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-window card glass-panel project-modal">
                        <header className="modal-header">
                            <div className="tab-header-inline">
                                <Edit size={18} />
                                <h3>{editMode ? 'Modify Project' : 'Register New Work'}</h3>
                            </div>
                            <button onClick={() => setShowModal(false)} className="close-btn"><X size={24} /></button>
                        </header>

                        <div className="modal-body">
                            <form id="project-form" onSubmit={handleSubmit} className="admin-form-compact">
                                <div className="form-grid">
                                    <div className="input-group">
                                        <label>Display Title</label>
                                        <input className="form-input" type="text" placeholder="e.g. Minimalist Branding" value={currentProject.title} onChange={e => setCurrentProject({ ...currentProject, title: e.target.value })} required />
                                    </div>
                                    <div className="input-group">
                                        <label>Category</label>
                                        <select className="form-input" value={currentProject.category} onChange={e => setCurrentProject({ ...currentProject, category: e.target.value })}>
                                            {['Branding', 'UI/UX', 'Posters', 'Social Media', 'Motion'].map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Client Name</label>
                                        <input className="form-input" type="text" placeholder="Client or Company" value={currentProject.client} onChange={e => setCurrentProject({ ...currentProject, client: e.target.value })} />
                                    </div>
                                    <div className="input-group">
                                        <label>Launch Date</label>
                                        <input className="form-input" type="text" placeholder="Oct 2023" value={currentProject.date} onChange={e => setCurrentProject({ ...currentProject, date: e.target.value })} />
                                    </div>
                                </div>

                                <div className="input-group full-width">
                                    <label>Short Pitch</label>
                                    <textarea className="form-input" placeholder="A one-sentence hook for the project..." rows="2" value={currentProject.description} onChange={e => setCurrentProject({ ...currentProject, description: e.target.value })} required />
                                </div>

                                <div className="input-group full-width">
                                    <label>Full Case Study Content</label>
                                    <textarea className="form-input" placeholder="Detailed breakdown of the design process..." rows="4" value={currentProject.aboutProject} onChange={e => setCurrentProject({ ...currentProject, aboutProject: e.target.value })} />
                                </div>

                                <div className="upload-grid-compact">
                                    <div className="upload-card-compact">
                                        <label>Cover Asset</label>
                                        <div className="file-drop-small">
                                            <ImageIcon size={20} />
                                            <span>{mainImage ? mainImage.name : 'Select Thumbnail'}</span>
                                            <input type="file" onChange={e => setMainImage(e.target.files[0])} />
                                        </div>
                                    </div>
                                    <div className="upload-card-compact">
                                        <label>Gallery Assets</label>
                                        <div className="file-drop-small">
                                            <Plus size={20} />
                                            <span>{brandingImages.length > 0 ? `${brandingImages.length} files` : 'Select Showcase'}</span>
                                            <input type="file" multiple onChange={e => setBrandingImages(Array.from(e.target.files))} />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <footer className="modal-footer">
                            <button type="submit" form="project-form" disabled={isSaving} className="btn-primary full-btn">
                                {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> {editMode ? 'Sync Changes' : 'Publish Project'}</>}
                            </button>
                        </footer>
                    </div>
                </div>
            )}

            <style>{`
                .admin-page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
                .add-project-btn { gap: 10px; padding: 12px 24px; }
                
                .inventory-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
                .inventory-card { padding: 0; overflow: hidden; display: flex; flex-direction: column; }
                .item-preview { height: 180px; position: relative; }
                .item-preview img { width: 100%; height: 100%; object-fit: cover; }
                .category-tag { position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; color: var(--primary); }
                .item-details { padding: 20px; flex: 1; }
                .item-details h4 { margin: 0 0 5px 0; font-family: 'Outfit'; font-size: 1.1rem; }
                .item-details p { margin: 0; font-size: 0.85rem; color: var(--text-muted); }
                .item-footer { padding: 15px 20px; background: rgba(255,255,255,0.02); display: flex; justify-content: flex-end; gap: 12px; }
                
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; }
                .project-modal { max-width: 800px; width: 100%; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; }
                
                .modal-header { padding: 25px 30px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
                .tab-header-inline { display: flex; align-items: center; gap: 12px; color: var(--primary); }
                .tab-header-inline h3 { margin: 0; font-size: 1.2rem; }
                .close-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; }
                
                .modal-body { padding: 30px; overflow-y: auto; }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
                .input-group label { display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 8px; }
                .full-width { margin-bottom: 20px; }
                
                .upload-grid-compact { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .file-drop-small { position: relative; background: rgba(0,0,0,0.2); border: 1px dashed var(--border); border-radius: 12px; padding: 15px; display: flex; align-items: center; gap: 12px; color: var(--text-muted); }
                .file-drop-small input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
                
                .modal-footer { padding: 25px 30px; border-top: 1px solid var(--border); }
                .full-btn { width: 100%; justify-content: center; padding: 15px; }
                
                .action-btn { background: transparent; border: none; cursor: pointer; width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
                .action-btn.edit { color: var(--primary); background: var(--hover); }
                .action-btn.delete { color: #f87171; background: rgba(248, 113, 113, 0.1); }
                .empty-state-full { grid-column: 1 / -1; padding: 60px; text-align: center; color: var(--text-muted); font-weight: 600; background: rgba(255,255,255,0.01); border: 1px dashed var(--border); }
            `}</style>
        </div>
    );
};

export default ProjectManager;
