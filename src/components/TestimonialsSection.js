import React from 'react';

const testimonios = [
    {
        id: 1,
        nombre: 'María García',
        ciudad: 'Oaxaca',
        rating: 5,
        texto: 'Una experiencia increíble. La casa superó todas mis expectativas. El servicio fue excelente y el lugar hermoso.',
        fecha: 'Hace 2 meses',
        avatar: '👩‍💼'
    },
    {
        id: 2,
        nombre: 'Juan López',
        ciudad: 'Puerto Vallarta',
        rating: 5,
        texto: 'Definitivamente volvería. Fue el mejor viaje en familia. Todo muy limpio y bien organizado.',
        fecha: 'Hace 1 mes',
        avatar: '👨‍💼'
    },
    {
        id: 3,
        nombre: 'Ana Martínez',
        ciudad: 'Playa del Carmen',
        rating: 5,
        texto: 'Casas Maria Ernestina ofrece propiedades de lujo incomparables. Altamente recomendado para vacaciones premium.',
        fecha: 'Hace 3 semanas',
        avatar: '👩‍🦰'
    },
    {
        id: 4,
        nombre: 'Carlos Rodríguez',
        ciudad: 'Cancún',
        rating: 5,
        texto: 'La atención al detalle es notoria. Una joya escondida para aquellos que buscan lo mejor en hospedaje.',
        fecha: 'Hace 2 semanas',
        avatar: '👨‍🦱'
    }
];

function TestimonialsSection() {
    return (
        <section className="testimonials-section">
            <div className="testimonials-container">
                <div className="testimonials-header">
                    <h2>Lo que dicen nuestros huéspedes</h2>
                    <p>Experiencias reales de personas que han disfrutado nuestras propiedades</p>
                </div>

                <div className="testimonials-grid">
                    {testimonios.map((testimonio) => (
                        <div key={testimonio.id} className="testimonial-card">
                            <div className="testimonial-header-card">
                                <div className="testimonial-avatar">{testimonio.avatar}</div>
                                <div className="testimonial-info">
                                    <h4 className="testimonial-name">{testimonio.nombre}</h4>
                                    <p className="testimonial-city">{testimonio.ciudad}</p>
                                </div>
                            </div>

                            <div className="testimonial-rating">
                                {[...Array(testimonio.rating)].map((_, i) => (
                                    <span key={i} className="star">★</span>
                                ))}
                            </div>

                            <p className="testimonial-text">{testimonio.texto}</p>
                            <p className="testimonial-date">{testimonio.fecha}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TestimonialsSection;
