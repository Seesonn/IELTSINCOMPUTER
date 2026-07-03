import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App'
import './index.css'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
if (!googleClientId) {
  console.warn('VITE_GOOGLE_CLIENT_ID is not set. Google sign-in will not work.')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={googleClientId}>
        <App />
      </GoogleOAuthProvider>
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 3500,
          style: {
            background: '#fff',
            color: '#475569',
            borderLeft: '4px solid',
            borderColor: '#dc2626',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '400',
            lineHeight: '1.4',
            padding: '10px 14px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
            maxWidth: '360px',
          },
          success: {
            iconTheme: { primary: '#16a34a', secondary: '#fff' },
            style: { borderColor: '#16a34a' },
          },
          error: {
            iconTheme: { primary: '#dc2626', secondary: '#fff' },
            style: { borderColor: '#dc2626' },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
