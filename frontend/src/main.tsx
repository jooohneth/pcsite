import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import LoginPage from './pages/Login.tsx'
import RegisterPage from './pages/Register.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/register' element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
