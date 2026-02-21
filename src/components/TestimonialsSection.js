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

function TestimonialsSection() {
    return (
        <section className="testimonials-section">
            <div className="testimonials-container">
                <div className="testimonials-header">
                    <h2>Por qué elegirnos</h2>
                    <p>Descubre lo que hace especial a Casas Maria Ernestina</p>
                </div>

                <div className="testimonials-grid">
                    {informacionCards.map((card) => (
                        <div key={card.id} className="testimonial-card info-card">
                            <div className="card-icon-wrapper">
                                <i className={`fas ${card.icon}`}></i>
                            </div>

                            <h3 className="card-title">{card.titulo}</h3>
                            <p className="card-description">{card.descripcion}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TestimonialsSection;
