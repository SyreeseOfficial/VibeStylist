import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { VibeProvider } from './context/VibeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <VibeProvider>
      <App />
    </VibeProvider>
  </StrictMode>,
)
