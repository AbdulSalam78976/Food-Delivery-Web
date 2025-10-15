import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ToastProvider from './components/toast/ToastProvider.jsx'
import { BrowserRouter } from 'react-router-dom'
import StoreContextProvider from './components/context/storecontext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

console.log('🚀 App is starting to load...')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StoreContextProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </StoreContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)

console.log('✅ App has been rendered!')
