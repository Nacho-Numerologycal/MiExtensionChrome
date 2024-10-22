import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface FileSelectorProps {
  onFileSelect: (files: File[]) => void;
}

const FileSelector: React.FC<FileSelectorProps> = ({ onFileSelect }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFileSelect(acceptedFiles)
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()} className="file-selector">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Suelte los archivos aquí ...</p>
      ) : (
        <p>Arrastre y suelte archivos aquí, o haga clic para seleccionar</p>
      )}
    </div>
  )
}

export default FileSelector