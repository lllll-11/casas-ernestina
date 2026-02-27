#!/bin/bash
# Script para deploy en Netlify
# Uso: bash deploy.sh

echo "🚀 Preparando deploy en Netlify..."

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Verificar que Git está limpio
echo "📝 Verificando estado de Git..."
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}❌ Hay cambios sin commitear${NC}"
    echo "Haz git status para ver los cambios"
    exit 1
fi
echo -e "${GREEN}✅ Git está limpio${NC}"

# 2. Ejecutar build
echo ""
echo "🔨 Ejecutando build..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build falló${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build exitoso${NC}"

# 3. Verificar carpeta build
echo ""
echo "📦 Verificando carpeta build..."
if [ ! -d "build" ]; then
    echo -e "${RED}❌ Carpeta build no existe${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Carpeta build lista${NC}"

# 4. Deploy con Netlify CLI
echo ""
echo "🌐 Iniciando deploy a Netlify..."
netlify deploy --prod --dir=build

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Deploy completado exitosamente!${NC}"
    echo ""
    echo "📊 Próximos pasos:"
    echo "- Verifica en https://app.netlify.com"
    echo "- Comprueba que el sitio se ve correcto"
    echo "- Prueba el panel admin en /admin"
else
    echo ""
    echo -e "${RED}❌ Deploy falló${NC}"
    exit 1
fi
