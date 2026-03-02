import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSEO } from '../hooks/useSEO';
import './NotFound.css';

const NotFound = () => {
    useSEO({
        title: '404 — Page Not Found',
        description: 'The page you are looking for could not be found. Return to AK Designs\' homepage.',
        noIndex: true, // 404 pages must never be indexed
    });

    return (
        <>
            <Navbar />
            <div className="not-found-container">
                <div className="not-found-content">
                    <h1 className="error-code">404</h1>
                    <h2 className="error-title">Page Not <span>Found</span></h2>
                    <p className="error-message">
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track.
                    </p>
                    <div className="not-found-actions">
                        <Link to="/" className="btn-primary">
                            <Home size={18} /> Back to Home
                        </Link>
                        <button onClick={() => window.history.back()} className="btn-secondary-outline">
                            <ArrowLeft size={18} /> Go Back
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default NotFound;
