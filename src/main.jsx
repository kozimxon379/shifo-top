import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Ensure clean window scroll on initial load
if (typeof document !== 'undefined') {
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
