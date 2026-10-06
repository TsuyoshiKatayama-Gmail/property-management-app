import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ログイン済みユーザーだけが閲覧できるルートを表すコンポーネント
// 未ログインの場合はログイン画面へリダイレクトする
export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  // セッション確認中はローディング表示を出す
  if (loading) {
    return <div className="loading">読み込み中...</div>
  }

  // 未ログインならログイン画面へ
  if (!session) {
    return <Navigate to="/login" replace />
  }

  // ログイン済みなら子コンポーネントを表示する
  return children
}
