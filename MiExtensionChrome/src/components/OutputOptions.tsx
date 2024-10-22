import React, { useState } from 'react'

interface OutputOptionsProps {
  onChange: (options: { format: string; quantity: string; outputFolder: string }) => void;
}

const OutputOptions: React.FC<OutputOptionsProps> = ({ onChange }) => {
  const [outputFolder, setOutputFolder] = useState('')

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ format: e.target.value, quantity: 'single', outputFolder })
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ format: 'txt', quantity: e.target.value, outputFolder })
  }

  const handleOutputFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOutputFolder = e.target.value
    setOutputFolder(newOutputFolder)
    onChange({ format: 'txt', quantity: 'single', outputFolder: newOutputFolder })
  }

  const handleFolderSelection = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ action: "openFolderPicker" }, (response: { folder: string }) => {
        if (response && response.folder) {
          setOutputFolder(response.folder)
          onChange({ format: 'txt', quantity: 'single', outputFolder: response.folder })
        }
      });
    } else {
      // Fallback para entorno de desarrollo
      alert('La selección de carpeta no está disponible en el entorno de desarrollo. Por favor, ingrese la ruta manualmente.')
    }
  }

  return (
    <div className="output-options">
      <h3>Opciones de Salida</h3>
      <div>
        <label htmlFor="format">Formato:</label>
        <select id="format" onChange={handleFormatChange}>
          <option value="txt">Texto (.txt)</option>
          <option value="pdf">PDF (.pdf)</option>
          <option value="md">Markdown (.md)</option>
          <option value="json">JSON (.json)</option>
        </select>
      </div>
      <div>
        <label htmlFor="quantity">Archivos de Salida:</label>
        <select id="quantity" onChange={handleQuantityChange}>
          <option value="single">Archivo Único</option>
          <option value="multiple">Múltiples Archivos</option>
        </select>
      </div>
      <div className="output-folder-selector">
        <label htmlFor="outputFolder">Carpeta de Salida:</label>
        <input
          type="text"
          id="outputFolder"
          value={outputFolder}
          onChange={handleOutputFolderChange}
          placeholder="Seleccione la carpeta de salida"
        />
        <button onClick={handleFolderSelection}>Seleccionar Carpeta</button>
      </div>
    </div>
  )
}

export default OutputOptions