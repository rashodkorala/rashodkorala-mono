import { Camera, Home, Store, Car } from "lucide-react";
import Link from "next/link";

const Services = () => {
    const specialties = [
        {
            icon: <Home className="h-6 w-6 text-gray-600" />,
            title: "Interior Spaces",
            description: "Capturing the soul of architectural spaces through thoughtful composition and natural light."
        },
        {
            icon: <Store className="h-6 w-6 text-gray-600" />,
            title: "Culinary Experiences",
            description: "Bringing restaurant atmospheres and culinary artistry to life through visual storytelling."
        },
        {
            icon: <Car className="h-6 w-6 text-gray-600" />,
            title: "Automotive Excellence",
            description: "Showcasing vehicles with precision, highlighting craftsmanship and design details."
        },
        {
            icon: <Camera className="h-6 w-6 text-gray-600" />,
            title: "Brand Narratives",
            description: "Creating compelling visual content that authentically represents your business story."
        }
    ];

    return (
        <section id="services" className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-8 tracking-wide">
                        What I Do
                    </h2>
                    <div className="w-16 h-px bg-gray-300 mx-auto mb-8"></div>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
                        Specializing in commercial and architectural photography that tells your story
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
                    {specialties.map((specialty, index) => (
                        <div key={index} className="group">
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0 mt-1">
                                    {specialty.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-light text-gray-900 mb-4 tracking-wide">
                                        {specialty.title}
                                    </h3>
                                    <p className="text-gray-500 leading-relaxed font-light">
                                        {specialty.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <div className="border-t border-gray-200 pt-16">
                        <p className="text-gray-500 mb-8 font-light">
                            Ready to create something extraordinary together?
                        </p>
                        <Link
                            href="/contact"
                            className="inline-block text-gray-900 border-b border-gray-900 pb-1 hover:border-gray-400 hover:text-gray-600 transition-colors duration-300 font-light tracking-wide"
                        >
                            Let&apos;s Talk
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services; 