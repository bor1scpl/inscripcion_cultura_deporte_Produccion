# Portal de Inscripción a Bienestar Universitario

La Iteración 1 implementa HU1 y HU2. El catálogo público muestra disciplinas deportivas y culturales. Para las nuevas disciplinas se usan 20 cupos iniciales de desarrollo y se muestran los horarios como «Por definir». El formulario guarda la postulación con fecha, estado `RECIBIDA` y un radicado.

Cada postulación recibida reserva un cupo. El catálogo muestra los cupos restantes de cada disciplina y la API devuelve HTTP 409 si la disciplina se agotó. Los cupos máximos de ejemplo se asignan al crear las disciplinas. Para editar los ensayos de Cultura, modifica [oferta-cultural.ts](apps/api/prisma/oferta-cultural.ts) y ejecuta `npm run db:seed`. Cada grupo de días va del 1 (lunes) al 7 (domingo), con horas en formato de 24 horas. El seed publica únicamente las fichas culturales de ese archivo y sincroniza sus horarios. Las fichas retiradas conservan el historial de postulaciones.

## Requisitos

- Node.js 22.12 o superior y npm.
- PostgreSQL 16. Docker Compose es la opción incluida para iniciarlo localmente.

## Instalación y ejecución

Desde la raíz del proyecto en PowerShell:

```powershell
Copy-Item .env.example .env
npm install
docker compose up -d --wait
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

En Bash, usa `cp .env.example .env` para el primer paso. Abre http://127.0.0.1:5173. Si ya tienes PostgreSQL, crea una base de datos, configura `DATABASE_URL` y omite Docker Compose.

El archivo `.env.example` usa valores de muestra para la base local. Configura `DOMINIO_INSTITUCIONAL` con el dominio exacto de la universidad, sin `@`. Con el valor de ejemplo puedes usar `estudiante@unicartagena.edu.co`. Si ajustas el puerto de PostgreSQL en Compose, cambia también el puerto en `DATABASE_URL`. Ejecuta los scripts desde la raíz para que Prisma encuentre `.env`.

## Verificación

- `npm test` ejecuta las pruebas del esquema compartido con Vitest.
- `npm run build` genera Prisma Client, comprueba tipos y compila la interfaz.
- `npm start` sirve la interfaz compilada y la API desde http://127.0.0.1:3001. Requiere que PostgreSQL esté disponible.
- En el catálogo, elige una disciplina, diligencia el formulario y verifica el mensaje de recepción y su radicado. Puedes confirmar el registro en PostgreSQL con `SELECT id, estado, creada_en FROM postulaciones;`.

| Método y ruta | Resultado |
| --- | --- |
| `GET /api/disciplinas` | Oferta pública con horarios y dominio institucional. |
| `POST /api/postulaciones` | Acepta JSON con `nombre`, `documento`, `correo`, `campus`, `programa`, `promedio` (número) y `disciplinaId`. Devuelve HTTP 201 con radicado, estado y fecha, o HTTP 422 con errores de validación por campo. |

## Estructura

```text
apps/
  api/
    prisma/             Esquema, migraciones y seed
    src/                Configuración, middleware, rutas, controladores, servicios y repositorios
  web/
    src/                Portal, catálogo, formulario y cliente HTTP
packages/
  compartido/src/       Contratos, validación y pruebas
docs/
  arquitectura.md       Diseño y diagrama Mermaid
```

[Consulta la arquitectura y el modelo de datos](docs/arquitectura.md).
