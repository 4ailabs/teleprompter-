# 🔐 Gestión de Conexiones - Teleprompter Pro

## 🎯 Sistema de Claves de Acceso

El teleprompter ahora incluye un sistema de claves de acceso para controlar quién puede conectarse y evitar conexiones no deseadas.

---

## 🔑 Configuración de Claves

### **Clave por Defecto:**
```
teleprompter2024
```

### **Cambiar Clave en Railway:**

1. **Ve a Railway Dashboard:**
   - Selecciona tu proyecto
   - Settings → Variables

2. **Agregar Variable:**
   ```
   Name: ACCESS_KEY
   Value: tu-clave-personalizada
   ```

3. **Redeploy Railway** para aplicar la nueva clave

---

## ⚙️ Configuración en Vercel

### **Variables de Entorno Requeridas:**

```
Name: VITE_WS_ENABLED
Value: true
```

```
Name: VITE_WS_URL
Value: wss://teleprompter-production.up.railway.app
```

```
Name: VITE_ACCESS_KEY
Value: tu-clave-personalizada
```

⚠️ **La clave debe ser la misma en Railway y Vercel**

---

## 🚀 URLs con Clave

### **Formato de URL:**
```
https://tu-app.vercel.app/?role=host&key=tu-clave
```

### **Ejemplos:**

#### **Host (Control Total):**
```
https://teleprompter-sepia.vercel.app/?role=host&key=teleprompter2024
```

#### **Controller (Control Limitado):**
```
https://teleprompter-sepia.vercel.app/?role=controller&key=teleprompter2024
```

#### **Viewer (Solo Lectura):**
```
https://teleprompter-sepia.vercel.app/?role=viewer&key=teleprompter2024
```

---

## 🔒 Seguridad

### **✅ Ventajas:**
- **Control de acceso**: Solo dispositivos con clave pueden conectarse
- **Prevención de intrusos**: Evita conexiones no deseadas
- **Gestión de sesiones**: Puedes cambiar la clave para desconectar todos
- **Logs de seguridad**: Railway muestra intentos de conexión fallidos

### **⚠️ Consideraciones:**
- **Compartir clave**: Solo con personas autorizadas
- **Cambiar regularmente**: Para mayor seguridad
- **No hardcodear**: Usar variables de entorno

---

## 🛠️ Gestión de Conexiones

### **Ver Conexiones Activas:**
1. **Railway Dashboard** → Tu proyecto
2. **Logs** → Ver conexiones exitosas y rechazadas

### **Desconectar Todos:**
1. **Cambiar clave** en Railway
2. **Actualizar clave** en Vercel
3. **Redeploy ambos** servicios
4. **Todos se desconectan** automáticamente

### **Reconectar Dispositivos:**
1. **Usar nueva clave** en las URLs
2. **Dispositivos se reconectan** automáticamente

---

## 📱 Control Remoto con Clave

### **Modal de Control Remoto:**
- **Muestra la clave** actual
- **URL completa** con clave incluida
- **QR Code** con clave incluida
- **Copiar URL** con clave incluida

### **Compartir Acceso:**
1. **Abrir Control Remoto** (botón WiFi verde)
2. **Copiar URL** (incluye clave automáticamente)
3. **Compartir** con personas autorizadas
4. **Solo ellos** pueden conectarse

---

## 🔧 Troubleshooting

### **❌ "Access Denied" Error:**
- **Verificar clave**: Debe ser la misma en Railway y Vercel
- **Redeploy**: Después de cambiar variables
- **Formato URL**: Debe incluir `&key=tu-clave`

### **❌ No se conecta:**
- **Verificar variables**: `VITE_ACCESS_KEY` configurada
- **Verificar Railway**: `ACCESS_KEY` configurada
- **Logs Railway**: Ver intentos de conexión

### **❌ Múltiples conexiones:**
- **Cambiar clave**: Para desconectar todos
- **Usar roles**: Solo UN host, otros como viewers
- **Verificar URLs**: Cada dispositivo con clave correcta

---

## 🎯 Casos de Uso

### **🎭 Teatro Profesional:**
- **Clave única** por producción
- **Solo equipo autorizado** puede conectarse
- **Cambiar clave** entre funciones

### **📺 Presentaciones Corporativas:**
- **Clave temporal** para la sesión
- **Control de acceso** estricto
- **Desconectar** después de la presentación

### **🎬 Grabaciones:**
- **Clave por proyecto**
- **Equipo específico** autorizado
- **Seguridad** durante la producción

---

## 📋 Checklist de Configuración

- [ ] Clave configurada en Railway (`ACCESS_KEY`)
- [ ] Clave configurada en Vercel (`VITE_ACCESS_KEY`)
- [ ] URLs incluyen parámetro `&key=tu-clave`
- [ ] Solo UN dispositivo con `?role=host`
- [ ] Otros dispositivos con `?role=viewer` o `?role=controller`
- [ ] Railway redeployado
- [ ] Vercel redeployado

---

¡Ahora tienes control total sobre quién puede conectarse a tu teleprompter! 🔐✨
