import { useEffect, useReducer } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { onChangeLang } from './lib/i18n'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import ProgramCategory from './pages/ProgramCategory'
import Dashboard from './pages/Dashboard'
import PersonalInfo from './pages/PersonalInfo'
import NextOfKin from './pages/NextOfKin'
import AcademicInfo from './pages/AcademicInfo'
import Payment from './pages/Payment'
import Programmes from './pages/Programmes'
import Review from './pages/Review'
import Profile from './pages/Profile'
import StepGate from './components/StepGate'
import { ToastProvider } from './components/Toast'

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="auth-wrap center">{''}</div>
  return user ? children : <Navigate to="/login" replace />
}

function GuestOnly({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="auth-wrap center">{''}</div>
  return user ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  const [, force] = useReducer((x) => x + 1, 0)

  useEffect(() => onChangeLang(force), [])

  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
          <Route
            path="/"
            element={
              <GuestOnly>
                <Landing />
              </GuestOnly>
            }
          />
          <Route
            path="/login"
            element={
              <GuestOnly>
                <Login />
              </GuestOnly>
            }
          />
          <Route
            path="/register"
            element={
              <GuestOnly>
                <Register />
              </GuestOnly>
            }
          />
          <Route
            path="/apply-category"
            element={
              <GuestOnly>
                <ProgramCategory />
              </GuestOnly>
            }
          />

          <Route
            path="/dashboard"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />
          <Route
            path="/profile"
            element={
              <Protected>
                <Profile />
              </Protected>
            }
          />
          <Route
            path="/apply/personal"
            element={
              <Protected>
                <StepGate>
                  <PersonalInfo />
                </StepGate>
              </Protected>
            }
          />
          <Route
            path="/apply/kin"
            element={
              <Protected>
                <StepGate>
                  <NextOfKin />
                </StepGate>
              </Protected>
            }
          />
          <Route
            path="/apply/academic"
            element={
              <Protected>
                <StepGate>
                  <AcademicInfo />
                </StepGate>
              </Protected>
            }
          />
          <Route
            path="/apply/payment"
            element={
              <Protected>
                <StepGate>
                  <Payment />
                </StepGate>
              </Protected>
            }
          />
          <Route
            path="/apply/programmes"
            element={
              <Protected>
                <StepGate>
                  <Programmes />
                </StepGate>
              </Protected>
            }
          />
          <Route
            path="/apply/review"
            element={
              <Protected>
                <StepGate>
                  <Review />
                </StepGate>
              </Protected>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  )
}