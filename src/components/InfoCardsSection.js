import React from 'react';

const infoCards = [
    {
        id: 1,
        title: 'Reserva fácil y segura',
        description: 'Gestiona tu reserva en línea con confirmación instantánea y atención personalizada.',
        icon: '🔒',
    },
    {
        id: 2,
        title: 'Ubicaciones premium',
        description: 'Propiedades en las mejores zonas de playa, bosque y ciudad para todos los gustos.',
        icon: '📍',
    },
    {
        id: 3,
        title: 'Atención 24/7',
        description: 'Soporte y asistencia en todo momento para que tu experiencia sea perfecta.',
        icon: '💬',
    },
    {
        id: 4,
        title: 'Experiencia personalizada',
        description: 'Cada propiedad está equipada para ofrecerte comodidad y lujo a tu medida.',
        icon: '✨',
    },
];

function InfoCardsSection() {
    return (
        <section className="info-cards-section">
            <div className="info-cards-container">
                <h2>Información útil para tu estancia</h2>
                <div className="info-cards-grid">
                    {infoCards.map(card => (
                        <div key={card.id} className="info-card">
                            <div className="info-card-icon">{card.icon}</div>
                            <div className="info-card-content">
                                <h3>{card.title}</h3>
                                <p>{card.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default InfoCardsSection;
