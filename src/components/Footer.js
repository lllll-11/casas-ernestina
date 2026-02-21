import React from 'react';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h4>Casas Maria Ernestina</h4>
                        <p>Tu plataforma de confianza para alquilar propiedades exclusivas en México.</p>
                        <div className="footer-social">
                            <a href="https://wa.me/529711924204" target="_blank" rel="noopener noreferrer" title="WhatsApp">
                                <i className="fab fa-whatsapp"></i>
                            </a>
                            <a href="tel:+529711924204" title="Teléfono">
                                <i className="fas fa-phone"></i>
                            </a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h5>Contacto</h5>
                        <ul>
                            <li>
                                <a href="tel:+529711924204">
                                    <i className="fas fa-phone"></i> +52 971-192-4204
                                </a>
                            </li>
                            <li>
                                <a href="https://wa.me/529711924204" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-whatsapp"></i> WhatsApp
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h5>Enlaces</h5>
                        <ul>
                            <li><a href="#propiedades">Propiedades</a></li>
                            <li><a href="#inicio">Inicio</a></li>
                            <li><a href="#categorias">Categorías</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-bottom">
                    <p>&copy; 2024 Casas Maria Ernestina. Todos los derechos reservados.</p>
                    <p className="footer-tagline">Experiencias únicas en lugares privilegiados</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
