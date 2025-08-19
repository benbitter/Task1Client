import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Routes } from './Routes.jsx'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import {GoogleOAuthProvider} from "@react-oauth/google"

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <GoogleOAuthProvider clientId="386959515770-ibtut74slp55ehlis7d1sh0u5ku412d3.apps.googleusercontent.com">
    <RouterProvider router={Routes} voiceEnabled={true} />
  </GoogleOAuthProvider>


  // </StrictMode>,
)
