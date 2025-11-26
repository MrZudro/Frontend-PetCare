// =================================================================
// src/components/cards/HeroCarouselCardLg.jsx
// Tarjeta para el carrusel principal (Hero)
// =================================================================
import React from 'react';

const HeroCarouselCardLg = ({ item }) => {
    return (
        <div 
            className="w-full h-80 flex items-center justify-center text-center bg-cover bg-center transition-all duration-500 relative rounded-xl overflow-hidden"
            style={{ 
                backgroundImage: `url(${item.imageUrl})`,
                backgroundSize: 'cover' 
            }}
        >
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center p-6"> 
                <h2 className="text-3xl font-extrabold text-white mb-2 text-shadow-lg">
                    {item.title}
                </h2>
                <p className="text-lg text-gray-200 mb-4 max-w-lg text-shadow-md">
                    {item.subtitle}
                </p>
                <a 
                    href={item.linkUrl}
                    className="inline-block bg-yellow-400 text-indigo-900 font-bold py-2 px-6 rounded-full shadow-lg hover:bg-yellow-300 transition-transform transform hover:scale-105"
                >
                    {item.linkText}
                </a>
            </div>
            <style>{`
                .text-shadow-lg { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8); }
                .text-shadow-md { text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7); }
            `}</style>
        </div>
    );
};

export default HeroCarouselCardLg;