// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRoutes from './routes/AppRoutes.jsx'
import './index.css'
// Import AG Grid styles
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

createRoot(document.getElementById('root')).render(
  // Temporarily comment out StrictMode to test AG Grid compatibility
  // <StrictMode>
    <AppRoutes />
  // </StrictMode>,
)
