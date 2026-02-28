import React, { useState, useEffect, useRef } from 'react';

function HeroCarousel({ propiedades = [] }) {
    const [indiceActual, setIndiceActual] = useState(0);
    const [offset, setOffset] = useState(0);
    const [isPressed, setIsPressed] = useState(false);
    const [autoTransition, setAutoTransition] = useState(true);
    const touchStartX = useRef(null);
    const carouselRef = useRef(null);

    // Usar las primeras 5 propiedades o usar imágenes por defecto
    const imagenes = propiedades.slice(0, 5).map(p => p.img || 'https://via.placeholder.com/1200x500?text=Casa');

    useEffect(() => {
        if (!autoTransition) return;
        
        const timer = setInterval(() => {
            setIndiceActual((prev) => (prev + 1) % (imagenes.length || 1));
        }, 5000);

        return () => clearInterval(timer);
    }, [imagenes.length, autoTransition]);

    const irA = (index) => {
        setIndiceActual(index);
        setOffset(0);
        setIsPressed(false);
        setAutoTransition(true);
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.changedTouches[0].clientX;
        setIsPressed(true);
        setAutoTransition(false);
    };

    const handleTouchMove = (e) => {
        if (!isPressed || !touchStartX.current) return;
        
        const touchCurrentX = e.changedTouches[0].clientX;
        const distancia = touchCurrentX - touchStartX.current;
        
        // Limitar el desplazamiento para no ir muy lejos
        const limitedOffset = Math.max(-150, Math.min(150, distancia));
        setOffset(limitedOffset);
    };

    const handleTouchEnd = (e) => {
        if (!touchStartX.current) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const distancia = touchStartX.current - touchEndX;
        const minSwipeDistance = 30;

        setIsPressed(false);

        if (Math.abs(distancia) > minSwipeDistance) {
            if (distancia > 0) {
                // Swipe a la izquierda → siguiente
                setIndiceActual((prev) => (prev + 1) % (imagenes.length || 1));
            } else {
                // Swipe a la derecha → anterior
                setIndiceActual((prev) => (prev - 1 + (imagenes.length || 1)) % (imagenes.length || 1));
            }
        }

        setOffset(0);
        touchStartX.current = null;
        setAutoTransition(true);
    };

    if (imagenes.length === 0) {
        return null;
    }

    return (
        <div 
            className="hero-carousel"
            ref={carouselRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="hero-carousel-inner">
                <img
                    src={imagenes[indiceActual]}
                    alt={`Slide ${indiceActual + 1}`}
                    className="hero-carousel-img"
                    style={{
                        transform: `translateX(${offset}px)`,
                        transition: isPressed ? 'none' : 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
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
            )}
        </div>
    );
}

export default HeroCarousel;
