// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRoutes from './routes/AppRoutes.jsx'
import './index.css'

// Import AG Grid registry
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'

// Register all community modules once here
ModuleRegistry.registerModules([AllCommunityModule])

// Import ONLY a theme (new Theming API, no ag-grid.css!)
import "ag-grid-community/styles/ag-theme-quartz.css"
// or choose another: "ag-theme-alpine.css", "ag-theme-material.css"

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <AppRoutes />
  // </StrictMode>,
)
