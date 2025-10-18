# ⚡ Quick Start: Railway en 5 Minutos

## 🎯 Objetivo

Habilitar sincronización multi-dispositivo **en cualquier lugar del mundo**.

---

## ✅ Paso 1: Deploy WebSocket en Railway (2 min)

### A. Crear cuenta Railway

1. **Ve a:** [railway.app](https://railway.app)
2. **Click:** "Start a New Project"
3. **Sign in:** Con GitHub (gratis)

### B. Deploy desde GitHub

1. **Click:** "Deploy from GitHub repo"
2. **Selecciona:** Tu repositorio `teleprompter-`
3. **Railway detecta:** Node.js automáticamente
4. **Click:** "Deploy Now"

### C. Configurar Start Command

1. **En Railway Dashboard:**
   - Click en tu proyecto
   - Tab "Settings"
   - **Start Command:** `node server/websocket-server.js`
   - Click "Deploy"

2. **Espera:** 30-60 segundos mientras se despliega

### D. Obtener URL WebSocket

1. **Tab "Settings":**
   - Busca sección "Networking"
   - Verás algo como: `teleprompter-production.up.railway.app`

2. **Tu URL WebSocket es:**
   ```
   wss://teleprompter-production.up.railway.app
   ```

✅ **Railway listo!**

---

## ✅ Paso 2: Configurar Vercel (2 min)

### A. Ir a Vercel Dashboard

1. **Ve a:** [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Click:** En tu proyecto teleprompter

### B. Agregar Variables de Entorno

1. **Tab:** "Settings"
2. **Menú lateral:** "Environment Variables"
3. **Agregar 2 variables:**

```
Name: VITE_WS_ENABLED
Value: true
```

```
Name: VITE_WS_URL
Value: wss://teleprompter-production.up.railway.app
```

⚠️ Cambia `teleprompter-production.up.railway.app` por TU URL de Railway

4. **Click:** "Save"

### C. Redeploy

1. **Tab:** "Deployments"
2. **Click:** En el deployment más reciente
3. **Click:** "⋯" (tres puntos)
4. **Click:** "Redeploy"
5. **Espera:** 30-60 segundos

✅ **Vercel actualizado!**

---

## ✅ Paso 3: Testing (1 min)

### Abrir en múltiples dispositivos:

**Laptop (Host):**
```
https://tu-app.vercel.app/?role=host
```

**Tablet (Controller):**
```
https://tu-app.vercel.app/?role=controller
```

**Móvil (Viewer):**
```
https://tu-app.vercel.app/?role=viewer
```

### ¿Funciona?

1. **En laptop:** Dale play
2. **En tablet/móvil:** Deberían empezar a scrollear automáticamente
3. **Cambia velocidad:** Se sincroniza en todos los dispositivos

✅ **¡Sincronización multi-dispositivo funcionando!** 🎉

---

## 🐛 Troubleshooting

### ❌ "WebSocket connection failed"

**Verifica:**

1. **Railway está corriendo:**
   - Dashboard → Tu proyecto
   - Debe decir "Active" en verde

2. **URL correcta en Vercel:**
   - Debe empezar con `wss://` (no `ws://`)
   - Sin espacios ni saltos de línea

3. **Variables guardadas:**
   - Redeploy Vercel después de cambiar variables

### ❌ "Still not working"

**Revisa logs Railway:**

1. Railway Dashboard → Tu proyecto
2. Tab "Deployments"
3. Click en el deployment actual
4. Tab "Logs"
5. Busca errores

**Común:** Puerto incorrecto

**Solución:**
```javascript
// server/websocket-server.js
const PORT = process.env.PORT || 8080; ✅ Correcto
```

---

## 💰 Costos

Railway te da **$5 de crédito gratis**.

**Este proyecto consume:**
- ~$0.50-2/mes en uso normal
- ~$5/mes en uso intensivo

**Crédito dura:**
- 2-10 meses dependiendo del uso

---

## 🎯 Resumen

### Antes:
- ❌ Solo multi-dispositivo en red local
- ❌ Servidor debe estar corriendo en tu laptop

### Después:
- ✅ Multi-dispositivo **desde cualquier lugar**
- ✅ Servidor en la nube 24/7
- ✅ SSL/TLS automático
- ✅ Casi gratis ($0-5/mes)

---

## 📋 Checklist Rápido

- [ ] Cuenta Railway creada
- [ ] Proyecto deployado en Railway
- [ ] URL WebSocket obtenida
- [ ] `VITE_WS_ENABLED=true` en Vercel
- [ ] `VITE_WS_URL=wss://...` en Vercel
- [ ] Vercel redeployado
- [ ] Testing exitoso en 2+ dispositivos

---

## 🚀 Siguiente Nivel

### Custom Domain

Railway permite usar tu propio dominio:

```
wss://sync.tudominio.com
```

1. Railway → Settings → Custom Domain
2. Agrega tu dominio
3. Configura DNS según instrucciones
4. Actualiza `VITE_WS_URL` en Vercel

---

¡Listo! Tu teleprompter ahora funciona **globalmente** 🌍
