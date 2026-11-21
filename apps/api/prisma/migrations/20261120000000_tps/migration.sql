CREATE TYPE "TipoDisciplina" AS ENUM ('DEPORTE', 'CULTURA');
CREATE TYPE "EstadoPostulacion" AS ENUM ('RECIBIDA');

CREATE TABLE "disciplinas" (
    "id" UUID PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoDisciplina" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cupo_maximo" INTEGER NOT NULL DEFAULT 0,
    "inscritos" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "disciplinas_cupos_validos" CHECK ("inscritos" BETWEEN 0 AND "cupo_maximo")
);
CREATE UNIQUE INDEX "disciplinas_nombre_key" ON "disciplinas"("nombre");

CREATE TABLE "horarios" (
    "id" UUID PRIMARY KEY,
    "disciplina_id" UUID NOT NULL REFERENCES "disciplinas"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "dia" INTEGER NOT NULL,
    "inicio" TIME(0) NOT NULL,
    "fin" TIME(0) NOT NULL,
    CONSTRAINT "horarios_intervalo_valido" CHECK ("dia" BETWEEN 1 AND 7 AND "inicio" < "fin")
);
CREATE UNIQUE INDEX "horarios_disciplina_id_dia_inicio_key" ON "horarios"("disciplina_id", "dia", "inicio");

CREATE TABLE "postulaciones" (
    "id" UUID PRIMARY KEY,
    "disciplina_id" UUID NOT NULL REFERENCES "disciplinas"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "nombre" VARCHAR(120) NOT NULL,
    "documento" VARCHAR(40) NOT NULL,
    "correo_institucional" VARCHAR(254) NOT NULL,
    "programa_academico" VARCHAR(120) NOT NULL,
    "promedio" DECIMAL(3,2) NOT NULL,
    "estado" "EstadoPostulacion" NOT NULL DEFAULT 'RECIBIDA',
    "creada_en" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizada_en" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "postulaciones_promedio_valido" CHECK ("promedio" BETWEEN 0 AND 5)
);
CREATE INDEX "postulaciones_disciplina_id_estado_idx" ON "postulaciones"("disciplina_id", "estado");
