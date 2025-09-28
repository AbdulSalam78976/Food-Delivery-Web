import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ToastProvider from './components/toast/ToastProvider.jsx'
import { BrowserRouter } from 'react-router-dom'
import StoreContextProvider from './components/context/storecontext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <StoreContextProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </StoreContextProvider>
    </BrowserRouter>
  </StrictMode>
)
