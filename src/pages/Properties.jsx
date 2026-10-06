import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'

// 物件一覧画面（ログイン後に表示される）
export default function Properties() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [properties, setProperties] = useState([]) // 物件データ一覧
  const [loading, setLoading] = useState(true) // 取得中かどうか
  const [error, setError] = useState('') // エラーメッセージ

  // 画面表示時に Supabase から物件データを取得する
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      setError('')

      // properties テーブルから物件名・家賃・エリアを取得（登録日時の昇順）
      const { data, error } = await supabase
        .from('properties')
        .select('id, name, rent, area')
        .order('created_at', { ascending: true })

      setLoading(false)

      if (error) {
        // 取得失敗時はエラーメッセージを表示する
        setError('物件データの取得に失敗しました：' + error.message)
        return
      }

      setProperties(data)
    }

    fetchProperties()
  }, [])

  // ログアウト処理
  const handleLogout = async () => {
    await signOut()
    // ログアウト後はログイン画面へ遷移する
    navigate('/login')
  }

  // 家賃を「¥85,000」形式に整形する
  const formatRent = (rent) => '¥' + rent.toLocaleString('ja-JP')

  return (
    <div className="properties-page">
      <header className="app-header">
        <div>
          <h1>物件一覧</h1>
          {user && <p className="user-email">{user.email} でログイン中</p>}
        </div>
        <button className="logout-button" onClick={handleLogout}>
          ログアウト
        </button>
      </header>

      <main>
        {/* 取得中・エラー・0件・一覧表示をそれぞれ出し分ける */}
        {loading && <p className="status-text">読み込み中...</p>}

        {error && <p className="error">{error}</p>}

        {!loading && !error && properties.length === 0 && (
          <p className="status-text">登録されている物件はありません。</p>
        )}

        {!loading && !error && properties.length > 0 && (
          <div className="property-grid">
            {properties.map((property) => (
              <div className="property-card" key={property.id}>
                <h2 className="property-name">{property.name}</h2>
                <p className="property-rent">{formatRent(property.rent)} / 月</p>
                <p className="property-area">エリア：{property.area}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
