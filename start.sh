#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Teleprompter Multi-Dispositivo v2.0     ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""

# Función para limpiar procesos al salir
cleanup() {
    echo -e "\n${YELLOW}🛑 Deteniendo servidores...${NC}"
    kill $WS_PID 2>/dev/null
    kill $VITE_PID 2>/dev/null
    echo -e "${GREEN}✅ Servidores detenidos${NC}"
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT SIGTERM

# Iniciar servidor WebSocket
echo -e "${BLUE}🚀 Iniciando servidor WebSocket...${NC}"
node server/websocket-server.js &
WS_PID=$!
sleep 2

# Iniciar servidor Vite
echo -e "${BLUE}🚀 Iniciando servidor Vite...${NC}"
npm run dev &
VITE_PID=$!

echo ""
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}   ✅ Servidores iniciados correctamente   ${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}📱 Para conectar desde otro dispositivo:${NC}"
echo -e "   1. Abre el navegador en el otro dispositivo"
echo -e "   2. Usa la IP de red que aparece arriba"
echo -e "   3. Haz clic en el botón WiFi en la app"
echo ""
echo -e "${YELLOW}⌨️  Presiona Ctrl+C para detener los servidores${NC}"
echo ""

# Esperar a que los procesos terminen
wait
