import { Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import HomePage from './pages/HomePage.tsx'
import InputNewPage from './pages/InputNewPage.tsx'
import InputEditPage from './pages/InputEditPage.tsx'
import OutputPage from './pages/OutputPage.tsx'

function App() {
  return (
    <Routes>
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/' element={<HomePage />} />
      <Route path='/inputs/new' element={<InputNewPage />} />
      <Route path='/inputs/:id' element={<InputEditPage />} />
      <Route path='/inputs/:id/output' element={<OutputPage />} />
    </Routes>
  )
}

export default App