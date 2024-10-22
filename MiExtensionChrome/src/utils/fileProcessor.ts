import axios from 'axios'

export const processFiles = async (
  files: File[],
  outputOptions: { format: string; quantity: string; outputFolder: string },
  apiKey: string,
  customGptUrl: string,
  updateStatus: (progress: number, message: string, estimatedTime: string, fileName?: string) => void
) => {
  const totalFiles = files.length
  let processedFiles = 0
  const startTime = Date.now()

  for (const file of files) {
    try {
      const estimatedTime = calculateEstimatedTime(startTime, processedFiles, totalFiles)
      updateStatus(
        (processedFiles / totalFiles) * 100,
        `Procesando ${file.name}...`,
        estimatedTime,
        file.name
      )

      const fileContent = await readFile(file)
      let processedContent = fileContent

      if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
        processedContent = await transcribeAudioVideo(fileContent, apiKey)
      } else if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        processedContent = await extractTextFromDocument(fileContent)
      } else if (file.type.startsWith('image/')) {
        processedContent = await performOCR(fileContent, apiKey)
      }

      if (customGptUrl) {
        processedContent = await correctSpelling(processedContent, customGptUrl, apiKey)
      }

      await saveProcessedContent(processedContent, file.name, outputOptions)

      processedFiles++
      updateStatus(
        (processedFiles / totalFiles) * 100,
        `Procesado ${file.name}`,
        calculateEstimatedTime(startTime, processedFiles, totalFiles),
        file.name
      )
    } catch (error) {
      console.error(`Error al procesar ${file.name}:`, error)
      updateStatus(
        (processedFiles / totalFiles) * 100,
        `Error al procesar ${file.name}`,
        calculateEstimatedTime(startTime, processedFiles, totalFiles),
        file.name
      )
    }
  }
}

const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => resolve(e.target?.result as string)
    reader.onerror = (e: ProgressEvent<FileReader>) => reject(e)
    reader.readAsText(file)
  })
}

const transcribeAudioVideo = async (fileContent: string, apiKey: string): Promise<string> => {
  // Implementación de la transcripción de audio/video
  return `Transcripción de contenido de audio/video: ${fileContent.substring(0, 100)}...`
}

const extractTextFromDocument = async (fileContent: string): Promise<string> => {
  // Implementación de la extracción de texto de documentos
  return `Texto extraído del documento: ${fileContent.substring(0, 100)}...`
}

const performOCR = async (fileContent: string, apiKey: string): Promise<string> => {
  // Implementación de OCR
  return `Resultado de OCR: ${fileContent.substring(0, 100)}...`
}

const correctSpelling = async (content: string, customGptUrl: string, apiKey: string): Promise<string> => {
  try {
    const response = await axios.post(
      customGptUrl,
      { 
        content,
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that corrects spelling and grammar." },
          { role: "user", content: `Please correct the spelling and grammar in the following text:\n\n${content}` }
        ]
      },
      { 
        headers: { 
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        } 
      }
    )
    return response.data.choices[0].message.content
  } catch (error) {
    console.error('Error in spell correction:', error)
    return content // Return original content if correction fails
  }
}

const saveProcessedContent = async (
  content: string,
  fileName: string,
  options: { format: string; quantity: string; outputFolder: string }
) => {
  const outputPath = `${options.outputFolder}/${fileName}.${options.format}`
  
  if (typeof chrome !== 'undefined' && chrome.downloads && chrome.downloads.download) {
    // Usar la API de Chrome para descargar el archivo
    chrome.downloads.download({
      url: URL.createObjectURL(new Blob([content], { type: 'text/plain' })),
      filename: outputPath,
      saveAs: false
    }, (downloadId: number) => {
      if (chrome.runtime.lastError) {
        console.error('Error al guardar el archivo:', chrome.runtime.lastError);
      } else {
        console.log(`Archivo guardado con éxito: ${outputPath}`);
      }
    });
  } else {
    // Fallback para entorno de desarrollo
    console.log(`Simulando guardado de archivo: ${outputPath}`);
    console.log('Contenido:', content);
  }
}

const calculateEstimatedTime = (startTime: number, processedFiles: number, totalFiles: number): string => {
  if (processedFiles === 0) return 'Calculando...'
  
  const elapsedTime = Date.now() - startTime
  const averageTimePerFile = elapsedTime / processedFiles
  const remainingFiles = totalFiles - processedFiles
  const estimatedRemainingTime = remainingFiles * averageTimePerFile

  return formatTime(estimatedRemainingTime)
}

const formatTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
  }
}

export { calculateEstimatedTime }