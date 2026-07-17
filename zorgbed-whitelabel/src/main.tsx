import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { brand, applyBrandTheme } from './brand'

// Merkkleuren toepassen en paginatitel zetten op basis van het actieve merk.
applyBrandTheme()
document.title = `${brand.nameFull} — Zorgbed Aanvragen`

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
