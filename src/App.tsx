import React from 'react'
import { Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import PrivateRoute from './components/PrivateRoute.tsx'
import HomePage from './pages/HomePage.tsx'
import StatsPage from './pages/StatsPage.tsx'
import InputNewPage from './pages/InputNewPage.tsx'
import InputEditPage from './pages/InputEditPage.tsx'
import OutputPage from './pages/OutputPage.tsx'
import LandingPage from './pages/LandingPage.tsx'

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('エラーが発生しました:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">エラーが発生しました</h1>
            <p className="text-gray-600 mb-4">ページを再読み込みしてください</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              再読み込み
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route element={<PrivateRoute />} >
          <Route path='/home' element={<HomePage />} />
          <Route path='/stats' element={<StatsPage />} />
          <Route path='/inputs/new' element={<InputNewPage />} />
          <Route path='/inputs/:id/edit' element={<InputEditPage />} />
          <Route path='/inputs/:id/output' element={<OutputPage />} />
        </Route>
      </Routes >
    </ErrorBoundary >
  )
}

export default App