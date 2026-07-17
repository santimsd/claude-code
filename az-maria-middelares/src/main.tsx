import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Afmelden from './Afmelden.tsx'
import { brand, applyBrandTheme } from './brand'

// Merkkleuren toepassen en paginatitel zetten op basis van het actieve merk.
applyBrandTheme()

// Lichte routing zonder extra library: /afmelden toont de afmeldpagina,
// alle andere paden het aanvraagformulier.
const isAfmelden = window.location.pathname.replace(/\/$/, '').endsWith('/afmelden');
document.title = isAfmelden
  ? `${brand.nameFull} — Zorgbed afmelden`
  : `${brand.nameFull} — Zorgbed Aanvragen`;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAfmelden ? <Afmelden /> : <App />}
  </StrictMode>,
)
