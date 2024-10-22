import React, { useState, useEffect } from 'react'
import { encryptData, decryptData } from '../utils/encryption'

interface APIKeyManagerProps {
  onApiKeyChange: (key: string) => void;
  onCustomGptUrlChange: (url: string) => void;
}

const APIKeyManager: React.FC<APIKeyManagerProps> = ({ onApiKeyChange, onCustomGptUrlChange }) => {
  const [apiKey, setApiKey] = useState('')
  const [password, setPassword] = useState('')
  const [customGptUrl, setCustomGptUrl] = useState('')

  useEffect(() => {
    const encryptedKey = localStorage.getItem('encryptedApiKey')
    if (encryptedKey) {
      setApiKey('********') // Mostrar asteriscos en lugar de la clave real
    }
  }, [])

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value)
    onApiKeyChange(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleCustomGptUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomGptUrl(e.target.value)
    onCustomGptUrlChange(e.target.value)
  }

  const handleSaveApiKey = () => {
    if (!apiKey || !password) {
      alert('Por favor, ingrese tanto la clave API como la contraseña')
      return
    }

    const encryptedKey = encryptData(apiKey, password)
    localStorage.setItem('encryptedApiKey', encryptedKey)
    alert('Clave API guardada de forma segura')
    onApiKeyChange(apiKey)
  }

  const handleLoadApiKey = () => {
    const encryptedKey = localStorage.getItem('encryptedApiKey')
    if (encryptedKey && password) {
      try {
        const decryptedKey = decryptData(encryptedKey, password)
        setApiKey(decryptedKey)
        onApiKeyChange(decryptedKey)
        alert('Clave API cargada correctamente')
      } catch (error) {
        alert('Error al descifrar la clave API. Verifique su contraseña.')
      }
    } else {
      alert('No hay clave API guardada o falta la contraseña')
    }
  }

  return (
    <div className="api-key-manager">
      <h3>Gestión de Clave API</h3>
      <div>
        <label htmlFor="apiKey">Clave API:</label>
        <input
          type="password"
          id="apiKey"
          value={apiKey}
          onChange={handleApiKeyChange}
          placeholder="Ingrese su clave API"
        />
      </div>
      <div>
        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Contraseña para cifrar/descifrar"
        />
      </div>
      <div>
        <label htmlFor="customGptUrl">URL personalizada de GPT:</label>
        <input
          type="text"
          id="customGptUrl"
          value={customGptUrl}
          onChange={handleCustomGptUrlChange}
          placeholder="URL personalizada de GPT (opcional)"
        />
      </div>
      <button onClick={handleSaveApiKey}>Guardar Clave API</button>
      <button onClick={handleLoadApiKey}>Cargar Clave API</button>
    </div>
  )
}

export default APIKeyManager