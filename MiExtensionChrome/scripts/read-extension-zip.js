import fs from 'fs';

const zipPath = 'extension.zip';

try {
  const data = fs.readFileSync(zipPath);
  const base64data = data.toString('base64');
  console.log('Contenido de extension.zip en base64:');
  console.log(base64data);
} catch (err) {
  console.error('Error al leer extension.zip:', err);
}