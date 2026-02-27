const { createClient } = require('@supabase/supabase-js');

// Configuración
const RENDER_API = 'https://casas-api.onrender.com/api';
const SUPABASE_URL = 'https://xteghqnlmokceemoameg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_1IovWGPE0wG1AgMEWCX3Jw_fUc89xSD';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function migrarDatos() {
    try {
        console.log('Obteniendo datos de Render...');
        const response = await fetch(`${RENDER_API}/propiedades`);
        const propiedades = await response.json();

        console.log(`Encontradas ${propiedades.length} propiedades`);

        if (propiedades.length === 0) {
            console.log('No hay propiedades para migrar');
            return;
        }

        // Preparar datos para Supabase
        const datosFormateados = propiedades.map(p => ({
            titulo: p.titulo,
            ubicacion: p.ubicacion,
            descripcion: p.descripcion,
            img: p.img,
            rating: parseFloat(p.rating) || 0,
            categoria: p.categoria,
            huespedes: parseInt(p.huespedes) || 0,
            dormitorios: parseInt(p.dormitorios) || 0,
            banios: parseInt(p.banios) || 0,
            galeria: typeof p.galeria === 'string' ? JSON.parse(p.galeria || '[]') : (p.galeria || []),
            amenidades: Array.isArray(p.amenidades) ? p.amenidades.join(',') : p.amenidades,
            mapa_embed: p.mapa_embed || null
        }));

        console.log('Insertando datos en Supabase...');
        const { data, error } = await supabase
            .from('propiedades')
            .insert(datosFormateados);

        if (error) {
            console.error('Error al insertar:', error);
            return;
        }

        console.log('✅ Migración completada exitosamente!');
        console.log(`${datosFormateados.length} propiedades insertadas en Supabase`);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

migrarDatos();
