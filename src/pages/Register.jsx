import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// 会員登録画面
export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // フォーム送信時の処理
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    const { data, error } = await signUp(email, password)

    setLoading(false)

    if (error) {
      // 登録失敗時はエラーメッセージを表示する
      setError('会員登録に失敗しました：' + error.message)
      return
    }

    // メール確認が有効な場合、セッションがまだ発行されないことがある
    if (data.session) {
      // すぐにログイン状態になった場合は物件一覧へ遷移する
      navigate('/')
    } else {
      // 確認メールが送信された場合の案内を表示する
      setMessage('確認メールを送信しました。メールを確認してログインしてください。')
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>会員登録</h1>

        {error && <p className="error">{error}</p>}
        {message && <p className="message">{message}</p>}

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
            minLength={6}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? '登録中...' : '会員登録'}
        </button>

        <p className="switch-link">
          すでにアカウントをお持ちですか？ <Link to="/login">ログイン</Link>
        </p>
      </form>
    </div>
  )
}
