import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

function AdminPanel() {
    const [propiedades, setPropiedades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        categoria: 'Playa',
        precio: '',
        rating: '5.0',
        img: '',
        galeria: [],
        ubicacion: '',
        mapa_embed: '',
        descripcion: '',
        huespedes: 1,
        dormitorios: 1,
        banios: 1,
        amenidades: []
    });

    const API_URL = 'http://localhost:5000/api';

    // Cargar propiedades
    useEffect(() => {
        fetchPropiedades();
    }, []);

    const fetchPropiedades = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/propiedades`);
            const data = await response.json();
            setPropiedades(data);
        } catch (error) {
            console.error('Error cargando propiedades:', error);
            alert('Error al cargar propiedades');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (['huespedes', 'dormitorios', 'banios'].includes(name)) {
            setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
        } else if (name === 'amenidades') {
            setFormData(prev => ({ ...prev, [name]: value.split(',').map(a => a.trim()).filter(a => a) }));
        } else if (name === 'galeria') {
            setFormData(prev => ({ ...prev, [name]: value.split('\n').map(a => a.trim()).filter(a => a) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `${API_URL}/propiedades/${editingId}` : `${API_URL}/propiedades`;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Error al guardar');

            alert(editingId ? 'Propiedad actualizada' : 'Propiedad creada');
            resetForm();
            fetchPropiedades();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar propiedad');
        }
    };

    const handleEdit = (propiedad) => {
        setFormData(propiedad);
        setEditingId(propiedad.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar esta propiedad?')) return;

        try {
            const response = await fetch(`${API_URL}/propiedades/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Error al eliminar');

            alert('Propiedad eliminada');
            fetchPropiedades();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar propiedad');
        }
    };

    const resetForm = () => {
        setFormData({
            titulo: '',
            categoria: 'Playa',
            precio: '',
            rating: '5.0',
            img: '',
            galeria: [],
            ubicacion: '',
            mapa_embed: '',
            descripcion: '',
            huespedes: 1,
            dormitorios: 1,
            banios: 1,
            amenidades: []
        });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>🏠 Panel de Administración</h1>
                <button 
                    className="btn-nuevo"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? '✕ Cerrar' : '+ Nueva Propiedad'}
                </button>
            </header>

            {showForm && (
                <div className="form-container">
                    <h2>{editingId ? 'Editar Propiedad' : 'Crear Nueva Propiedad'}</h2>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-row">
                            <input
                                type="text"
                                name="titulo"
                                placeholder="Título"
                                value={formData.titulo}
                                onChange={handleInputChange}
                                required
                            />
                            <select
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleInputChange}
                            >
                                <option value="Playa">Playa</option>
                                <option value="Bosque">Bosque</option>
                                <option value="Ciudad">Ciudad</option>
                            </select>
                        </div>

                        <div className="form-row">
                            <input
                                type="text"
                                name="precio"
                                placeholder="Precio (ej: 2,500)"
                                value={formData.precio}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="number"
                                name="rating"
                                placeholder="Rating"
                                step="0.1"
                                min="0"
                                max="5"
                                value={formData.rating}
                                onChange={handleInputChange}
                            />
                        </div>

                        <input
                            type="url"
                            name="img"
                            placeholder="URL de imagen principal"
                            value={formData.img}
                            onChange={handleInputChange}
                            required
                        />

                        <textarea
                            name="galeria"
                            placeholder="URLs de galería (una por línea)"
                            value={formData.galeria.join('\n')}
                            onChange={handleInputChange}
                            rows="3"
                        ></textarea>

                        <div className="form-row">
                            <input
                                type="text"
                                name="ubicacion"
                                placeholder="Ubicación"
                                value={formData.ubicacion}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <textarea
                            name="descripcion"
                            placeholder="Descripción"
                            value={formData.descripcion}
                            onChange={handleInputChange}
                            rows="2"
                            required
                        ></textarea>

                        <div className="form-row">
                            <input
                                type="number"
                                name="huespedes"
                                placeholder="Huéspedes"
                                value={formData.huespedes}
                                onChange={handleInputChange}
                            />
                            <input
                                type="number"
                                name="dormitorios"
                                placeholder="Dormitorios"
                                value={formData.dormitorios}
                                onChange={handleInputChange}
                            />
                            <input
                                type="number"
                                name="banios"
                                placeholder="Baños"
                                value={formData.banios}
                                onChange={handleInputChange}
                            />
                        </div>

                        <textarea
                            name="amenidades"
                            placeholder="Amenidades (separadas por coma)"
                            value={formData.amenidades.join(', ')}
                            onChange={handleInputChange}
                            rows="2"
                        ></textarea>

                        <div className="form-buttons">
                            <button type="submit" className="btn-save">
                                {editingId ? '💾 Actualizar' : '✓ Crear'}
                            </button>
                            <button type="button" className="btn-cancel" onClick={resetForm}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <p className="loading">Cargando propiedades...</p>
            ) : (
                <div className="propiedades-list">
                    <h2>Propiedades ({propiedades.length})</h2>
                    {propiedades.length === 0 ? (
                        <p className="empty">Sin propiedades aún. Crea la primera!</p>
                    ) : (
                        <div className="cards-container">
                            {propiedades.map(prop => (
                                <div key={prop.id} className="propiedad-card">
                                    <img src={prop.img} alt={prop.titulo} className="card-img" />
                                    <div className="card-content">
                                        <h3>{prop.titulo}</h3>
                                        <p className="ubicacion">{prop.ubicacion}</p>
                                        <p className="precio">${prop.precio}</p>
                                        <div className="card-info">
                                            <span>👥 {prop.huespedes}</span>
                                            <span>🛏️ {prop.dormitorios}</span>
                                            <span>🚿 {prop.banios}</span>
                                        </div>
                                        <div className="card-actions">
                                            <button 
                                                className="btn-edit"
                                                onClick={() => handleEdit(prop)}
                                            >
                                                ✎ Editar
                                            </button>
                                            <button 
                                                className="btn-delete"
                                                onClick={() => handleDelete(prop.id)}
                                            >
                                                🗑️ Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AdminPanel;
