import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import { supabase } from './supabaseClient';

/* ================================================================
   CASAS MARIA ERNESTINA — Complete Rebuild from Scratch
   Warm Editorial Luxury Layout
   ================================================================ */

// ─────────────── LIGHTBOX ───────────────
function Lightbox({ imagenes, indiceInicial, onClose }) {
  const [idx, setIdx] = useState(indiceInicial);

  const next = useCallback(() => setIdx(i => (i + 1) % imagenes.length), [imagenes.length]);
  const prev = useCallback(() => setIdx(i => (i - 1 + imagenes.length) % imagenes.length), [imagenes.length]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev, onClose]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={e => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}>✕</button>
        <img src={imagenes[idx]} alt={`Galería ${idx + 1}`} className="lightbox-img" />
        <div className="lightbox-info">
          <span>{idx + 1} / {imagenes.length}</span>
        </div>
        <button className="lightbox-btn lightbox-prev" onClick={prev}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="lightbox-btn lightbox-next" onClick={next}>
          <i className="fas fa-chevron-right"></i>
        </button>
        <div className="lightbox-thumbnails">
          {imagenes.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Mini ${i + 1}`}
              className={`lightbox-thumb ${i === idx ? 'active' : ''}`}
              onClick={() => setIdx(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────── MODAL DETALLE ───────────────
function ModalDetalle({ propiedad, onClose }) {
  const [lightboxIdx, setLightboxIdx] = useState(null);

  if (!propiedad) return null;

  const galeria = Array.isArray(propiedad.galeria) ? propiedad.galeria : [];

  let amenidades = [];
  if (Array.isArray(propiedad.amenidades)) {
    amenidades = propiedad.amenidades
      .map(a => typeof a === 'string' ? a.trim().replace(/["[\]]/g, '') : a)
      .filter(a => a && a.length > 0);
  } else if (typeof propiedad.amenidades === 'string' && propiedad.amenidades) {
    amenidades = propiedad.amenidades
      .split(',')
      .map(a => a.trim().replace(/["[\]]/g, ''))
      .filter(a => a && a.length > 0);
  }

  const mapaEmbed = propiedad.mapa_embed || '';
  const srcMatch = mapaEmbed.match(/src="([^"]+)"/);
  const mapSrc = srcMatch ? srcMatch[1] : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        {/* Hero Image */}
        <div className="modal-hero-section">
          <img src={propiedad.img} alt={propiedad.titulo} />
          <div className="modal-hero-gradient" />
          <div className="modal-hero-info">
            <span className="modal-category-badge">{propiedad.categoria}</span>
            <h1>{propiedad.titulo}</h1>
            <p className="modal-hero-location">
              <i className="fas fa-map-marker-alt"></i> {propiedad.ubicacion}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="modal-layout">

            {/* Main Content */}
            <div className="modal-main">
              <h3>Sobre esta propiedad</h3>
              <p className="modal-description">{propiedad.descripcion}</p>

              <h3>Distribución</h3>
              <div className="modal-info-grid">
                <div className="modal-info-card">
                  <i className="fas fa-users"></i>
                  <div className="info-value">{propiedad.huespedes}</div>
                  <div className="info-label">Huéspedes</div>
                </div>
                <div className="modal-info-card">
                  <i className="fas fa-bed"></i>
                  <div className="info-value">{propiedad.dormitorios}</div>
                  <div className="info-label">Dormitorios</div>
                </div>
                <div className="modal-info-card">
                  <i className="fas fa-bath"></i>
                  <div className="info-value">{propiedad.banios}</div>
                  <div className="info-label">Baños</div>
                </div>
              </div>

              {amenidades.length > 0 && (
                <div className="modal-amenities">
                  <h3>Amenidades</h3>
                  <ul className="amenities-list">
                    {amenidades.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
              )}

              {galeria.length > 0 && (
                <div className="modal-gallery">
                  <h3>Galería</h3>
                  <div className="gallery-grid">
                    {galeria.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`${propiedad.titulo} ${i + 1}`}
                        onClick={() => setLightboxIdx(i)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="modal-sidebar">
              <div className="booking-card">
                <div className="booking-rating">
                  <span className="star">★</span>
                  <span>{propiedad.rating || '5.0'}</span>
                  <span className="rating-text">· Valoración de huéspedes</span>
                </div>

                <a
                  href={`https://wa.me/529711924204?text=Hola,%20estoy%20interesado%20en%20reservar%20${encodeURIComponent(propiedad.titulo)}%20en%20${encodeURIComponent(propiedad.ubicacion)}.%20¿Cuál%20es%20la%20disponibilidad?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp"
                >
                  <i className="fab fa-whatsapp"></i> Consultar Disponibilidad
                </a>
              </div>

              <div className="map-card">
                <h3>Ubicación</h3>
                <div className="map-container">
                  {mapSrc ? (
                    <iframe
                      title={`Mapa de ${propiedad.ubicacion}`}
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      loading="lazy"
                      src={mapSrc}
                    />
                  ) : (
                    <p className="no-map-text">Mapa no disponible</p>
                  )}
                </div>
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(propiedad.ubicacion)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-map-link"
                >
                  <i className="fas fa-location-arrow"></i> Ver en Google Maps
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {lightboxIdx !== null && (
        <Lightbox
          imagenes={galeria}
          indiceInicial={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </div>
  );
}


// ─────────────── MAIN APP ───────────────
function App() {
  const [filtro, setFiltro] = useState('Todos');
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [propiedades, setPropiedades] = useState([]);
  const [heroIdx, setHeroIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const headerRef = useRef(null);

  const categorias = ['Todos', 'Playa', 'Bosque', 'Ciudad'];

  // ── Fetch properties from Supabase ──
  useEffect(() => {
    const fetchPropiedades = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('propiedades').select('*');
        if (error) throw error;

        const processed = (data || []).map(p => ({
          ...p,
          galeria: typeof p.galeria === 'string' ? JSON.parse(p.galeria || '[]') : (p.galeria || []),
          amenidades: typeof p.amenidades === 'string'
            ? (p.amenidades.trim() === '' ? [] : p.amenidades.split(',').map(a => a.trim()).filter(Boolean))
            : (Array.isArray(p.amenidades) ? p.amenidades : [])
        }));
        setPropiedades(processed);
      } catch (err) {
        console.error('Error cargando propiedades:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPropiedades();
  }, []);

  // ── Hero carousel rotation ──
  useEffect(() => {
    if (propiedades.length === 0) return;
    const interval = setInterval(() => {
      setHeroIdx(i => (i + 1) % Math.min(propiedades.length, 5));
    }, 7000);
    return () => clearInterval(interval);
  }, [propiedades.length]);

  // ── Header scroll detection ──
  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Lock body scroll when modal or menu is open ──
  useEffect(() => {
    document.body.style.overflow = (propiedadSeleccionada || menuAbierto) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [propiedadSeleccionada, menuAbierto]);

  const filtradas = filtro === 'Todos'
    ? propiedades
    : propiedades.filter(p => p.categoria === filtro);

  const heroPropiedades = propiedades.slice(0, 5);

  const scrollToSection = (id) => {
    setMenuAbierto(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="main-content">

      {/* ═══════════════════ HEADER ═══════════════════ */}
      <header ref={headerRef} className={`site-header ${headerScrolled ? 'scrolled' : ''}`}>
        <div className="header-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src="/logo-nombre.png" alt="Maria Ernestina" />
          <div className="header-logo-text">
            <span className="header-brand">Maria Ernestina</span>
            <span className="header-tagline">Casas Vacacionales</span>
          </div>
        </div>

        <nav className="header-nav">
          <a href="#catalogo" className="header-nav-link">Propiedades</a>
          <a href="#filosofia" className="header-nav-link">Nosotros</a>
          <a href="#servicios" className="header-nav-link">Servicios</a>
          <a href="#contacto" className="header-nav-link">Contacto</a>
        </nav>

        <button
          className="header-hamburger"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Menú"
        >
          <span></span>
          <span></span>
        </button>
      </header>

      {/* ═══════════════════ MOBILE MENU ═══════════════════ */}
      {menuAbierto && <div className="mobile-overlay" onClick={() => setMenuAbierto(false)} />}
      <nav className={`mobile-menu ${menuAbierto ? 'open' : ''}`}>
        <button className="mobile-menu-close" onClick={() => setMenuAbierto(false)}>✕</button>
        <div className="mobile-menu-body">
          <div className="mobile-menu-links">
            <a href="#catalogo" onClick={() => scrollToSection('catalogo')}>Propiedades</a>
            <a href="#filosofia" onClick={() => scrollToSection('filosofia')}>Nuestra Filosofía</a>
            <a href="#servicios" onClick={() => scrollToSection('servicios')}>Servicios</a>
            <a href="#contacto" onClick={() => scrollToSection('contacto')}>Contacto</a>
          </div>
          <div className="mobile-menu-contact">
            <h4>Contacto Directo</h4>
            <a href="tel:+529711924204" className="mobile-contact-row">
              <i className="fas fa-phone"></i> +52 971-192-4204
            </a>
            <a href="https://wa.me/529711924204" target="_blank" rel="noopener noreferrer" className="mobile-contact-row">
              <i className="fab fa-whatsapp"></i> Chat por WhatsApp
            </a>
          </div>
        </div>
      </nav>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="hero">
        <div className="hero-bg-slider">
          {heroPropiedades.map((p, i) => (
            <div key={p.id} className={`hero-bg-slide ${i === heroIdx ? 'active' : ''}`}>
              <img src={p.img} alt={p.titulo} />
            </div>
          ))}
          {heroPropiedades.length === 0 && (
            <div className="hero-bg-slide active" style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)' }} />
          )}
        </div>
        <div className="hero-gradient" />

        <div className="hero-content">
          <h1 className="hero-title">
            Tu próxima <em>escapada</em><br />comienza aquí
          </h1>
          <div className="hero-actions">
            <a href="#catalogo" className="btn-hero-primary">
              Ver Casas <i className="fas fa-arrow-right"></i>
            </a>
            <a href="https://wa.me/529711924204" target="_blank" rel="noopener noreferrer" className="btn-hero-outline">
              <i className="fab fa-whatsapp"></i> Reservar por WhatsApp
            </a>
          </div>
        </div>

        {heroPropiedades.length > 1 && (
          <div className="hero-indicators">
            {heroPropiedades.map((_, i) => (
              <button
                key={i}
                className={`hero-dot ${i === heroIdx ? 'active' : ''}`}
                onClick={() => setHeroIdx(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        <div className="hero-scroll-hint">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ═══════════════════ FILOSOFÍA ═══════════════════ */}
      <section className="philosophy" id="filosofia">
        <div className="philosophy-grid">
          <div className="philosophy-left">
            <span className="section-eyebrow">Sobre Nosotros</span>
            <blockquote className="philosophy-quote">
              "Casas cómodas y bien equipadas para que disfrutes tus vacaciones sin preocupaciones."
            </blockquote>
          </div>
          <div className="philosophy-right">
            {propiedades.length > 0 ? (
              <img
                src={propiedades[0]?.img}
                alt="Propiedad destacada"
                className="philosophy-image"
              />
            ) : (
              <div className="philosophy-image" style={{ background: 'var(--cream)' }} />
            )}
            <div className="philosophy-accent-box">
              <div className="accent-number">{propiedades.length}+</div>
              <div className="accent-label">Casas para Rentar</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CATÁLOGO ═══════════════════ */}
      <section className="catalog" id="catalogo">
        <div className="catalog-inner">
          <div className="section-intro">
            <span className="section-eyebrow">Nuestras Casas</span>
            <h2 className="section-heading">Casas Disponibles</h2>
            <p className="section-desc">
              Encuentra la casa perfecta para tus próximas vacaciones.
            </p>
          </div>

          <div className="filter-bar">
            {categorias.map(cat => (
              <button
                key={cat}
                className={`filter-pill ${filtro === cat ? 'active' : ''}`}
                onClick={() => setFiltro(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="catalog-loader">
              <div className="loader-spinner" />
              <p>Cargando colección...</p>
            </div>
          ) : (
            <div className="property-grid">
              {filtradas.length === 0 ? (
                <div className="catalog-empty">
                  <p>No se encontraron propiedades en esta categoría.</p>
                </div>
              ) : (
                filtradas.map((p, i) => (
                  <div
                    key={p.id}
                    className="property-card"
                    onClick={() => setPropiedadSeleccionada(p)}
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <div className="property-card-image">
                      <img src={p.img} alt={p.titulo} loading="lazy" />
                      <span className="property-card-badge">{p.categoria}</span>
                      <span className="property-card-rating">
                        <span className="star">★</span> {p.rating || '5.0'}
                      </span>
                    </div>

                    <div className="property-card-body">
                      <div className="property-card-meta">
                        <span className="property-card-category">{p.categoria}</span>
                      </div>
                      <h3 className="property-card-title">{p.titulo}</h3>
                      <p className="property-card-location">
                        <i className="fas fa-map-marker-alt"></i> {p.ubicacion}
                      </p>
                      <div className="property-card-divider" />
                      <div className="property-card-specs">
                        <span className="property-spec">
                          <i className="fas fa-users"></i> {p.huespedes}
                        </span>
                        <span className="property-spec">
                          <i className="fas fa-bed"></i> {p.dormitorios}
                        </span>
                        <span className="property-spec">
                          <i className="fas fa-bath"></i> {p.banios}
                        </span>
                      </div>
                      <div className="property-card-cta">
                        <span className="property-cta-text">
                          Ver Detalles <i className="fas fa-arrow-right"></i>
                        </span>
                        <span className="property-cta-arrow">
                          <i className="fas fa-arrow-right"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════ SERVICIOS ═══════════════════ */}
      <section className="services" id="servicios">
        <div className="services-inner">
          <div className="section-intro">
            <span className="section-eyebrow">Servicios Premium</span>
            <h2 className="section-heading">Experiencias Exclusivas</h2>
            <p className="section-desc">
              Complementamos tu estancia con servicios de primer nivel para una experiencia memorable.
            </p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-crown"></i>
              </div>
              <h3>Residencias de Lujo</h3>
              <p>Curaduría rigurosa de villas y lofts con arquitectura contemporánea y vistas paradisíacas.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-concierge-bell"></i>
              </div>
              <h3>Concierge 24/7</h3>
              <p>Atención dedicada para organizar tours, reservas y solicitudes especiales durante tu estancia.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-utensils"></i>
              </div>
              <h3>Chef Privado</h3>
              <p>Experiencias gastronómicas de autor en tu residencia, preparadas por chefs locales reconocidos.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-spa"></i>
              </div>
              <h3>Bienestar & Spa</h3>
              <p>Masajes, yoga privado y tratamientos de spa coordinados directamente en tu villa.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CONTACTO ═══════════════════ */}
      <section className="contact" id="contacto">
        <div className="contact-inner">
          <div className="contact-grid">
            <div className="contact-info">
              <span className="section-eyebrow">Contacto</span>
              <h2 className="section-heading">¿Quieres reservar?</h2>
              <p className="section-desc">
                Escríbenos directo por WhatsApp o llámanos. 
                Te respondemos de inmediato.
              </p>

              <div className="contact-channels">
                <a href="tel:+529711924204" className="contact-channel">
                  <div className="contact-channel-icon">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <span>+52 971-192-4204</span>
                </a>
                <a href="https://wa.me/529711924204" target="_blank" rel="noopener noreferrer" className="contact-channel">
                  <div className="contact-channel-icon">
                    <i className="fab fa-whatsapp"></i>
                  </div>
                  <span>Hablar por WhatsApp</span>
                </a>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-brand">
              <h4>Maria Ernestina</h4>
              <p>Renta de casas vacacionales por noche en los mejores destinos de México.</p>
              <div className="footer-social">
                <a href="https://wa.me/529711924204" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <i className="fab fa-whatsapp"></i>
                </a>
                <a href="tel:+529711924204" aria-label="Teléfono">
                  <i className="fas fa-phone"></i>
                </a>
              </div>
            </div>
            <div className="footer-column">
              <h5>Casas</h5>
              <ul>
                <li><a href="#catalogo">Todas las Casas</a></li>
                <li><a href="#catalogo">Destinos de Playa</a></li>
                <li><a href="#catalogo">Destinos de Bosque</a></li>
                <li><a href="#catalogo">Propiedades de Ciudad</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h5>Contacto</h5>
              <ul>
                <li><a href="tel:+529711924204"><i className="fas fa-phone"></i> +52 971-192-4204</a></li>
                <li><a href="https://wa.me/529711924204" target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp"></i> Chat WhatsApp</a></li>
                <li><span>Oaxaca & Nayarit, México</span></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Casas Maria Ernestina. Todos los derechos reservados.</p>
            <span className="footer-credits">Casas Vacacionales</span>
          </div>
        </div>
      </footer>

      {/* ═══════════════════ WHATSAPP FLOAT ═══════════════════ */}
      <a
        href="https://wa.me/529711924204"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="WhatsApp"
      >
        <i className="fab fa-whatsapp"></i>
      </a>

      {/* ═══════════════════ MODAL ═══════════════════ */}
      <ModalDetalle
        propiedad={propiedadSeleccionada}
        onClose={() => setPropiedadSeleccionada(null)}
      />
    </div>
  );
}

export default App;