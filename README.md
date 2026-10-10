# Alfarero Body Gym — SPA en Next.js

Sitio web informativo (single page) para **Alfarero Body Gym**, con tema oscuro,
identidad roja y negra, y contenido editable desde un único archivo de
configuración.

## Tecnologías

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- shadcn/ui (estilo base-nova)
- Lucide React (iconos)
- Framer Motion (animaciones)
- `next/image` para optimización de imágenes

## Puesta en marcha

```bash
npm install       # instala las dependencias
npm run dev       # servidor de desarrollo -> http://localhost:3000
npm run build     # compilación de producción
npm run start     # sirve la versión compilada
npm run lint      # análisis estático
```

## Estructura

```
src/app/layout.tsx        Metadatos SEO, fuentes y layout raíz
src/app/page.tsx          Composición de todas las secciones
src/app/globals.css       Tema (colores de marca, tipografías, utilidades)
src/components/           Componentes de cada sección
src/data/gym.ts           TODA la información editable del negocio
public/images/            Logo y fotografías
```

## Cómo personalizar

### 1. Todo el contenido editable

Abre **`src/data/gym.ts`** y modifica:

- Nombre, eslogan y descripción.
- Misión, visión, filosofía, valores y beneficios.
- Navegación.
- Galería de imágenes.
- Equipo (perfiles).
- **Horarios** (`schedule.days`), zona horaria (`schedule.timeZone`).
- **Ubicación** (`location.addressLines`, `location.mapEmbedUrl`).
- **Teléfono y WhatsApp** (`contact.whatsapp`, formato internacional sin
  espacios ni símbolos).
- Redes sociales.

### 2. Sustituir el logo

Reemplaza `public/images/logo.png` (y `src/app/icon.png`, que es el favicon) por
el nuevo archivo conservando el nombre. No es necesario tocar el código.

### 3. Sustituir las fotografías

Las imágenes de ejemplo están en `public/images/gallery/` y
`public/images/team/`, y la portada en `public/images/hero.jpg`. Puedes:

1. Colocar tus fotos en esas carpetas, o
2. Editar las rutas en `src/data/gym.ts` (`hero.image`, `gallery.images`,
   `team.members[].image`).

### 4. Mapa de Google Maps

En `src/data/gym.ts`, pega la URL de inserción en
`location.mapEmbedUrl` (Google Maps → Compartir → Insertar un mapa). Si queda
vacía se muestra un aviso en lugar del mapa.

### 5. Horarios reales y estado "Abierto ahora"

Actualiza `schedule.days` con los horarios reales y luego:

```ts
schedule.provisional = false;
schedule.openStatusEnabled = true;
```

El estado "Abierto ahora / Cerrado ahora" se calcula con la hora local de
`schedule.timeZone` (por defecto `America/Managua`).

## Notas

- No hay backend, base de datos, autenticación ni panel administrativo.
- El formulario de contacto no envía datos: abre WhatsApp con el mensaje
  redactado.
- La información marcada como *provisional* (dirección, teléfono, horarios,
  perfiles del equipo) debe reemplazarse por la real antes de publicar.
