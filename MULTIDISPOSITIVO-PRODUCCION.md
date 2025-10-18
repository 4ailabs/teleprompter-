# 🌐 Sincronización Multi-Dispositivo en Producción

## 🎯 3 Soluciones Completas

Esta guía te muestra **3 formas** de habilitar sincronización multi-dispositivo en producción, ordenadas de más fácil a más compleja.

---

## ✅ Solución 1: Railway + Vercel (Recomendada)

### Por qué Railway:
- ✅ **Gratis** para empezar ($5 crédito inicial)
- ✅ Soporta WebSocket nativamente
- ✅ Deploy en 5 minutos
- ✅ SSL/TLS automático (wss://)
- ✅ No requiere tarjeta de crédito inicial

### Arquitectura:

```
┌──────────────┐         ┌──────────────┐
│   Vercel     │         │   Railway    │
│  (Frontend)  │◄───────►│ (WebSocket)  │
│              │   wss:// │              │
└──────────────┘         └──────────────┘
       ▲                        ▲
       │                        │
       │    Sincronización      │
       │                        │
   ┌───┴────┐              ┌───┴────┐
   │Laptop  │              │ Tablet │
   │ (Host) │              │(Viewer)│
   └────────┘              └────────┘
```

### Paso a Paso:

#### 1️⃣ Deploy WebSocket Server en Railway

**A. Crear cuenta en Railway:**
1. Ve a [railway.app](https://railway.app)
2. Sign up con GitHub (gratis)
3. Obtienes $5 de crédito inicial

**B. Deploy desde GitHub:**

```bash
# 1. Commit y push tus cambios
git add .
git commit -m "Add Railway support"
git push origin main

# 2. En Railway:
# - Click "New Project"
# - Select "Deploy from GitHub repo"
# - Selecciona tu repositorio
# - Railway detecta Node.js automáticamente
```

**C. Configurar el servicio:**

1. En Railway Dashboard:
   - Click en tu proyecto
   - Ve a "Settings"
   - En "Start Command" pon: `node server/websocket-server.js`

2. Obtén tu URL:
   - Railway te da una URL como: `your-app.railway.app`
   - El WebSocket será: `wss://your-app.railway.app`

#### 2️⃣ Configurar Vercel para usar Railway

**A. En Vercel Dashboard:**

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega:
   ```
   VITE_WS_ENABLED = true
   VITE_WS_URL = wss://your-app.railway.app
   ```

**B. Redeploy:**

```bash
vercel --prod
```

#### 3️⃣ Testing

**A. Abre en laptop:**
```
https://tu-app.vercel.app/?role=host
```

**B. Abre en móvil (misma WiFi o cualquier red):**
```
https://tu-app.vercel.app/?role=viewer
```

**C. ¡Sincronización automática!** 🎉

---

### 💰 Costos Railway

| Plan | Precio | Incluye |
|------|--------|----------|
| Trial | **GRATIS** | $5 crédito inicial |
| Hobby | **$5/mes** | 500 horas ejecución |
| Pro | **$20/mes** | Ilimitado |

**Estimado para este proyecto:**
- 1 servidor WebSocket pequeño
- Tráfico bajo/medio
- **~$0-2/mes** (casi gratis)

---

## ✅ Solución 2: Render.com (Alternativa Gratis)

### Por qué Render:
- ✅ **100% Gratis** para siempre
- ✅ Soporta WebSocket
- ✅ SSL automático
- ⚠️ Sleep después de 15min inactividad

### Paso a Paso:

#### 1️⃣ Deploy en Render

**A. Crear cuenta:**
1. Ve a [render.com](https://render.com)
2. Sign up con GitHub

**B. Crear Web Service:**

1. Dashboard → New → Web Service
2. Connect tu repositorio
3. Configuración:
   ```
   Name: teleprompter-ws
   Environment: Node
   Build Command: npm install
   Start Command: node server/websocket-server.js
   Instance Type: Free
   ```

4. Deploy!

**C. Obtén URL:**
- Render te da: `teleprompter-ws.onrender.com`
- WebSocket: `wss://teleprompter-ws.onrender.com`

#### 2️⃣ Configurar Vercel

Variables de entorno en Vercel:
```
VITE_WS_ENABLED = true
VITE_WS_URL = wss://teleprompter-ws.onrender.com
```

#### 3️⃣ Nota sobre Sleep

Render Free duerme después de 15min. Primera conexión tarda ~30seg en despertar.

**Solución:**
- Usa un servicio de ping (ej: UptimeRobot) para mantenerlo despierto
- O actualiza a Render Starter ($7/mes, sin sleep)

---

## ✅ Solución 3: Supabase Realtime (Moderna)

### Por qué Supabase:
- ✅ Gratis hasta 500MB database
- ✅ Realtime sync integrado
- ✅ No necesitas servidor WebSocket
- ✅ Auth, Database, Storage incluidos

### Implementación:

#### 1️⃣ Setup Supabase

```bash
npm install @supabase/supabase-js
```

#### 2️⃣ Crear hook con Supabase

Crea `hooks/useSupabaseSync.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
)

export function useSupabaseSync<T>(channel: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue)

  useEffect(() => {
    const channelRef = supabase.channel(channel)

    channelRef
      .on('broadcast', { event: 'sync' }, ({ payload }) => {
        setState(payload.state)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channelRef)
    }
  }, [channel])

  const syncedSetState = (newState: T) => {
    setState(newState)
    supabase.channel(channel).send({
      type: 'broadcast',
      event: 'sync',
      payload: { state: newState }
    })
  }

  return [state, syncedSetState] as const
}
```

#### 3️⃣ Usar en App.tsx

```typescript
import { useSupabaseSync } from './hooks/useSupabaseSync'

const [isPlaying, setIsPlaying] = useSupabaseSync('teleprompter', false)
```

**Ventajas:**
- ✅ 100% serverless
- ✅ Escala automáticamente
- ✅ Incluye auth y database gratis

**Desventajas:**
- Requiere reescribir el hook de sync
- Más complejo de configurar

---

## 📊 Comparación de Soluciones

| Solución | Dificultad | Costo | Setup | WebSocket | Sleep |
|----------|-----------|-------|-------|-----------|-------|
| **Railway** | ⭐ Fácil | $0-5/mes | 5 min | ✅ Nativo | ❌ Nunca |
| **Render Free** | ⭐ Fácil | Gratis | 10 min | ✅ Nativo | ⚠️ 15min |
| **Supabase** | ⭐⭐ Media | Gratis | 30 min | ✅ Realtime | ❌ Nunca |

---

## 🚀 Recomendación Final

### Para este proyecto:

**Mejor opción: Railway + Vercel**

**Por qué:**
1. **Setup en 5 minutos** - Más rápido
2. **Código mínimo** - Ya está todo listo
3. **Confiable** - No sleep, SSL automático
4. **Casi gratis** - $0-2/mes para uso normal

### Pasos Simplificados:

```bash
# 1. Push a GitHub
git push origin main

# 2. Deploy WebSocket en Railway
# - railway.app → New Project → From GitHub
# - Start command: node server/websocket-server.js

# 3. Configurar Vercel
# - Settings → Env Variables
# - VITE_WS_ENABLED = true
# - VITE_WS_URL = wss://your-app.railway.app

# 4. Redeploy Vercel
vercel --prod

# ✅ ¡Listo!
```

---

## 🧪 Testing Multi-Dispositivo

### Escenario Real:

**Dispositivo 1 (Laptop - Host):**
```
https://tu-app.vercel.app/?role=host
```

**Dispositivo 2 (Tablet - Controller):**
```
https://tu-app.vercel.app/?role=controller
```

**Dispositivo 3 (Móvil - Viewer):**
```
https://tu-app.vercel.app/?role=viewer
```

**Resultado:**
- ✅ Todos sincronizados en tiempo real
- ✅ Host controla todo
- ✅ Controller puede play/pause/velocidad
- ✅ Viewer solo visualiza
- ✅ Funciona en cualquier red (no solo WiFi local)

---

## 🔧 Troubleshooting

### Error: WebSocket connection refused

**Causa:** Railway/Render no está corriendo

**Solución:**
1. Ve al dashboard
2. Verifica que el servicio esté "Running"
3. Revisa los logs

### Error: wss:// instead of ws://

**Causa:** Producción requiere SSL

**Solución:**
- Railway/Render dan SSL gratis
- Usa `wss://` no `ws://`

### Sync no funciona entre dispositivos

**Causa:** Variable de entorno incorrecta

**Solución:**
```bash
# Vercel Dashboard
VITE_WS_ENABLED = true  ← Debe ser string "true"
VITE_WS_URL = wss://... ← Debe empezar con wss://
```

---

## 💡 Consejos Pro

### 1. Monitoreo

Railway/Render tienen dashboards con:
- CPU/Memory usage
- Request logs
- Error tracking

### 2. Custom Domain

Puedes usar tu dominio:
```
wss://sync.tudominio.com
```

### 3. Rate Limiting

Para producción, agrega rate limiting:

```javascript
// server/websocket-server.js
const rateLimit = new Map()

wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress

  // Limitar a 100 mensajes/minuto por IP
  if (rateLimit.get(ip) > 100) {
    ws.close()
    return
  }

  // ... resto del código
})
```

---

## 📝 Checklist Deploy

- [ ] Código pusheado a GitHub
- [ ] Railway/Render project creado
- [ ] WebSocket server deployado
- [ ] URL WebSocket obtenida
- [ ] Variables en Vercel configuradas
- [ ] Vercel redeployado
- [ ] Testing multi-dispositivo exitoso

---

## 🎉 Resultado Final

### Antes (Solo Local):
- ✅ Multi-dispositivo en red local
- ❌ No funciona fuera de casa
- ❌ Requiere servidor corriendo

### Después (Producción):
- ✅ Multi-dispositivo en cualquier lugar
- ✅ Funciona desde cualquier red
- ✅ Servidor en la nube (Railway/Render)
- ✅ SSL/TLS automático
- ✅ ~$0-5/mes

---

¡Tu teleprompter ahora es verdaderamente **global**! 🌍
