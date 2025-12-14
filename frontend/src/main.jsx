import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { store } from './store/store'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#121826',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#00C29A',
              secondary: '#121826',
            },
            style: {
              background: '#121826',
              color: '#ffffff',
              border: '1px solid rgba(0, 194, 154, 0.3)',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#121826',
            },
            style: {
              background: '#121826',
              color: '#ffffff',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            },
          },
        }}
      />
    </Provider>
  </StrictMode>,
)
