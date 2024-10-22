import React from 'react'

interface ProcessingStatusProps {
  status: {
    isProcessing: boolean;
    progress: number;
    message: string;
    estimatedTime: string;
  };
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ status }) => {
  return (
    <div className="processing-status">
      {status.isProcessing && (
        <>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${status.progress}%` }}
            ></div>
          </div>
          <p>{status.message}</p>
          <p>Tiempo estimado: {status.estimatedTime}</p>
        </>
      )}
    </div>
  )
}

export default ProcessingStatus