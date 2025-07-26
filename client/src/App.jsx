import { useState } from 'react'

import { Routes, Route } from 'react-router-dom'
import Protected from './pages/Protected'
import LoginComponent from './pages/Login'
import RegisterComponent from './pages/Signup'
import PublicRoute from './PublicRoute'

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Protected />} />
        <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginComponent />
          </PublicRoute>
        }
      />
        <Route path="/register" element={
          <PublicRoute>
            <RegisterComponent />
          </PublicRoute>
        } />
      </Routes>
    </div>
      
  )
}

export default App
