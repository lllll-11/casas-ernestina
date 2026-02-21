import React, { useState, useEffect } from 'react';

function HeroCarousel({ propiedades = [] }) {
    const [indiceActual, setIndiceActual] = useState(0);

    // Usar las primeras 5 propiedades o usar imágenes por defecto
    const imagenes = propiedades.slice(0, 5).map(p => p.img || 'https://via.placeholder.com/1200x500?text=Casa');

    useEffect(() => {
        const timer = setInterval(() => {
            setIndiceActual((prev) => (prev + 1) % (imagenes.length || 1));
        }, 5000);

        return () => clearInterval(timer);
    }, [imagenes.length]);

    const irA = (index) => {
        setIndiceActual(index);
    };

    const anterior = () => {
        setIndiceActual((prev) => (prev - 1 + (imagenes.length || 1)) % (imagenes.length || 1));
    };

    const siguiente = () => {
        setIndiceActual((prev) => (prev + 1) % (imagenes.length || 1));
    };

    if (imagenes.length === 0) {
        return null;
    }

    return (
        <div className="hero-carousel">
            <div className="hero-carousel-inner">
                <img
                    src={imagenes[indiceActual]}
                    alt={`Slide ${indiceActual + 1}`}
                    className="hero-carousel-img"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/1200x500?text=Casa'}
                />

                <div className="hero-carousel-overlay">
                    <div className="hero-carousel-content">
                        <h1 className="hero-title">Descubre Casas Exclusivas</h1>
                        <p className="hero-subtitle">Experiencias únicas en lugares privilegiados</p>
                        <button className="hero-cta" onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}>
                            Ver Propiedades
                        </button>
                    </div>
                </div>
            </div>

            {imagenes.length > 1 && (
                <>
                    <button className="hero-nav hero-nav-prev" onClick={anterior}>
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <button className="hero-nav hero-nav-next" onClick={siguiente}>
                        <i className="fas fa-chevron-right"></i>
                    </button>

                    <div className="hero-dots">
                        {imagenes.map((_, idx) => (
                            <button
                                key={idx}
                                className={`hero-dot ${idx === indiceActual ? 'active' : ''}`}
                                onClick={() => irA(idx)}
                                title={`Slide ${idx + 1}`}
                            ></button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default HeroCarousel;
