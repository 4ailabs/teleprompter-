# 🚀 Guía de Deployment en Vercel

## ⚠️ Limitaciones en Vercel

Vercel es una plataforma **serverless**, lo que significa:

- ✅ **Funciona:** Sincronización entre pestañas del mismo navegador
- ❌ **NO funciona:** Sincronización entre dispositivos diferentes (WebSocket)

### ¿Por qué?

Vercel no soporta conexiones WebSocket persistentes. El servidor WebSocket requiere un proceso que esté siempre corriendo, lo cual no es posible en plataformas serverless.

---

## 🎯 Qué SÍ Funciona en Vercel

### ✅ Sincronización Multi-Pestaña

En Vercel, la app funciona perfectamente para:

1. **Múltiples pestañas en el mismo navegador**
   - Abre la app en varias pestañas
   - Todos los cambios se sincronizan automáticamente
   - Usa BroadcastChannel API (sin servidor necesario)

2. **Múltiples ventanas del navegador**
   - Igual que pestañas
   - Funciona en el mismo dispositivo

3. **Sistema de Roles**
   - Host, Controller, Viewer funcionan normalmente
   - Los permisos se aplican correctamente

### ✅ Todas las Funcionalidades Core

- ▶️ Teleprompter con scroll automático
- ⚙️ Configuración (fuente, colores, velocidad)
- 📝 Editor de script
- 🎭 Modo espejo
- ⏱️ Timer
- 👥 Roles (Host/Controller/Viewer)

---

## 🚀 Cómo Deployar en Vercel

### Opción 1: Deploy con CLI

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Deploy a producción
vercel --prod
```

### Opción 2: Deploy con GitHub

1. **Conecta tu repo a Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Click en "New Project"
   - Importa tu repositorio de GitHub

2. **Configuración automática:**
   - Vercel detecta automáticamente Vite
   - No necesitas configurar nada más

3. **Deploy:**
   - Cada push a `main` hace deploy automático
   - Pull requests generan preview deployments

---

## 📋 Configuración Incluida

El archivo `vercel.json` ya está configurado:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_WS_ENABLED": "false"
  }
}
```

Esto:
- ✅ Deshabilita WebSocket automáticamente en producción
- ✅ Configura el build correcto
- ✅ Configura rewrites para SPA

---

## 🔧 Alternativas para Sincronización Multi-Dispositivo

Si necesitas sincronización entre dispositivos diferentes en producción:

### Opción 1: Usar un Servidor Separado

Deploy la app en Vercel + servidor WebSocket en otro lado:

**Servicios compatibles con WebSocket:**
- Railway
- Render
- DigitalOcean App Platform
- Heroku
- AWS EC2
- VPS (Linode, DigitalOcean Droplets)

**Configuración:**
1. Deploy el servidor WebSocket (`server/websocket-server.js`) en Railway/Render
2. Obtén la URL WebSocket (ej: `wss://tu-app.railway.app`)
3. Configura variable de entorno en Vercel:
   ```
   VITE_WS_ENABLED=true
   VITE_WS_URL=wss://tu-app.railway.app
   ```

### Opción 2: Usar Servicios de WebSocket Managed

**Alternativas:**
- **Pusher** - WebSocket como servicio
- **Ably** - Real-time messaging
- **Socket.io** con adaptador Redis
- **Supabase Realtime** - Database + WebSocket

### Opción 3: Usar Vercel con Edge Functions (Próximamente)

Vercel está trabajando en soporte para WebSocket en Edge Functions. Esto permitirá conexiones persistentes en el futuro.

---

## 🧪 Testing Local vs Producción

### Desarrollo Local

```bash
./start.sh
```

- ✅ WebSocket habilitado
- ✅ Sincronización entre dispositivos
- ✅ Sincronización entre pestañas

### Build de Producción (Simular Vercel)

```bash
# Build
npm run build

# Preview (simula producción)
npm run preview
```

- ❌ WebSocket deshabilitado
- ✅ Sincronización entre pestañas
- ℹ️ Igual que en Vercel

---

## 📊 Comparación de Deployment

| Característica | Vercel | Railway/Render | VPS |
|----------------|--------|----------------|-----|
| Multi-pestaña | ✅ | ✅ | ✅ |
| Multi-dispositivo | ❌ | ✅ | ✅ |
| Deploy automático | ✅ | ✅ | ❌ |
| Gratis | ✅ | ✅ Limitado | ❌ |
| Serverless | ✅ | ❌ | ❌ |
| Setup | Fácil | Medio | Difícil |

---

## 🎯 Casos de Uso por Plataforma

### Usa Vercel si:
- ✅ Solo necesitas multi-pestaña
- ✅ Quieres deploy automático desde GitHub
- ✅ No necesitas sincronización entre dispositivos
- ✅ Quieres hosting gratis y rápido

**Escenarios:**
- Presentador usando múltiples monitores
- Control desde varias ventanas del navegador
- Backup en tiempo real en el mismo dispositivo

### Usa Railway/Render si:
- ✅ Necesitas sincronización entre dispositivos
- ✅ Quieres WebSocket persistente
- ✅ Tienes presupuesto ($5-10/mes)

**Escenarios:**
- Director en laptop + Actor en tablet
- Múltiples operadores en diferentes dispositivos
- Control remoto desde teléfono

### Usa VPS si:
- ✅ Necesitas control total
- ✅ Vas a escalar a muchos usuarios
- ✅ Tienes conocimientos técnicos

---

## 🛠️ Troubleshooting en Vercel

### Error: "WebSocket connection failed"

**Esperado en Vercel.** La app funciona normalmente con BroadcastChannel.

**Solución:** No hay error real, solo usa multi-pestaña en lugar de multi-dispositivo.

### Error: Build failed

```bash
# Verifica el build local
npm run build

# Si funciona local, verifica variables de entorno en Vercel
```

### Error: App no carga

**Revisa:**
1. Output directory es `dist`
2. Build command es `npm run build`
3. Framework detection es `Vite`

---

## 📝 Checklist Pre-Deploy

Antes de deployar a Vercel:

- [ ] `npm run build` funciona sin errores
- [ ] `npm run preview` funciona correctamente
- [ ] Variables de entorno configuradas (si las hay)
- [ ] `vercel.json` está en la raíz del proyecto
- [ ] `.gitignore` incluye `node_modules` y `dist`

---

## 🔗 URLs Útiles

- **Vercel Docs:** https://vercel.com/docs
- **Vite Deployment:** https://vitejs.dev/guide/static-deploy
- **Railway:** https://railway.app
- **Render:** https://render.com

---

## ✅ Resumen

### En Vercel:
- ✅ App funciona perfectamente
- ✅ Multi-pestaña sync automática
- ✅ Sistema de roles funcional
- ⚠️ Sin sync entre dispositivos diferentes

### Para Multi-Dispositivo:
- Use Railway/Render para WebSocket server
- Configure `VITE_WS_URL` en Vercel
- O use todo en Railway/Render

---

¡Tu app está lista para Vercel! 🎉
