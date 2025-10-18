# 👥 Sistema de Roles Host/Control/Visor

## ¿Qué es el sistema de roles?

El sistema de roles te permite definir **qué puede hacer cada dispositivo** conectado al teleprompter. Esto es ideal para trabajos en equipo donde diferentes personas tienen diferentes responsabilidades.

---

## 🎭 Tipos de Roles

### 👑 Host (Anfitrión)
**Control Total**

El **Host** es el operador principal del teleprompter.

**Permisos:**
- ✅ Play/Pause
- ✅ Cambiar velocidad
- ✅ Resetear posición
- ✅ Editar script
- ✅ Cambiar configuración
- ✅ Ver todo

**Casos de uso:**
- Director técnico
- Operador principal
- Productor de la presentación

---

### 🎮 Controller (Controlador)
**Control Limitado**

El **Controller** puede controlar la reproducción pero no editar.

**Permisos:**
- ✅ Play/Pause
- ✅ Cambiar velocidad
- ✅ Resetear posición
- ❌ No puede editar script
- ❌ No puede cambiar configuración
- ✅ Ver todo

**Casos de uso:**
- Asistente de dirección
- Operador de respaldo
- Control remoto secundario

---

### 👁️ Viewer (Visor)
**Solo Lectura**

El **Viewer** solo puede ver el contenido sincronizado.

**Permisos:**
- ❌ No puede controlar Play/Pause
- ❌ No puede cambiar velocidad
- ❌ No puede resetear
- ❌ No puede editar
- ❌ No puede cambiar configuración
- ✅ Ver contenido sincronizado

**Casos de uso:**
- Actor/Presentador
- Pantalla de visualización
- Monitor para el talento

---

## 🚀 Cómo Usar el Sistema de Roles

### Método 1: Selección Manual en la App

1. **Abre la app** en el navegador
2. **Haz clic en el botón WiFi** (📶) en los controles
3. **Selecciona tu rol** en la sección "Rol de este dispositivo"
   - Haz clic en Host, Controller o Viewer
4. ¡Listo! Tu dispositivo ahora tiene ese rol

---

### Método 2: URL con Parámetro (Recomendado)

Puedes compartir URLs que automáticamente asignen el rol al dispositivo que las abra.

#### Generar URLs:

1. **Abre la app** como Host
2. **Haz clic en el botón WiFi** (📶)
3. **Selecciona el rol** que quieres compartir:
   - Selecciona "Host" para generar URL de Host
   - Selecciona "Controller" para generar URL de Controller
   - Selecciona "Viewer" para generar URL de Viewer
4. **Copia la URL** o escanea el QR code
5. **Comparte** con el otro dispositivo

#### Ejemplo de URLs:

```
# Host (control total)
http://192.168.0.124:5174/?role=host

# Controller (puede controlar)
http://192.168.0.124:5174/?role=controller

# Viewer (solo lectura)
http://192.168.0.124:5174/?role=viewer
```

---

## 📱 Escenarios de Uso Real

### Escenario 1: Presentación Corporativa

**Equipo:**
- **Laptop (Host):** Director técnico backstage
- **Tablet (Controller):** Asistente en el escenario
- **Monitor Grande (Viewer):** Presentador leyendo

**Configuración:**
1. Laptop abre: `http://192.168.0.124:5174/?role=host`
2. Tablet abre: `http://192.168.0.124:5174/?role=controller`
3. Monitor abre: `http://192.168.0.124:5174/?role=viewer`

**Flujo:**
- El director controla todo desde backstage
- El asistente puede pausar/ajustar velocidad si es necesario
- El presentador solo lee, sin poder cambiar nada accidentalmente

---

### Escenario 2: Producción de Video

**Equipo:**
- **PC de Control (Host):** Director
- **iPhone (Controller):** Productor
- **iPad frente a cámara (Viewer):** Talento

**Configuración:**
1. El director genera URL de Viewer y la comparte al iPad del talento
2. El productor genera URL de Controller para su iPhone
3. El director mantiene control total desde el PC

**Flujo:**
- El talento lee sin controles visibles (modo Viewer)
- El productor puede hacer ajustes desde su iPhone
- El director tiene control total

---

### Escenario 3: Teatro en Vivo

**Equipo:**
- **Laptop Backstage (Host):** Regidor
- **Tablet Lateral (Controller):** Asistente
- **Monitor en Escenario (Viewer):** Actor

**Configuración:**
1. Regidor configura todo como Host
2. Asistente tiene Controller por si necesita pausar
3. Actor solo visualiza (Viewer)

**Flujo:**
- El regidor controla el ritmo de la obra
- El asistente puede pausar en emergencias
- El actor lee sin distracciones

---

## 🔄 Cambiar de Rol Durante la Sesión

Puedes cambiar el rol de un dispositivo en cualquier momento:

1. **Abre el panel WiFi** (📶)
2. **Haz clic en el nuevo rol** que quieres
3. El cambio es **instantáneo**
4. Los controles se **habilitan/deshabilitan** automáticamente

---

## 🔒 Seguridad y Permisos

### ¿Qué pasa si intento controlar siendo Viewer?

- Los botones de control se **deshabilitan visualmente**
- Aparecen en **gris** y con **opacidad reducida**
- Al hacer hover, dice: *"No tienes permisos para controlar (modo Visor)"*
- Si intentas controlar por código, el hook `useSyncState` **rechaza** la acción

### Persistencia de Roles

El rol seleccionado se guarda en:
1. **localStorage**: Se mantiene al recargar la página
2. **URL**: El parámetro `?role=` define el rol inicial

**Orden de prioridad:**
1. Parámetro URL (`?role=host`)
2. localStorage (`teleprompter-role`)
3. Por defecto: `host`

---

## 🎨 Indicadores Visuales

### En el Panel de Control Remoto:

- **Host:** Icono de corona 👑, color ámbar
- **Controller:** Icono de gamepad 🎮, color azul
- **Viewer:** Icono de ojo 👁️, color púrpura

### En los Controles:

- **Con permisos:** Botones normales (ámbar/verde)
- **Sin permisos:** Botones grises, deshabilitados, cursor bloqueado

---

## 📊 Tabla de Comparación

| Acción | Host | Controller | Viewer |
|--------|------|------------|--------|
| Ver contenido | ✅ | ✅ | ✅ |
| Play/Pause | ✅ | ✅ | ❌ |
| Cambiar velocidad | ✅ | ✅ | ❌ |
| Reset/Posición | ✅ | ✅ | ❌ |
| Editar script | ✅ | ❌ | ❌ |
| Configuración | ✅ | ❌ | ❌ |
| Cambiar tamaño fuente | ✅ | ✅ | ❌ |

---

## 🛠️ Consejos Prácticos

### 1. Usa QR Codes

Para compartir roles rápidamente:
1. Selecciona el rol en el panel WiFi
2. Genera el QR code automáticamente
3. El otro dispositivo escanea y abre con el rol correcto

### 2. Nombra tus Dispositivos

Aunque el sistema no lo hace automáticamente (próxima feature), puedes:
- Agregar `&name=Director` a la URL
- Ej: `?role=host&name=Director`

### 3. URLs Prefijadas

Crea URLs cortas con servicios como bit.ly:
- `bit.ly/tele-host` → `http://192.168.0.124:5174/?role=host`
- `bit.ly/tele-viewer` → `http://192.168.0.124:5174/?role=viewer`

### 4. Múltiples Viewers

Puedes tener tantos Viewers como quieras:
- Monitor 1: Viewer
- Monitor 2: Viewer
- Tablet: Viewer
- Todos se sincronizan automáticamente

---

## 🔧 Troubleshooting

### ❓ No puedo controlar nada

**Solución:**
1. Verifica tu rol en el panel WiFi
2. Si eres Viewer, cambia a Controller o Host
3. Recarga la página si es necesario

### ❓ Mi rol se resetea al recargar

**Solución:**
1. Usa URLs con parámetro `?role=`
2. O selecciona el rol manualmente cada vez
3. El localStorage debería guardarlo automáticamente

### ❓ Quiero que todos sean Viewers excepto yo

**Solución:**
1. Abre tu dispositivo normalmente (serás Host)
2. Genera URL de Viewer: `?role=viewer`
3. Comparte esa URL a todos los demás
4. Solo tú tendrás control

---

## 🎯 Próximas Mejoras

Planeadas para futuras versiones:

- [ ] **Nombres personalizados** para dispositivos
- [ ] **Lista de dispositivos conectados** con sus roles
- [ ] **Transferir rol de Host** a otro dispositivo
- [ ] **Bloquear/Expulsar** dispositivos
- [ ] **Logs de actividad** (quién controló qué)
- [ ] **Notificaciones** cuando alguien se conecta/desconecta

---

## 📝 Resumen Rápido

**Para usar el sistema:**

1. **Inicia los servidores:**
   ```bash
   ./start.sh
   ```

2. **Abre como Host:**
   ```
   http://192.168.0.124:5174/
   ```

3. **Genera URLs para otros:**
   - Haz clic en WiFi
   - Selecciona el rol
   - Comparte URL/QR

4. **Controla según tu rol:**
   - Host: Todo
   - Controller: Play/velocidad
   - Viewer: Solo ver

¡Disfruta de tu teleprompter multi-rol! 🎉
