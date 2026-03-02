import { useState, useEffect } from 'react';
import { Loader2, Image as ImageIcon, FileText, Trash2, ExternalLink, Filter, Search, Copy, Check } from 'lucide-react';
import api from '../../api/config';
import './MediaManager.css';

const MediaManager = () => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'image', 'raw'
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedUrl, setCopiedUrl] = useState('');

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        try {
            const res = await api.get('/media');
            setMedia(res.data.data || []);
        } catch (error) {
            console.error('Error fetching media:', error);
            setMedia([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (public_id, resource_type) => {
        if (!window.confirm('WARNING: Deleting this file will permanently break any images or links currently using it on your platform. Proceed?')) return;

        try {
            await api.post('/media/delete', { public_id, resource_type });
            fetchMedia();
        } catch (error) {
            alert('Error deleting file');
        }
    };

    const handleCopy = (url) => {
        navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(''), 2000);
    };

    const filteredMedia = media
        .filter(m => filter === 'all' || m.resource_type === filter)
        .filter(m => m.public_id.toLowerCase().includes(searchTerm.toLowerCase()));

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (loading) return (
        <div className="admin-loader-container">
            <Loader2 className="animate-spin" size={40} />
        </div>
    );

    return (
        <div className="admin-page media-manager-page">
            <header className="admin-page-header">
                <div>
                    <h2>Cloudinary Storage</h2>
                </div>
                
            </header>

            <div className="media-controls-premium">
                <div className="search-bar-premium">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by filename..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-group-premium">
                    <Filter size={16} />
                    <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All Files</button>
                    <button className={filter === 'image' ? 'active' : ''} onClick={() => setFilter('image')}>Images</button>
                    <button className={filter === 'raw' ? 'active' : ''} onClick={() => setFilter('raw')}>Raw / PDFs</button>
                </div>
            </div>

            {filteredMedia.length === 0 ? (
                <div className="empty-media-state">
                    <ImageIcon size={48} opacity={0.2} />
                    <p>No files found matching your criteria.</p>
                </div>
            ) : (
                <div className="media-grid-premium">
                    {filteredMedia.map((file) => (
                        <div key={file.public_id} className="media-card-premium">
                            <div className="media-thumbnail">
                                {file.resource_type === 'image' ? (
                                    <img src={file.secure_url} alt={file.public_id} loading="lazy" />
                                ) : (
                                    <div className="raw-file-icon">
                                        <FileText size={40} color="var(--primary)" />
                                        <span>PDF / RAW</span>
                                    </div>
                                )}

                                <div className="media-overlay-actions">
                                    <button
                                        className="media-action-btn copy-btn"
                                        title="Copy URL"
                                        onClick={() => handleCopy(file.secure_url)}
                                    >
                                        {copiedUrl === file.secure_url ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                    <a
                                        href={file.secure_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="media-action-btn view-btn"
                                        title="View Original"
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                    <button
                                        className="media-action-btn delete-btn"
                                        title="Delete File"
                                        onClick={() => handleDelete(file.public_id, file.resource_type)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="media-details">
                                <h4>{file.public_id.split('/').pop()}</h4>
                                <div className="media-meta">
                                    <span className="file-format">{file.format || 'raw'}</span>
                                    <span className="file-size">{formatBytes(file.bytes)}</span>
                                </div>
                                <span className="upload-date">
                                    {new Date(file.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MediaManager;
