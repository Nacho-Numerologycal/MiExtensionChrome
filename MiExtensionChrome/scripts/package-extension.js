import fs from 'fs'
import path from 'path'
import archiver from 'archiver'

const sourceDir = 'dist'
const outputFile = 'extension.zip'

const output = fs.createWriteStream(outputFile)
const archive = archiver('zip', { zlib: { level: 9 } })

output.on('close', () => {
  console.log(`Extension packaged: ${archive.pointer()} bytes`)
})

archive.on('error', (err) => {
  throw err
})

archive.pipe(output)

// Añadir el contenido del directorio dist
archive.directory(sourceDir, false)

// Añadir manifest.json
archive.file('manifest.json', { name: 'manifest.json' })

// Añadir iconos si existen
const iconSizes = [16, 48, 128]
iconSizes.forEach(size => {
  const iconPath = `icons/icon${size}.png`
  if (fs.existsSync(iconPath)) {
    archive.file(iconPath, { name: iconPath })
  }
})

archive.finalize()