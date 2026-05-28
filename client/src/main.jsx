import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { AuthProvider } from './state/AuthContext.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import AddLead from './pages/AddLead.jsx';
import Dashboard from './pages/Dashboard.jsx';
import EditLead from './pages/EditLead.jsx';
import LeadDetails from './pages/LeadDetails.jsx';
import Leads from './pages/Leads.jsx';
import Login from './pages/Login.jsx';
import './styles.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="leads/new" element={<AddLead />} />
        <Route path="leads/:id" element={<LeadDetails />} />
        <Route path="leads/:id/edit" element={<EditLead />} />
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
