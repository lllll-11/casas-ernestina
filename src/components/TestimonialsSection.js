import React from 'react';

const informacionCards = [
    {
        id: 1,
        titulo: 'Propiedades de Lujo',
        descripcion: 'Selección cuidada de propiedades premium en ubicaciones paradisíacas con todas las comodidades.',
        icon: 'fa-crown'
    },
    {
        id: 2,
        titulo: 'Servicio Excepcional',
        descripcion: 'Atención al cliente dedicada 24/7 para garantizar una experiencia memorable durante tu estadía.',
        icon: 'fa-concierge-bell'
    },
    {
        id: 3,
        titulo: 'Ubicaciones Privilegiadas',
        descripcion: 'Casas ubicadas en los mejores destinos de playa con vistas espectaculares y acceso exclusivo.',
        icon: 'fa-map-location-dot'
    },
    {
        id: 4,
        titulo: 'Privacidad y Comodidad',
        descripcion: 'Espacios amplios y bien equipados diseñados para tu confort y relajación total.',
        icon: 'fa-heart'
    }
];

const reviews = [
    {
        id: 1,
        autor: 'Sofía Rodríguez',
        lugar: 'Loft Huatulco',
        texto: 'Una experiencia verdaderamente mágica. El diseño del loft es impresionante y la atención al cliente de Casas Maria Ernestina fue excepcional. Volveremos sin dudarlo.',
        avatar: 'SR'
    },
    {
        id: 2,
        autor: 'Carlos Mendoza',
        lugar: 'Villa de Playa Nayarit',
        texto: 'La casa superó todas nuestras expectativas. Vistas espectaculares, cocina completamente equipada y una privacidad total. El servicio de chef privado fue el toque perfecto.',
        avatar: 'CM'
    },
    {
        id: 3,
        autor: 'Laura & Pierre',
        lugar: 'Residencia en la Selva',
        texto: 'Un rincón de paz en México. Las camas eran comodísimas y cada detalle de la arquitectura estaba pensado para integrarse con la naturaleza. Un 10/10 en comodidad.',
        avatar: 'LP'
    }
];

function TestimonialsSection() {
    return (
        <section className="testimonials-section reveal" id="testimonios">
            <div className="testimonials-container">
                
                {/* ── features section ── */}
                <div className="testimonials-header reveal reveal-scale-in">
                    <span className="section-eyebrow">Por qué elegirnos</span>
                    <h2 className="section-heading">Experiencias de Autor</h2>
                    <p className="section-desc">Descubre lo que hace especial a Casas Maria Ernestina</p>
                </div>

                <div className="testimonials-grid">
                    {informacionCards.map((card, idx) => (
                        <div key={card.id} className={`testimonial-card reveal reveal-fade-up reveal-delay-${idx + 1}`}>
                            <div className="card-icon-wrapper">
                                <i className={`fas ${card.icon}`}></i>
                            </div>
                            <h3 className="card-title">{card.titulo}</h3>
                            <p className="card-description">{card.descripcion}</p>
                        </div>
                    ))}
                </div>

                {/* ── guest reviews section ── */}
                <div className="reviews-section-wrapper">
                    <div className="testimonials-header reveal reveal-scale-in">
                        <span className="section-eyebrow">Opiniones</span>
                        <h2 className="section-heading">Nuestros Huéspedes</h2>
                        <p className="section-desc">Experiencias reales de quienes se han hospedado con nosotros</p>
                    </div>

                    <div className="reviews-grid">
                        {reviews.map((review, idx) => (
                            <div key={review.id} className={`review-card reveal reveal-fade-up reveal-delay-${idx + 1}`}>
                                <div className="review-stars">
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                </div>
                                <p className="review-text">"{review.texto}"</p>
                                <div className="review-divider" />
                                <div className="review-author">
                                    <div className="review-avatar">{review.avatar}</div>
                                    <div className="review-meta">
                                        <h4>{review.autor}</h4>
                                        <span>{review.lugar}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}

export default TestimonialsSection;
