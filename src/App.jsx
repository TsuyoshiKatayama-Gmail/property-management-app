import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Properties from './pages/Properties'

// アプリ全体のルーティング定義
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ログイン画面 */}
          <Route path="/login" element={<Login />} />

          {/* 会員登録画面 */}
          <Route path="/register" element={<Register />} />

          {/* 物件一覧画面（ログイン必須） */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Properties />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
