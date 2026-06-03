import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/global.css'
import App from './App.tsx'
import { GlobalStoreProvider } from './store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <GlobalStoreProvider>
        <App />
      </GlobalStoreProvider>
    </BrowserRouter>
  </StrictMode>,
)
