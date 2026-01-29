import { useState, useEffect } from 'react';
import { Plus, Trash2, FileText, Loader2 } from 'lucide-react';
import api from '../../api/config';
import '../../components/Contact.css';

const BlogManager = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: 'Design Theory',
        readTime: '5 min read'
    });
    const [imageFile, setImageFile] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await api.get('/blog');
            setPosts(res.data.data || res.data);
        } catch (error) {
            console.error('Failed to load posts', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this post?')) return;
        try {
            await api.delete(`/blog/id/${id}`); // Note: Backend route might differ, checking routes/blog.js
            setPosts(prev => prev.filter(p => p._id !== id));
        } catch (error) {
            console.error('Failed to delete', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('excerpt', formData.excerpt);
        data.append('content', formData.content);
        data.append('category', formData.category);
        data.append('readTime', formData.readTime);
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            const res = await api.post('/blog', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Refresh list or add new item
            setPosts([res.data.data, ...posts]);
            setIsAdding(false);
            setFormData({ title: '', excerpt: '', content: '', category: 'Design Theory', readTime: '5 min read' });
            setImageFile(null);
        } catch (error) {
            console.error('Failed to create post', error);
            alert('Failed to create post');
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) return <div style={{ color: '#fff' }}><Loader2 className="animate-spin" /> Loading posts...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ color: '#fff', fontFamily: 'Oswald', margin: 0 }}>Blog Posts</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="submit-btn"
                    style={{ width: 'auto', padding: '10px 20px', margin: 0 }}
                >
                    {isAdding ? 'Cancel' : <><Plus size={18} /> New Post</>}
                </button>
            </div>

            {isAdding && (
                <div style={{ background: '#151f19', padding: '25px', borderRadius: '8px', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 style={{ color: '#fff', marginBottom: '20px' }}>New Article</h3>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Title"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px' }}
                            >
                                <option value="Design Theory">Design Theory</option>
                                <option value="Branding">Branding</option>
                                <option value="UI/UX">UI/UX</option>
                                <option value="Tutorial">Tutorial</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Read Time (e.g. 5 min)"
                                value={formData.readTime}
                                onChange={e => setFormData({ ...formData, readTime: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                placeholder="Excerpt (Short summary)"
                                rows="2"
                                value={formData.excerpt}
                                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                required
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <textarea
                                placeholder="Full Content (HTML allowed)"
                                rows="10"
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                required
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>Cover Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setImageFile(e.target.files[0])}
                                required
                                style={{ color: '#fff' }}
                            />
                        </div>
                        <button type="submit" className="submit-btn" disabled={submitLoading}>
                            {submitLoading ? <Loader2 className="animate-spin" /> : 'Publish Article'}
                        </button>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {posts.map(p => (
                    <div key={p._id} style={{
                        background: '#151f19',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <div style={{ height: '180px', background: p.image?.startsWith('http') ? `url(${p.image}) center/cover` : '#222' }}></div>
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
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: 0 }}>
                                {new Date(p.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogManager;
