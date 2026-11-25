import { createBrowserRouter } from 'react-router'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { ExpensesPage } from './pages/ExpensesPage'
import { HistoryPage } from './pages/HistoryPage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { RegisterPage } from './pages/RegisterPage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'historikk', Component: HistoryPage },
      { path: 'utgifter', Component: ExpensesPage },
      { path: 'registrer', Component: RegisterPage },
      { path: 'logg-inn', Component: LoginPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
