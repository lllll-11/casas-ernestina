import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xteghqnlmokceemoameg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_1IovWGPE0wG1AgMEWCX3Jw_fUc89xSD';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkSchema() {
  try {
    console.log('🔍 Verificando esquema de la tabla propiedades...\n');
    
    // Obtener una propiedad para ver sus campos
    const { data, error } = await supabase
      .from('propiedades')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error al consultar:', error.message);
      process.exit(1);
    }

    if (!data || data.length === 0) {
      console.log('⚠️  No hay propiedades. Aquí está el esquema esperado:');
      console.log(`
Columnas que debería tener la tabla "propiedades":
- id (uuid)
- titulo (text)
- categoria (text)
- precio (text) ← FALTA AGREGARSE
- rating (numeric)
- img (text)
- ubicacion (text)
- descripcion (text)
- huespedes (integer)
- dormitorios (integer)
- banios (integer)
- amenidades (text array)
- galeria (jsonb)
- mapa_embed (text)
- created_at (timestamp)

Acciones necesarias:
1. Ve a https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a SQL Editor
4. Ejecuta el archivo: add_precio_column.sql
5. Luego vuelve a intentar guardar una propiedad en el admin panel
      `);
      process.exit(0);
    }

    console.log('✅ Campos encontrados en la tabla propiedades:');
    console.log('─'.repeat(50));
    const firstRecord = data[0];
    Object.keys(firstRecord).forEach(key => {
      const value = firstRecord[key];
      const type = value === null ? 'null' : typeof value;
      console.log(`  • ${key}: ${type}`);
    });
    console.log('─'.repeat(50));

    if (!firstRecord.hasOwnProperty('precio')) {
      console.log('\n❌ El campo "precio" NO EXISTE');
      console.log('\n🔧 Para agregarlo, sigue estos pasos:');
      console.log('1. Ve a https://app.supabase.com');
      console.log('2. Selecciona tu proyecto');
      console.log('3. Ve a SQL Editor');
      console.log('4. Ejecuta este comando:');
      console.log('   ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS precio text DEFAULT \'\';');
      console.log('5. Luego recarga el admin panel en https://casas-me.com/admin');
    } else {
      console.log('\n✅ El campo "precio" ya existe');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkSchema();
