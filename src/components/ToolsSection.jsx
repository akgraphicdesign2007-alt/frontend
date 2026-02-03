import { motion } from 'framer-motion';
import './ToolsSection.css';

const ToolsSection = () => {
    const tools = [
        { name: 'Adobe Photoshop', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Adobe_Photoshop_CC_icon.svg/640px-Adobe_Photoshop_CC_icon.svg.png', color: '#31A8FF', isImage: true },
        { name: 'Adobe Illustrator', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Adobe_Illustrator_CC_icon.svg/1280px-Adobe_Illustrator_CC_icon.svg.png?20251029195730', color: '#FF9A00', isImage: true },
        { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg', color: '#F24E1E', isImage: true },
        { name: 'Adobe After Effects', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Adobe_After_Effects_CC_icon.svg/1280px-Adobe_After_Effects_CC_icon.svg.png?20210519030120', color: '#9999FF', isImage: true },
        { name: 'Adobe Premiere Pro', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Adobe_Premiere_Pro_CC_icon.svg/1280px-Adobe_Premiere_Pro_CC_icon.svg.png?20210729021549', color: '#9999FF', isImage: true },
        { name: 'Canva', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBRoE5DcalLnKRtZfuKddbpQxE2rGNLe6jXw&s', color: '#00C4CC', isImage: true },
    ];

    // Duplicate the tools array for seamless infinite scroll
    const duplicatedTools = [...tools, ...tools];

    return (
        <section className="tools-section">
            <div className="container">
                <motion.div
                    className="tools-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="section-title">TOOLS I USE</h2>
                    <h3 className="tools-subtitle">Powered by Industry-Leading Software</h3>
                </motion.div>

                <div className="tools-scroll-container">
                    <motion.div
                        className="tools-track"
                        animate={{
                            x: [0, -50 + '%'],
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 20,
                                ease: "linear",
                            },
                        }}
                    >
                        {duplicatedTools.map((tool, index) => (
                            <div key={index} className="tool-card">
                                <div
                                    className="tool-icon"
                                    style={{
                                        background: `linear-gradient(135deg, ${tool.color}22, ${tool.color}44)`,
                                        border: `2px solid ${tool.color}66`
                                    }}
                                >
                                    {tool.isImage ? (
                                        <img 
                                            src={tool.icon} 
                                            alt={tool.name} 
                                            style={{ 
                                                width: '60%', 
                                                height: '60%', 
                                                objectFit: 'contain',
                                                filter: 'brightness(1.1)'
                                            }}
                                        />
                                    ) : (
                                        <span style={{ color: tool.color }}>{tool.icon}</span>
                                    )}
                                </div>
                                <p className="tool-name">{tool.name}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ToolsSection;
