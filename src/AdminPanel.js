import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import { supabase } from './supabaseClient';

function AdminPanel() {
    const [propiedades, setPropiedades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        categoria: 'Playa',
        rating: 5.0,
        img: '',
        galeria: [],
        ubicacion: '',
        mapa_embed: '',
        descripcion: '',
        huespedes: 1,
        dormitorios: 1,
        banios: 1,
        amenidades: ''
    });

    // Cargar propiedades desde Supabase
    useEffect(() => {
        fetchPropiedades();
    }, []);

    const fetchPropiedades = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('propiedades')
                .select('*');
            
            if (error) throw error;
            setPropiedades(data || []);
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
            setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) }));
        } else if (name === 'rating') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
        } else if (name === 'galeria') {
            setFormData(prev => ({ ...prev, [name]: value.split('\n').map(a => a.trim()).filter(a => a) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convertir string de amenidades a array
            const amenidadesArray = formData.amenidades
                .split(',')
                .map(a => a.trim())
                .filter(a => a);

            const dataToSave = {
                titulo: formData.titulo,
                categoria: formData.categoria,
                rating: parseFloat(formData.rating),
                img: formData.img,
                galeria: formData.galeria,
                ubicacion: formData.ubicacion,
                mapa_embed: formData.mapa_embed,
                descripcion: formData.descripcion,
                huespedes: parseInt(formData.huespedes, 10),
                dormitorios: parseInt(formData.dormitorios, 10),
                banios: parseInt(formData.banios, 10),
                amenidades: amenidadesArray
            };

            if (editingId) {
                const { error } = await supabase
                    .from('propiedades')
                    .update(dataToSave)
                    .eq('id', editingId);
                
                if (error) throw error;
                alert('Propiedad actualizada');
            } else {
                const { error } = await supabase
                    .from('propiedades')
                    .insert([dataToSave]);
                
                if (error) throw error;
                alert('Propiedad creada');
            }

            resetForm();
            fetchPropiedades();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar propiedad: ' + error.message);
        }
    };

    const handleEdit = (propiedad) => {
        // Convertir array de amenidades a string separado por comas
        const amenidadesString = Array.isArray(propiedad.amenidades)
            ? propiedad.amenidades.join(', ')
            : (propiedad.amenidades || '');

        setFormData({
            titulo: propiedad.titulo,
            categoria: propiedad.categoria,
            rating: propiedad.rating,
            img: propiedad.img,
            galeria: propiedad.galeria || [],
            ubicacion: propiedad.ubicacion,
            mapa_embed: propiedad.mapa_embed,
            descripcion: propiedad.descripcion,
            huespedes: propiedad.huespedes,
            dormitorios: propiedad.dormitorios,
            banios: propiedad.banios,
            amenidades: amenidadesString
        });
        setEditingId(propiedad.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar esta propiedad?')) return;

        try {
            const { error } = await supabase
                .from('propiedades')
                .delete()
                .eq('id', id);

            if (error) throw error;

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
            rating: 5.0,
            img: '',
            galeria: [],
            ubicacion: '',
            mapa_embed: '',
            descripcion: '',
            huespedes: 1,
            dormitorios: 1,
            banios: 1,
            amenidades: ''
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
                            value={formData.amenidades}
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
                                        <p className="rating">⭐ {prop.rating}</p>
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
