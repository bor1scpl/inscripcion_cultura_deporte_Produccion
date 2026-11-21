const dominioInstitucional = process.env.DOMINIO_INSTITUCIONAL?.trim().toLowerCase();
const puerto = Number(process.env.API_PORT ?? 3001);

if (!dominioInstitucional || !/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/.test(dominioInstitucional)) {
  throw new Error('Configura DOMINIO_INSTITUCIONAL con un dominio válido, sin @.');
}
if (!process.env.DATABASE_URL) {
  throw new Error('Configura DATABASE_URL en el archivo .env.');
}
if (!Number.isInteger(puerto) || puerto < 1 || puerto > 65535) {
  throw new Error('Configura API_PORT con un puerto válido.');
}

export const entorno = { dominioInstitucional, puerto };
