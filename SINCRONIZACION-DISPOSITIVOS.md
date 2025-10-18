# 🔄 Sincronización Entre Dispositivos

## Guía Completa para Conectar Múltiples Dispositivos

### 🎯 ¿Qué está sincronizado?

Cuando conectas múltiples dispositivos, estos estados se comparten en tiempo real:

- ▶️ **Play/Pause** - Controla la reproducción desde cualquier dispositivo
- ⚡ **Velocidad** - Ajusta la velocidad y todos los dispositivos se actualizan
- 📍 **Posición** - El scroll se sincroniza en todos los dispositivos

---

## 🚀 Opción 1: Múltiples Pestañas (Mismo Dispositivo)

### Funcionamiento Automático
✅ **No requiere configuración**
✅ **Sincronización instantánea**
✅ **Funciona offline**

### Pasos:
1. Abre la app en tu navegador
2. Abre otra pestaña con la misma URL
3. ¡Listo! Se sincronizan automáticamente

### Casos de uso:
- Control en una pestaña, visualización en pantalla completa en otra
- Monitor para el operador y pantalla para el actor
- Backup en tiempo real

---

## 📱 Opción 2: Múltiples Dispositivos (Misma Red WiFi)

### Requisitos:
✅ Todos los dispositivos en la **misma red WiFi**
✅ Servidor WebSocket ejecutándose
✅ Firewall permitiendo conexiones locales

### Paso a Paso:

#### 1️⃣ Iniciar los Servidores

**Opción A - Script Automático (Recomendado):**
```bash
./start.sh
```

**Opción B - Manual:**
```bash
# Terminal 1 - Servidor WebSocket
npm run ws-server

# Terminal 2 - Servidor Vite
npm run dev
```

#### 2️⃣ Identificar tu IP de Red Local

Cuando ejecutes `./start.sh` o `npm run dev`, verás algo como:

```
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/  ⬅️ Esta es tu IP de red
```

Y el servidor WebSocket mostrará:

```
🚀 Servidor WebSocket Iniciado
================================
📡 Puerto: 8080
🌐 Red Local: ws://192.168.1.100:8080  ⬅️ Esta es la IP WebSocket
💻 Localhost: ws://localhost:8080
================================
```

#### 3️⃣ Conectar desde Otro Dispositivo

**Método 1 - Código QR (Más Fácil):**
1. En el dispositivo principal, haz clic en el botón WiFi (📶)
2. Aparecerá un código QR
3. Escanéalo con tu móvil/tablet
4. Se abrirá la app automáticamente

**Método 2 - URL Manual:**
1. Anota la IP de red (ej: `http://192.168.1.100:5173`)
2. En el otro dispositivo, abre el navegador
3. Ingresa la URL completa
4. ¡Listo!

#### 4️⃣ Verificar Conexión

En el panel de Control Remoto (botón WiFi), verás:

- ✅ **Estado:** Conectado (verde) / Desconectado (rojo)
- 🔢 **Dispositivos:** Número de dispositivos sincronizados
- ⏰ **Última Sincronización:** Timestamp de la última actualización

---

## 🛠️ Arquitectura Técnica

### Cómo Funciona

```
┌─────────────────────────────────────────────────────────────┐
│                    SINCRONIZACIÓN                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Dispositivo 1           Servidor WS          Dispositivo 2  │
│  ┌──────────┐           ┌──────────┐           ┌──────────┐ │
│  │ Browser  │◄─────────►│ Port 8080│◄─────────►│ Browser  │ │
│  └──────────┘           └──────────┘           └──────────┘ │
│       │                                               │      │
│       │ Play/Pause/Speed/Position                     │      │
│       │                                               │      │
│       └───────────────────┬───────────────────────────┘      │
│                           │                                  │
│                    Sincronización                            │
│                    en Tiempo Real                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Tecnologías:

1. **BroadcastChannel API** - Sincronización entre pestañas
2. **WebSocket** - Sincronización entre dispositivos
3. **React Hooks** - Gestión de estado compartido

---

## 🔧 Solución de Problemas

### ❌ No puedo conectarme desde otro dispositivo

**Posibles causas:**

1. **Dispositivos en redes diferentes**
   - ✅ Verifica que ambos estén en la misma WiFi
   - ✅ Desactiva VPNs temporalmente

2. **Firewall bloqueando conexiones**
   - ✅ En Mac: System Preferences → Security → Firewall → Allow
   - ✅ En Windows: Windows Defender → Allow app through firewall

3. **URL incorrecta**
   - ❌ No uses `localhost` desde otro dispositivo
   - ✅ Usa la IP de red local (ej: `192.168.1.100`)

### ❌ El servidor WebSocket no inicia

```bash
# Verifica que el puerto 8080 no esté en uso
lsof -i :8080

# Si está en uso, mata el proceso
kill -9 <PID>

# O cambia el puerto en server/websocket-server.js
const PORT = 8081; // Cambia a otro puerto
```

### ❌ La sincronización es lenta

1. **Verifica la calidad de tu WiFi**
   - Usa WiFi 5GHz si es posible
   - Acércate al router

2. **Reduce la carga de red**
   - Cierra otras apps que usen la red
   - Detén descargas/streaming

### ❌ Los dispositivos se desconectan

1. **Revisa que el servidor WebSocket esté corriendo**
   ```bash
   # Verifica que esté activo
   ps aux | grep websocket-server
   ```

2. **Revisa la consola del navegador**
   - Presiona F12 → Console
   - Busca errores de WebSocket

---

## 📊 Monitoreo y Debugging

### Ver Logs del Servidor WebSocket

El servidor muestra logs en tiempo real:

```
✅ Cliente conectado: client-1 (Total: 1)
🔄 Sincronizando desde device-abc123: true...
❌ Cliente desconectado: client-1 (Total: 0)
```

### Ver Logs del Cliente (Navegador)

Abre la consola del navegador (F12) y verás:

```
✅ WebSocket conectado
🔄 Sincronizando: isPlaying = true
⚠️  WebSocket desconectado - intentando reconectar...
```

---

## 🎭 Casos de Uso Reales

### 1. Teatro / Obra
- **Operador:** Control desde laptop backstage
- **Actor:** Visualización en tablet/monitor grande
- **Director:** Monitoreo desde teléfono

### 2. Presentación
- **Presentador:** Control desde teléfono en el bolsillo
- **Pantalla:** Teleprompter grande frente al público
- **Asistente:** Backup control desde tablet

### 3. Grabación de Video
- **Talento:** Lee desde monitor principal
- **Director:** Controla velocidad desde teléfono
- **Cámara:** Monitorea progreso desde tablet

---

## 🚀 Mejoras Futuras (Próximas Versiones)

### Planeadas:
- [ ] Sincronización vía internet (no solo red local)
- [ ] Roles de usuario (admin, viewer, controller)
- [ ] Historial de cambios
- [ ] Control por voz
- [ ] Integración con dispositivos físicos (pedales, controles)

---

## 📝 Comandos Rápidos

```bash
# Iniciar todo (servidor WS + Vite)
./start.sh

# Solo servidor WebSocket
npm run ws-server

# Solo servidor Vite
npm run dev

# Hacer ejecutable el script
chmod +x start.sh

# Ver IP de tu red local (Mac/Linux)
ifconfig | grep "inet " | grep -v 127.0.0.1

# Ver IP de tu red local (Windows)
ipconfig
```

---

## ✅ Checklist de Conexión

Antes de empezar, asegúrate de:

- [ ] Ambos dispositivos en la **misma red WiFi**
- [ ] Servidor WebSocket **ejecutándose** (puerto 8080)
- [ ] Servidor Vite **ejecutándose** (puerto 5173+)
- [ ] Firewall **permitiendo** conexiones locales
- [ ] Usando la **IP de red** (no localhost) en el segundo dispositivo
- [ ] Browser **moderno** (Chrome, Firefox, Safari, Edge)

---

## 🆘 Soporte

Si tienes problemas:

1. **Revisa los logs** de ambos servidores
2. **Abre la consola** del navegador (F12)
3. **Verifica la red** con `ping` entre dispositivos
4. **Reinicia** los servidores si es necesario

---

¡Disfruta de tu teleprompter multi-dispositivo! 🎉
