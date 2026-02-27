const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://xteghqnlmokceemoameg.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0ZWdocW5sbW9rY2VlbW9hbWVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzk3MDk3MCwiZXhwIjoyMDUzNTQ2OTcwfQ.lMkczz-UVfQf7L0qZc3xvUeQiGgL1Iqvd6nGlYHWnNA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function addPrecioColumn() {
  try {
    console.log('🔄 Intentando agregar columna "precio" a la tabla propiedades...');
    
    // Ejecutar SQL para agregar la columna si no existe
    const { data, error } = await supabase.rest.request({
      method: 'POST',
      path: '/query',
      body: {
        query: `ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS precio text DEFAULT '';`
      }
    });

    if (error) {
      console.error('Error:', error);
      // Si el método rest request no funciona, intentemos otra forma
      console.log('❌ Error al ejecutar SQL directo. Intentando con RPC...');
      
      // Alternativa: usar una función RPC o ejecutar manualmente
      // Por ahora, mostrar mensaje al usuario
      console.log('\n⚠️  No se pudo agregar la columna automáticamente.');
      console.log('Por favor, sigue estos pasos en https://app.supabase.com:');
      console.log('1. Ve a SQL Editor');
      console.log('2. Ejecuta este comando:');
      console.log('   ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS precio text DEFAULT \'\';');
      console.log('3. Luego ejecuta también:');
      console.log('   ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS amenidades text[] DEFAULT ARRAY[]::text[];');
      console.log('   ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS galeria jsonb DEFAULT \'[]\'::jsonb;');
      process.exit(1);
    }

    console.log('✅ Columna agregada exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addPrecioColumn();
