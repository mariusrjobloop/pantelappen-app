import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/figtree'
import './index.css'
import { AuthProvider } from './components/layout/AuthProvider'
import { queryClient } from './lib/queryClient'
import { router } from './router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
