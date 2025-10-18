# 📺 Teleprompter Multi-Dispositivo v2.0

## 🎉 ¡Nuevas Características!

### ✅ Sistema de Roles Host/Controller/Viewer
### ✅ Sincronización en Tiempo Real
### ✅ Control Multi-Dispositivo

---

## 🚀 Inicio Rápido

### 1. Instalar y Ejecutar

```bash
npm install
./start.sh
```

### 2. Abrir en Navegador

**Tu dispositivo (Host):**
```
http://localhost:5174/
```

**Otros dispositivos:**
```
http://[TU_IP]:5174/?role=viewer
```

> La IP de red aparece al ejecutar `./start.sh`

---

## 👥 Tres Tipos de Roles

| Rol | Icono | Permisos | Ideal Para |
|-----|-------|----------|------------|
| **Host** | 👑 | Control Total | Director, Operador |
| **Controller** | 🎮 | Play/Pause/Velocidad | Asistente |
| **Viewer** | 👁️ | Solo Lectura | Actor, Presentador |

---

## 📖 Documentación Completa

- **[GUIA-ROLES.md](GUIA-ROLES.md)** → Cómo usar roles Host/Controller/Viewer
- **[SINCRONIZACION-DISPOSITIVOS.md](SINCRONIZACION-DISPOSITIVOS.md)** → Conectar múltiples dispositivos
- **[CONECTIVIDAD.md](CONECTIVIDAD.md)** → Detalles técnicos

---

## 🎯 Ejemplo de Uso

### Presentación con 3 Dispositivos

```bash
# 1. Laptop del Director (Host)
http://192.168.0.124:5174/?role=host

# 2. Tablet del Asistente (Controller)
http://192.168.0.124:5174/?role=controller

# 3. Monitor del Presentador (Viewer)
http://192.168.0.124:5174/?role=viewer
```

**Resultado:**
- Director controla todo desde laptop
- Asistente puede pausar/ajustar
- Presentador solo lee (sin controles)

---

## 🔧 Arquitectura

```
📱 Dispositivo 1 (Host)
    ↕️ WebSocket
📡 Servidor (Puerto 8080)
    ↕️ Sincronización
📱 Dispositivo 2 (Controller)
📱 Dispositivo 3 (Viewer)
```

**Tecnologías:**
- React + TypeScript + Vite
- WebSocket + BroadcastChannel
- TailwindCSS + Lucide Icons

---

## 📝 Comandos

```bash
# Iniciar todo
./start.sh

# Solo WebSocket
npm run ws-server

# Solo Vite
npm run dev
```

---

## ⚡ Características

- ✅ Sincronización automática Play/Pause/Velocidad/Posición
- ✅ Control de permisos por rol
- ✅ Código QR para conectar dispositivos
- ✅ Modo espejo (horizontal/vertical)
- ✅ Timer integrado
- ✅ Sin servidor cloud (todo local)

---

## 🐛 Problemas Comunes

**❌ No puedo controlar**
→ Cambia tu rol a Controller o Host

**❌ No se conecta**
→ Verifica misma red WiFi

**❌ Puerto ocupado**
→ `lsof -ti:8080 | xargs kill -9`

---

## 📞 Soporte

Issues: [github.com/4ailabs/teleprompter-](https://github.com/4ailabs/teleprompter-)

---

¡Disfruta tu teleprompter profesional! 🎬
