-- Agregar columnas faltantes a la tabla propiedades. Ejecuta esto en Supabase SQL Editor

ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS precio text DEFAULT '';

-- Verificar que la columna se agregó correctamente
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'propiedades' 
ORDER BY ordinal_position;
