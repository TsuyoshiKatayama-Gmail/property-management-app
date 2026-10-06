import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// 物件一覧のダミーデータ（物件名・家賃・エリア）
const DUMMY_PROPERTIES = [
  { id: 1, name: 'グランドメゾン秋田中央', rent: 85000, area: '秋田市中央' },
  { id: 2, name: 'リバーサイド川反レジデンス', rent: 72000, area: '秋田市川反' },
  { id: 3, name: 'サンシャイン土崎ハイツ', rent: 58000, area: '秋田市土崎' },
  { id: 4, name: 'パークビュー御所野', rent: 94000, area: '秋田市御所野' },
  { id: 5, name: 'コンフォート横手ステーション', rent: 63000, area: '横手市駅前' },
  { id: 6, name: 'ノースフォレスト大館', rent: 51000, area: '大館市' },
]

// 物件一覧画面（ログイン後に表示される）
export default function Properties() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

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

      <main className="property-grid">
        {DUMMY_PROPERTIES.map((property) => (
          <div className="property-card" key={property.id}>
            <h2 className="property-name">{property.name}</h2>
            <p className="property-rent">{formatRent(property.rent)} / 月</p>
            <p className="property-area">エリア：{property.area}</p>
          </div>
        ))}
      </main>
    </div>
  )
}
