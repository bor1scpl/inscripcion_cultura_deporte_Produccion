# Arquitectura del portal

React, Vite y Tailwind presentan el catálogo y el formulario. Express expone la API REST. Las rutas delegan en controladores HTTP, que invocan servicios y repositorios. Prisma conecta los repositorios con PostgreSQL. El paquete compartido contiene los contratos y el esquema Zod que validan tanto la interfaz como la API.

La Iteración 1 aplica la migración de disciplinas, horarios y postulaciones. La API devuelve el radicado una vez que PostgreSQL confirma la escritura. El horario usa el día ISO de la semana y columnas de hora local. El promedio declarado se guarda como un decimal de dos posiciones.

## Modelo objetivo de las tres iteraciones

```mermaid
erDiagram
    USUARIOS o|--o{ DISCIPLINAS : gestiona
    DISCIPLINAS ||--o{ HORARIOS : ofrece
    DISCIPLINAS ||--o{ POSTULACIONES : recibe
    ESTUDIANTES_INSTITUCIONAL o|--o{ POSTULACIONES : acredita
    POSTULANTES_CRM o|--o{ POSTULACIONES : agrupa
    POSTULACIONES ||--o{ HISTORIAL_ESTADOS : registra
    POSTULACIONES ||--o{ NOTIFICACIONES : genera
    USUARIOS o|--o{ HISTORIAL_ESTADOS : decide
    USUARIOS o|--o{ NOTIFICACIONES : recibe

    USUARIOS {
        uuid id PK
        string correo UK
        string rol
        string area
    }
    DISCIPLINAS {
        uuid id PK
        string nombre UK
        string tipo
        string descripcion
        int cupo_maximo
        int inscritos
        boolean publicada
        uuid jefe_area_id FK
    }
    HORARIOS {
        uuid id PK
        uuid disciplina_id FK
        int dia
        time inicio
        time fin
    }
    ESTUDIANTES_INSTITUCIONAL {
        uuid id PK
        string documento UK
        string correo_institucional
        boolean activo
        decimal promedio
    }
    POSTULACIONES {
        uuid id PK
        uuid disciplina_id FK
        uuid estudiante_institucional_id FK
        uuid postulante_crm_id FK
        string nombre
        string documento
        string correo_institucional
        string campus
        string programa_academico
        decimal promedio
        string estado
        string motivo_rechazo
        datetime creada_en
        datetime actualizada_en
    }
    POSTULANTES_CRM {
        uuid id PK
        string documento UK
        datetime actualizado_en
    }
    HISTORIAL_ESTADOS {
        uuid id PK
        uuid postulacion_id FK
        uuid usuario_id FK
        string estado_anterior
        string estado_nuevo
        string motivo
        datetime creado_en
    }
    NOTIFICACIONES {
        uuid id PK
        uuid postulacion_id FK
        uuid usuario_id FK
        string destinatario
        string canal
        string tipo
        string estado
        datetime creada_en
        datetime enviada_en
        datetime leida_en
    }
```

En la Iteración 2, el adaptador institucional aportará el estado activo y el promedio oficial. Las postulaciones elegibles se vincularán a una ficha CRM única por documento. Las transiciones y las notificaciones se registrarán en PostgreSQL. El procesamiento de correos tendrá reintentos.

En la Iteración 3, la API restringirá los paneles por rol JWT y área. Las aprobaciones alimentarán el consolidado y la asignación de plaza comprobará el cupo y actualizará el contador y el estado de la postulación dentro de una sola transacción.
