import { PenTool, Monitor, Layers, Send } from 'lucide-react';
import './Services.css';

const services = [
    { icon: <Monitor size={36} />, title: "Digital <br/> Experiences", desc: "Crafting immersive website experiences that prioritize storytelling and intuitive user journeys." },
    { icon: <PenTool size={36} />, title: "Visual <br/> Branding", desc: "Engineering high-end brand identities, logos, and visual systems that define industry leaders." },
    { icon: <Layers size={36} />, title: "Product <br/> Design", desc: "Translating complex problems into elegant user interfaces and robust design architectures." },
    { icon: <Monitor size={36} />, title: "Motion <br/> Identity", desc: "Bringing static brands to life through cinematic animation and dynamic visual interactions." },
];

const Services = () => {
    return (
        <section className="services-section">
            <div className="container">
                <div className="services-grid">
                    {services.map((service, index) => (
                        <div key={index} className="service-card-premium">
                            <div className="service-icon-box">{service.icon}</div>
                            <h3 className="service-title-premium" dangerouslySetInnerHTML={{ __html: service.title }}></h3>
                            <p className="service-desc-premium">{service.desc}</p>
                            <span className="service-learn-more">
                                Inquire Project <Send size={16} />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
