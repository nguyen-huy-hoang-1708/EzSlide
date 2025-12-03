import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Templates from './pages/Templates'
import GenerateAI from './pages/GenerateAI'
import Editor from './pages/EditorNew'
import SlidesList from './pages/SlidesList'
import Settings from './pages/Settings'
import Assets from './pages/Assets'
import Presentation from './pages/Presentation'
import Presentations from './pages/Presentations'
import PresentationDetail from './pages/PresentationDetail'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import DebugPage from './pages/DebugPage'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/debug" element={<DebugPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
      <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
      <Route path="/ai" element={<ProtectedRoute><GenerateAI /></ProtectedRoute>} />
      <Route path="/editor/:id" element={<ProtectedRoute><Editor /></ProtectedRoute>} />
      <Route path="/slides" element={<ProtectedRoute><SlidesList /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/assets" element={<ProtectedRoute><Assets /></ProtectedRoute>} />
      <Route path="/presentation/:id" element={<ProtectedRoute><Presentation /></ProtectedRoute>} />
      <Route path="/presentations" element={<ProtectedRoute><Presentations /></ProtectedRoute>} />
      <Route path="/presentations/:id" element={<ProtectedRoute><PresentationDetail /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
