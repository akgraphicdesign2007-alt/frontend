import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './Cta.css';

const Cta = () => {
    return (
        <section className="cta-section">
            <div className="container">
                <div className="cta-card">
                    <span className="cta-badge">Let's Collaborate</span>
                    <h2 className="cta-title">Ready to elevate your digital presence?</h2>
                    <p className="cta-desc">
                        Partner with AK Design to craft experiences that define your brand and captivate your audience.
                    </p>
                    <Link to="/contact" className="cta-button">
                        Start a Project <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Cta;
