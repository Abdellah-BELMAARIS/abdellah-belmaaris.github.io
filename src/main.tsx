import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './theme.css'
import App from './App.tsx'

// A new visit starts at the introduction; in-page anchors still work afterward.
function startAtTop() {
  window.history.scrollRestoration = 'manual'
  if (window.location.hash) {
    window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search)
  }
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
}

startAtTop()
window.addEventListener('pageshow', startAtTop)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
