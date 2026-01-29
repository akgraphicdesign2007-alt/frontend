import { PenTool, Monitor, Layers, Camera } from 'lucide-react';
import './Services.css';

const services = [
    { icon: <PenTool size={32} />, title: "Brand Identity", desc: "Logo design, visual systems, and brand guidelines that tell your story." },
    { icon: <Layers size={32} />, title: "Print Design", desc: "Marketing materials, packaging, and editorial design." },
];

const Services = () => {
    return (
        <section className="services-section">
            <div className="container">
                <div className="services-grid">
                    {services.map((service, index) => (
                        <div key={index} className="service-card">
                            <div className="service-icon">{service.icon}</div>
                            <h3 className="service-title">{service.title}</h3>
                            <p className="service-desc">{service.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
