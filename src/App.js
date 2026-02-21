import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://casas-api.onrender.com/api';

// Componente del Lightbox de Galería
function Lightbox({ imagenes, indiceInicial, onClose }) {
    const [indiceActual, setIndiceActual] = React.useState(indiceInicial);

    const siguiente = useCallback(() => {
        setIndiceActual((prev) => (prev + 1) % imagenes.length);
    }, [imagenes.length]);

    const anterior = useCallback(() => {
        setIndiceActual((prev) => (prev - 1 + imagenes.length) % imagenes.length);
    }, [imagenes.length]);

    React.useEffect(() => {
        const manejarTeclas = (e) => {
            if (e.key === 'ArrowRight') siguiente();
            if (e.key === 'ArrowLeft') anterior();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', manejarTeclas);
        return () => window.removeEventListener('keydown', manejarTeclas);
    }, [siguiente, anterior, onClose]);

    return (
        <div className="lightbox-overlay" onClick={onClose}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                <button className="lightbox-close" onClick={onClose}>✕</button>
                
                <img 
                    src={imagenes[indiceActual]} 
                    alt={`Imagen ${indiceActual + 1}`}
                    className="lightbox-img"
                />
                
                <div className="lightbox-info">
                    <span>{indiceActual + 1} / {imagenes.length}</span>
                </div>
                
                <button className="lightbox-btn lightbox-prev" onClick={anterior}>
                    <i className="fas fa-chevron-left"></i>
                </button>
                
                <button className="lightbox-btn lightbox-next" onClick={siguiente}>
                    <i className="fas fa-chevron-right"></i>
                </button>
                
                <div className="lightbox-thumbnails">
                    {imagenes.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            className={`lightbox-thumb ${idx === indiceActual ? 'active' : ''}`}
                            onClick={() => setIndiceActual(idx)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// Componente del Modal de Detalle
function ModalDetalle({ propiedad, onClose }) {
    const [imagenLightbox, setImagenLightbox] = React.useState(null);

    if (!propiedad) return null;

    // Validar que la galería existe y es un array
    const galeria = Array.isArray(propiedad.galeria) ? propiedad.galeria : [];
    const amenidades = Array.isArray(propiedad.amenidades) ? propiedad.amenidades : [];
    const mapaEmbed = propiedad.mapa_embed || '';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>✕</button>

                <img src={propiedad.img} alt={propiedad.titulo} className="modal-img" />

                <div className="modal-body">
                    <div className="rating-header">
                        <h1>{propiedad.titulo}</h1>
                        <div className="rating">★ {propiedad.rating}</div>
                    </div>

                    <p className="ubicacion-detalle">{propiedad.ubicacion}</p>
                    <p className="descripcion-detalle">{propiedad.descripcion}</p>

                    <div className="info-grid">
                        <div className="info-item">
                            <i className="fas fa-users"></i>
                            <div>
                                <p className="label">{propiedad.huespedes} huéspedes</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <i className="fas fa-bed"></i>
                            <div>
                                <p className="label">{propiedad.dormitorios} dormitorios</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <i className="fas fa-bath"></i>
                            <div>
                                <p className="label">{propiedad.banios} baños</p>
                            </div>
                        </div>
                    </div>

                    {amenidades.length > 0 && (
                        <div className="amenidades-seccion">
                            <h3>Amenidades</h3>
                            <ul className="amenidades-lista">
                                {amenidades.map((amenidad, idx) => (
                                    <li key={idx}>{amenidad}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="ubicacion-seccion">
                        <h3><i className="fas fa-map-marker-alt"></i> Ubicación</h3>
                        <p className="ubicacion-texto">{propiedad.ubicacion}</p>

                        <div className="mapa-container">
                            {mapaEmbed ? (
                                (() => {
                                    // Extraer el src del iframe embed
                                    const srcMatch = mapaEmbed.match(/src="([^"]+)"/);
                                    const mapSrc = srcMatch ? srcMatch[1] : null;

                                    return mapSrc ? (
                                        <iframe
                                            title={`Mapa de ${propiedad.ubicacion}`}
                                            width="100%"
                                            height="300"
                                            style={{ border: 0, borderRadius: '12px' }}
                                            loading="lazy"
                                            allowFullScreen=""
                                            referrerPolicy="no-referrer-when-downgrade"
                                            src={mapSrc}
                                        ></iframe>
                                    ) : (
                                        <p style={{ color: '#999', fontSize: '14px' }}>Mapa no disponible</p>
                                    );
                                })()
                            ) : (
                                <p style={{ color: '#999', fontSize: '14px' }}>Ubicación no disponible</p>
                            )}
                        </div>

                        <a
                            href={`https://www.google.com/maps/search/${encodeURIComponent(propiedad.ubicacion)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-mapa"
                        >
                            <i className="fas fa-map"></i> Ver en Google Maps
                        </a>
                    </div>

                    <div className="precio-detalle">
                        <a
                            href={`https://wa.me/529711924204?text=Hola,%20estoy%20interesado%20en%20reservar%20${propiedad.titulo}%20en%20${propiedad.ubicacion}.%20¿Cuál%20es%20el%20precio%20y%20disponibilidad?`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-reservar"
                        >
                            <i className="fab fa-whatsapp"></i> Consultar precio y disponibilidad
                        </a>
                    </div>

                    {galeria.length > 0 && (
                        <div className="galeria-seccion">
                            <h3>Más fotos del lugar</h3>
                            <div className="galeria-grid">
                                {galeria.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Foto ${idx + 1}`}
                                        className="galeria-img"
                                        onClick={() => setImagenLightbox(idx)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {imagenLightbox !== null && (
                <Lightbox
                    imagenes={galeria}
                    indiceInicial={imagenLightbox}
                    onClose={() => setImagenLightbox(null)}
                />
            )}
        </div>
    );
}

// Componente del Menú Móvil
function MenuMovil({ isOpen, onClose }) {
    return (
        <>
            {isOpen && <div className="menu-overlay" onClick={onClose}></div>}
            <nav className={`menu-movil ${isOpen ? 'open' : ''}`}>
                <button className="menu-close" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>
                
                <div className="menu-content">
        

                    
                    <div className="menu-contact">
                        <h3>Contacto</h3>
                        <a href="tel:+529711924204" className="contact-item">
                            <i className="fas fa-phone"></i>
                            <span>+52 971-192-4204</span>
                        </a>
                        <a href="https://wa.me/529711924204" target="_blank" rel="noopener noreferrer" className="contact-item whatsapp">
                            <i className="fab fa-whatsapp"></i>
                            <span>WhatsApp</span>
                        </a>

                    </div>
                </div>
            </nav>
        </>
    );
}

// Convert to React component
function App() {
    const [filtro, setFiltro] = useState('Todos');
    const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [propiedades, setPropiedades] = useState([]);
    const categorias = ['Todos', 'Playa', 'Bosque', 'Ciudad'];

    // Cargar propiedades desde la API
    useEffect(() => {
        fetchPropiedades();
        const interval = setInterval(fetchPropiedades, 5000); // Recargar cada 5 segundos
        return () => clearInterval(interval);
    }, []);

    const fetchPropiedades = async () => {
        try {
            const response = await fetch(`${API_URL}/propiedades`);
            const data = await response.json();
            
            // Parsear galeria y amenidades si vienen como string
            const propiedadesProcesadas = data.map(p => ({
                ...p,
                galeria: typeof p.galeria === 'string' ? JSON.parse(p.galeria || '[]') : (p.galeria || []),
                amenidades: typeof p.amenidades === 'string'
                    ? (p.amenidades.trim() === '' ? [] : p.amenidades.split(',').map(a => a.trim()).filter(a => a))
                    : (Array.isArray(p.amenidades) ? p.amenidades : [])
            }));
            setPropiedades(propiedadesProcesadas);
        } catch (error) {
            console.error('Error cargando propiedades:', error);
        }
    };

    const filtradas = filtro === 'Todos'
        ? propiedades
        : propiedades.filter(p => p.categoria === filtro);

    return (
        <div>
            <header>
                <img src="/logo-nombre.png" alt="Casas Maria Ernestina" className="logo" />
                <button className="hamburger-menu" onClick={() => setMenuAbierto(!menuAbierto)} title="Menú">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </header>
            
            <MenuMovil isOpen={menuAbierto} onClose={() => setMenuAbierto(false)} />

            <div className="categories">
                {categorias.map(cat => (
                    <button
                        key={cat}
                        className={`cat-btn ${filtro === cat ? 'active' : ''}`}
                        data-cat={cat}
                        onClick={() => setFiltro(cat)}
                    >
                        <i className={`fas ${cat === 'Todos' ? 'fa-home' : cat === 'Playa' ? 'fa-umbrella-beach' : cat === 'Bosque' ? 'fa-tree' : 'fa-city'}`}></i>
                        {` ${cat}`}
                    </button>
                ))}
            </div>

            <div className="container">
                <div className="grid">
                    {filtradas.map(p => (
                        <div 
                            key={p.id} 
                            className="card"
                            onClick={() => setPropiedadSeleccionada(p)}
                        >
                            <div className="img-container">
                                <img src={p.img} alt={p.titulo} />
                                <div className="badge">★ {p.rating}</div>
                            </div>
                            <div className="card-info">
                                <div className="card-header">
                                    <h3>{p.ubicacion}</h3>
                                </div>
                                <p className="desc">{p.titulo}</p>
                                <p className="precio">Precio por noche</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ModalDetalle 
                propiedad={propiedadSeleccionada} 
                onClose={() => setPropiedadSeleccionada(null)}
            />
        </div>
    );
}

export default App;