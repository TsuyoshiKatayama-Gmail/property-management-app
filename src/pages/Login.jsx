import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ログイン画面
export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // フォーム送信時の処理
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)

    setLoading(false)

    if (error) {
      // ログイン失敗時はエラーメッセージを表示する
      setError('ログインに失敗しました：' + error.message)
      return
    }

    // 成功したら物件一覧画面へ遷移する
    navigate('/')
  }

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>ログイン</h1>

        {error && <p className="error">{error}</p>}

        <label>
          メールアドレス
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          パスワード
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>

        <p className="switch-link">
          アカウントをお持ちでないですか？ <Link to="/register">会員登録</Link>
        </p>
      </form>
    </div>
  )
}
