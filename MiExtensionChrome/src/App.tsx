import React, { useState, useCallback } from 'react'
import FileSelector from './components/FileSelector'
import FileList from './components/FileList'
import OutputOptions from './components/OutputOptions'
import APIKeyManager from './components/APIKeyManager'
import ProcessingStatus from './components/ProcessingStatus'
import { processFiles } from './utils/fileProcessor'
import './App.css'

interface FileStatus {
  progress: number;
  estimatedTime: string;
  isPaused: boolean;
}

const App: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [apiKey, setApiKey] = useState('')
  const [customGptUrl, setCustomGptUrl] = useState('')
  const [outputOptions, setOutputOptions] = useState({
    format: 'txt',
    quantity: 'single',
    outputFolder: ''
  })
  const [fileStatuses, setFileStatuses] = useState<{ [key: string]: FileStatus }>({})
  const [processingStatus, setProcessingStatus] = useState({
    isProcessing: false,
    progress: 0,
    message: '',
    estimatedTime: ''
  })

  const handleFileSelect = useCallback((files: File[]) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...files])
  }, [])

  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
    setFileStatuses((prevStatuses) => {
      const newStatuses = { ...prevStatuses }
      delete newStatuses[selectedFiles[index].name]
      return newStatuses
    })
  }, [selectedFiles])

  const handlePauseFile = useCallback((index: number) => {
    setFileStatuses((prevStatuses) => ({
      ...prevStatuses,
      [selectedFiles[index].name]: {
        ...prevStatuses[selectedFiles[index].name],
        isPaused: !prevStatuses[selectedFiles[index].name]?.isPaused
      }
    }))
  }, [selectedFiles])

  const handleApiKeyChange = useCallback((key: string) => {
    setApiKey(key)
  }, [])

  const handleCustomGptUrlChange = useCallback((url: string) => {
    setCustomGptUrl(url)
  }, [])

  const handleOutputOptionsChange = useCallback((options: typeof outputOptions) => {
    setOutputOptions(options)
  }, [])

  const updateStatus = useCallback((progress: number, message: string, estimatedTime: string, fileName?: string) => {
    setProcessingStatus((prevStatus) => ({
      ...prevStatus,
      progress,
      message,
      estimatedTime
    }))

    if (fileName) {
      setFileStatuses((prevStatuses) => ({
        ...prevStatuses,
        [fileName]: {
          ...prevStatuses[fileName],
          progress,
          estimatedTime
        }
      }))
    }
  }, [])

  const handleProcessFiles = useCallback(async () => {
    if (selectedFiles.length === 0 || !apiKey) {
      alert('Por favor, seleccione archivos e ingrese una clave API')
      return
    }

    setProcessingStatus({
      isProcessing: true,
      progress: 0,
      message: 'Iniciando procesamiento...',
      estimatedTime: 'Calculando...'
    })

    try {
      await processFiles(selectedFiles, outputOptions, apiKey, customGptUrl, updateStatus)
      setProcessingStatus((prevStatus) => ({
        ...prevStatus,
        isProcessing: false,
        message: 'Procesamiento completado',
        progress: 100
      }))
    } catch (error) {
      console.error('Error al procesar archivos:', error)
      setProcessingStatus((prevStatus) => ({
        ...prevStatus,
        isProcessing: false,
        message: 'Error al procesar archivos',
        progress: 0
      }))
    }
  }, [selectedFiles, outputOptions, apiKey, customGptUrl, updateStatus])

  return (
    <div className="app">
      <div className="app-container">
        <div className="top-panel">
          <FileSelector onFileSelect={handleFileSelect} />
          <FileList
            files={selectedFiles}
            onRemoveFile={handleRemoveFile}
            onPauseFile={handlePauseFile}
            fileStatuses={fileStatuses}
          />
        </div>
        <div className="bottom-panel">
          <div className="left-panel">
            <OutputOptions onChange={handleOutputOptionsChange} />
            <APIKeyManager
              onApiKeyChange={handleApiKeyChange}
              onCustomGptUrlChange={handleCustomGptUrlChange}
            />
          </div>
          <div className="right-panel">
            <button className="process-button" onClick={handleProcessFiles}>
              Procesar Archivos
            </button>
            <ProcessingStatus status={processingStatus} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
