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

function App() {
  return (
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
    </Routes>
  )
}

export default App