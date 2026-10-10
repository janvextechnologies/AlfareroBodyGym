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

- El formulario público de contacto no envía datos: abre WhatsApp con el
  mensaje redactado.
- La información marcada como *provisional* debe reemplazarse por la real antes
  de publicar.

## Panel de administración

El panel vive en `/admin` y, en esta fase, es **independiente de la landing**
(los cambios se guardan en Supabase pero todavía no alimentan la web pública).

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

Copia `.env.example` a `.env.local` y completa los valores. Se requieren:

- `DATABASE_URL` — cadena de conexión al Postgres de Supabase (pooler).
- `DIRECT_URL` — conexión directa, solo para migraciones (opcional).
- `NEXT_PUBLIC_SUPABASE_URL` — URL pública del proyecto Supabase.
- `SUPABASE_SERVICE_ROLE_KEY` — clave de servicio (solo servidor).
- `SUPABASE_STORAGE_BUCKET` — bucket para las imágenes (por defecto `gym-media`).
- `ADMIN_USERNAME` — usuario del administrador.
- `ADMIN_PASSWORD_HASH` — hash bcrypt de la contraseña (`npm run hash-password`).
- `SESSION_SECRET` — cadena aleatoria de 32+ caracteres.
- `SESSION_TTL_HOURS` — duración de la sesión (opcional, 8 por defecto).

### 3. Base de datos

```bash
npm run db:generate   # genera las migraciones en ./drizzle
npm run db:migrate    # aplica las migraciones a Supabase
npm run db:seed       # carga los datos iniciales actuales (incluye a Elving)
npm run db:studio     # explorador de la base de datos (opcional)
```

### 4. Generar la contraseña del administrador

```bash
npm run hash-password
```

Copia el `ADMIN_PASSWORD_HASH` resultante en `.env.local`. Para cambiarla,
repite el proceso y actualiza la variable (no se cambia desde el frontend).

### 5. Supabase Storage

Crea un bucket **público** (por defecto `gym-media`) para lectura, y sube/
gestiona archivos desde el panel con la clave de servicio (solo servidor).
Formatos permitidos: JPG, PNG y WebP, hasta 5 MB.

### 6. Acceso

Abre `/admin` en el navegador e inicia sesión. No hay enlaces al panel desde la
landing. Rutas protegidas: `/admin/dashboard`, `/admin/portada`,
`/admin/informacion`, `/admin/mision-vision`, `/admin/galeria`, `/admin/equipo`,
`/admin/horarios`, `/admin/ubicacion` y `/admin/contacto`.

### 7. Cómo se refleja en la web pública

La landing lee su contenido de Supabase mediante `getPublicContent()`
(`src/server/public/content.ts`), cacheado con el tag `gym-content`
(`"use cache"` + `cacheTag`). Cada vez que guardas en el panel, los Server
Actions llaman `updateTag("gym-content")`, por lo que el sitio se revalida y
muestra los cambios. Si una tabla está vacía o la base de datos no responde, se
usan los valores por defecto de `src/data/gym.ts` como respaldo.

Campos que el panel aún **no** edita y permanecen estáticos: navegación,
estadísticas de la portada, títulos/eyebrow de sección, filosofía y beneficios
de "Nosotros", `whatsappMessage`, `formNote`, `footer.tagline` y `siteUrl`.

### 8. Health check y cron (evitar que Supabase se pause)

El endpoint `GET /api/health` ejecuta una consulta real (`SELECT 1`) para
mantener activa la base de datos. Está protegido con un token.

1. Genera un secreto:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
   ```
2. En **Vercel → Project Settings → Environment Variables** añade
   `CRON_SECRET` con ese valor (entorno Production) y vuelve a desplegar.
3. `vercel.json` ya define el cron diario a las **13:00 UTC** (≈ 7:00 en
   Nicaragua): `{ "path": "/api/health", "schedule": "0 13 * * *" }`.
   Vercel envía automáticamente `Authorization: Bearer <CRON_SECRET>`.

Prueba manual:
```bash
curl -H "Authorization: Bearer <CRON_SECRET>" https://www.alfarerobodygym.com/api/health
# o
curl "https://www.alfarerobodygym.com/api/health?token=<CRON_SECRET>"
```

Sin token devuelve `401`; si falta `CRON_SECRET` en el entorno, `503`.
Supabase (plan Free) pausa tras ~7 días de inactividad, así que una vez al día
es suficiente.


