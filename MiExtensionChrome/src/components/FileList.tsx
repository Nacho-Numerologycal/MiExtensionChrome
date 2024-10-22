import React from 'react'

interface FileStatus {
  progress: number;
  estimatedTime: string;
  isPaused: boolean;
}

interface FileListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
  onPauseFile: (index: number) => void;
  fileStatuses: { [key: string]: FileStatus };
}

const FileList: React.FC<FileListProps> = ({ files, onRemoveFile, onPauseFile, fileStatuses }) => {
  return (
    <div className="file-list">
      <h3>Archivos seleccionados</h3>
      {files.length === 0 ? (
        <p>No hay archivos seleccionados</p>
      ) : (
        <ul>
          {files.map((file, index) => {
            const status = fileStatuses[file.name] || { progress: 0, estimatedTime: 'Pendiente', isPaused: false };
            return (
              <li key={index}>
                <div className="file-info">
                  <span className="file-name">{file.name}</span>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${status.progress}%` }}
                    ></div>
                  </div>
                  <span className="file-status">
                    {status.progress === 100 ? 'Completado' : `${status.progress}% - Tiempo estimado: ${status.estimatedTime}`}
                  </span>
                </div>
                <div className="file-actions">
                  <button onClick={() => onPauseFile(index)}>
                    {status.isPaused ? 'Reanudar' : 'Pausar'}
                  </button>
                  <button onClick={() => onRemoveFile(index)}>Eliminar</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  )
}

export default FileList