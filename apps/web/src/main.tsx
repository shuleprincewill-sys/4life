import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles.css'
import { AppShell } from './shell/AppShell'
import { PatientHome } from './routes/PatientHome'
import { PharmacyOnboarding } from './routes/PharmacyOnboarding'
import { AdminDashboard } from './routes/AdminDashboard'
import { ProvidersDirectory } from './routes/ProvidersDirectory'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <PatientHome /> },
      { path: 'pharmacy/onboarding', element: <PharmacyOnboarding /> },
      { path: 'providers', element: <ProvidersDirectory /> },
      { path: 'admin', element: <AdminDashboard /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
