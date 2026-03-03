import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X, FileText, Loader2, Calendar, User, Image as ImageIcon } from 'lucide-react';
import api from '../../api/config';

const BlogManager = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentBlog, setCurrentBlog] = useState({
        title: '', excerpt: '', content: '', author: '', category: 'Design', date: ''
    });
    const [image, setImage] = useState(null);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await api.get('/blog');
            setBlogs(res.data.data);
        } catch (error) {
            console.error('Error fetching blogs');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData();
        Object.keys(currentBlog).forEach(key => {
            if (currentBlog[key] !== null && currentBlog[key] !== undefined) {
                formData.append(key, currentBlog[key]);
            }
        });
        if (image) formData.append('image', image);

        try {
            if (editMode) {
                await api.put(`/blog/id/${currentBlog._id}`, formData);
            } else {
                await api.post('/blog', formData);
            }
            fetchBlogs();
            setShowModal(false);
            resetForm();
        } catch (error) {
            alert('Error saving blog');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/blog/id/${id}`);
            fetchBlogs();
        } catch (error) {
            alert('Error deleting');
        }
    };

    const handleEdit = (blog) => {
        setCurrentBlog(blog);
        setEditMode(true);
        setShowModal(true);
    };

    const resetForm = () => {
        setEditMode(false);
        setCurrentBlog({ title: '', excerpt: '', content: '', author: '', category: 'Design', date: '' });
        setImage(null);
    };

    if (loading) return <Loader2 className="animate-spin" />;

    return (
        <div className="admin-page">
            <header className="admin-page-header">
                <div>
                    <h2>Editorial Manager</h2>
                </div>
                <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary create-blog-btn">
                    <Plus size={18} /> Create New Article
                </button>
            </header>

            <div className="inventory-section">
                <h3>Published Stories</h3>
                <div className="blog-list">
                    {blogs.length === 0 ? (
                        <div className="empty-state card">No articles published yet.</div>
                    ) : (
                        blogs.map(b => (
                            <div key={b._id} className="blog-row card">
                                <img className="row-thumb" src={b.imageUrl} alt="" loading="lazy" />
                                <div className="row-content">
                                    <div className="row-meta">
                                        <span className="cat">{b.category}</span>
                                        <span>{b.date}</span>
                                    </div>
                                    <h4>{b.title}</h4>
                                </div>
                                <div className="row-actions">
                                    <button onClick={() => handleEdit(b)} className="action-btn edit"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(b._id)} className="action-btn delete"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-window card glass-panel blog-modal">
                        <header className="modal-header">
                            <div className="tab-header-inline">
                                <FileText size={18} />
                                <h3>{editMode ? 'Refine Article' : 'Draft New Story'}</h3>
                            </div>
                            <button onClick={() => setShowModal(false)} className="close-btn"><X size={24} /></button>
                        </header>

                        <div className="modal-body">
                            <form id="blog-form" onSubmit={handleSubmit} className="admin-form-compact">
                                <div className="form-grid">
                                    <div className="input-field full-width">
                                        <label>Headline</label>
                                        <input className="form-input" type="text" placeholder="Engaging Title" value={currentBlog.title} onChange={e => setCurrentBlog({ ...currentBlog, title: e.target.value })} required />
                                    </div>
                                </div>

                                <div className="form-grid">
                                    <div className="input-field">
                                        <label>Author</label>
                                        <div className="field-inner-compact">
                                            <User size={16} />
                                            <input className="form-input" type="text" placeholder="Writer Name" value={currentBlog.author} onChange={e => setCurrentBlog({ ...currentBlog, author: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="input-field">
                                        <label>Publish Date</label>
                                        <div className="field-inner-compact">
                                            <Calendar size={16} />
                                            <input className="form-input" type="text" placeholder="Oct 24, 2023" value={currentBlog.date} onChange={e => setCurrentBlog({ ...currentBlog, date: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="input-field">
                                        <label>Category</label>
                                        <select className="form-input" value={currentBlog.category} onChange={e => setCurrentBlog({ ...currentBlog, category: e.target.value })}>
                                            {['Design', 'Development', 'Interior', 'Branding', 'Tech'].map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="input-field full-width">
                                    <label>Cover Asset</label>
                                    <div className="file-drop-hero-compact">
                                        <ImageIcon size={24} />
                                        <span>{image ? image.name : 'Choose feature image'}</span>
                                        <input type="file" onChange={e => setImage(e.target.files[0])} />
                                    </div>
                                </div>

                                <div className="input-field full-width">
                                    <label>Summary (Excerpt)</label>
                                    <textarea className="form-input" placeholder="Short teaser for the blog card..." rows="2" value={currentBlog.excerpt} onChange={e => setCurrentBlog({ ...currentBlog, excerpt: e.target.value })} required />
                                </div>

                                <div className="input-field full-width">
                                    <label>Body Content</label>
                                    <textarea className="form-input editor-area-compact" placeholder="Write your story here..." rows="8" value={currentBlog.content} onChange={e => setCurrentBlog({ ...currentBlog, content: e.target.value })} required />
                                </div>
                            </form>
                        </div>

                        <footer className="modal-footer">
                            <button type="submit" form="blog-form" disabled={isSaving} className="btn-primary full-btn">
                                {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={18} /> {editMode ? 'Sync Article' : 'Publish Story'}</>}
                            </button>
                        </footer>
                    </div>
                </div>
            )}

            <style>{`
                .admin-page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
                .create-blog-btn { gap: 10px; padding: 12px 24px; }
                
                .blog-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
                .blog-row { padding: 20px; display: flex; flex-direction: column; gap: 15px; transition: transform 0.2s; position: relative; }
                .blog-row:hover { transform: translateY(-5px); }
                .row-thumb { width: 100%; height: 160px; border-radius: 12px; object-fit: cover; }
                .row-content { flex: 1; display: flex; flex-direction: column; gap: 8px; }
                .row-meta { display: flex; gap: 15px; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
                .cat { color: var(--primary); }
                .row-content h4 { margin: 0; font-family: 'Outfit'; font-size: 1.2rem; line-height: 1.3; }
                
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; }
                .blog-modal { max-width: 850px; width: 100%; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; }
                
                .modal-header { padding: 25px 30px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
                .tab-header-inline { display: flex; align-items: center; gap: 12px; color: var(--primary); }
                .tab-header-inline h3 { margin: 0; font-size: 1.2rem; }
                .close-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; }
                
                .modal-body { padding: 30px; overflow-y: auto; }
                .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
                .input-field label { display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 8px; }
                .full-width { grid-column: 1 / -1; }
                
                .field-inner-compact { display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 10px; padding: 0 12px; }
                .field-inner-compact input { background: transparent; border: none; padding: 10px 0; color: #fff; width: 100%; outline: none; font-size: 0.9rem; }
                .field-inner-compact svg { color: var(--text-muted); }
                
                .file-drop-hero-compact { position: relative; height: 100px; border: 1px dashed var(--border); border-radius: 12px; display: flex; align-items: center; justify-content: center; gap: 12px; color: var(--text-muted); }
                .file-drop-hero-compact input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
                
                .editor-area-compact { line-height: 1.6; font-size: 1rem; background: rgba(0,0,0,0.2) !important; padding: 15px; border-radius: 12px; border: 1px solid var(--border); }
                
                .modal-footer { padding: 25px 30px; border-top: 1px solid var(--border); }
                .full-btn { width: 100%; justify-content: center; padding: 15px; }
                
                .row-actions { display: flex; gap: 10px; margin-top: auto; padding-top: 10px; border-top: 1px solid var(--border); }
                .action-btn { background: transparent; border: none; cursor: pointer; flex: 1; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
                .action-btn.edit { color: var(--primary); background: var(--hover); }
                .action-btn.delete { color: #f87171; background: rgba(248, 113, 113, 0.1); }
            `}</style>
        </div>
    );
};

export default BlogManager;
