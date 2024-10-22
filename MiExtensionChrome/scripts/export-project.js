import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

const sourceDir = '.';
const outputFile = 'project.zip';

const output = fs.createWriteStream(outputFile);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`Proyecto empaquetado: ${archive.pointer()} bytes`);
  console.log('Ahora puedes descargar el archivo project.zip');
});

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.warn('Advertencia:', err);
  } else {
    throw err;
  }
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

// Función para ignorar archivos y carpetas específicos
const ignorePatterns = [
  '.git',
  'node_modules',
  'dist',
  outputFile,
  'extension.zip'
];

const shouldIgnore = (filePath) => {
  return ignorePatterns.some(pattern => filePath.includes(pattern));
};

// Añadir archivos recursivamente
const addDirectoryToArchive = (dirPath) => {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    
    if (shouldIgnore(filePath)) continue;

    if (fs.statSync(filePath).isDirectory()) {
      archive.directory(filePath, path.relative(sourceDir, filePath));
    } else {
      archive.file(filePath, { name: path.relative(sourceDir, filePath) });
    }
  }
};

addDirectoryToArchive(sourceDir);

archive.finalize();