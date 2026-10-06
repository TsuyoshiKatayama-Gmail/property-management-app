import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import PropertyFormModal from '../components/PropertyFormModal'

// 物件一覧画面（ログイン後に表示される）
export default function Properties() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [properties, setProperties] = useState([]) // 物件データ一覧
  const [loading, setLoading] = useState(true) // 取得中かどうか
  const [error, setError] = useState('') // エラーメッセージ

  // モーダル表示の状態管理
  const [isModalOpen, setIsModalOpen] = useState(false) // モーダルを開いているか
  const [editingProperty, setEditingProperty] = useState(null) // 編集対象（新規追加時は null）

  // 表示モード（'grid' = タイル表示 / 'list' = 一覧表示）
  // 前回選んだ表示モードを localStorage から復元する（初期値はタイル表示）
  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem('propertiesViewMode') || 'grid'
  )

  // 表示モードを切り替え、次回のために localStorage に保存する
  const handleViewModeChange = (mode) => {
    setViewMode(mode)
    localStorage.setItem('propertiesViewMode', mode)
  }

  // Supabase から物件データを取得する
  const fetchProperties = async () => {
    setLoading(true)
    setError('')

    // properties テーブルから物件名・家賃・エリア・画像URLを取得（登録日時の昇順）
    const { data, error } = await supabase
      .from('properties')
      .select('id, name, rent, area, image_url')
      .order('created_at', { ascending: true })

    setLoading(false)

    if (error) {
      // 取得失敗時はエラーメッセージを表示する
      setError('物件データの取得に失敗しました：' + error.message)
      return
    }

    setProperties(data)
  }

  // 画面表示時に物件データを取得する
  useEffect(() => {
    fetchProperties()
  }, [])

  // 「追加」ボタン: 空のモーダルを開く
  const handleAddClick = () => {
    setEditingProperty(null)
    setIsModalOpen(true)
  }

  // 「編集」ボタン: 対象の物件をモーダルに表示する
  const handleEditClick = (property) => {
    setEditingProperty(property)
    setIsModalOpen(true)
  }

  // モーダルを閉じる
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProperty(null)
  }

  // 公開URLから Storage 上のファイルパスを取り出して削除する
  const removeStorageFile = async (publicUrl) => {
    const marker = '/property-images/'
    const index = publicUrl.indexOf(marker)
    if (index === -1) return // パスを特定できない場合は何もしない
    const filePath = publicUrl.slice(index + marker.length)
    await supabase.storage.from('property-images').remove([filePath])
  }

  // モーダルの保存処理（新規追加 or 更新）
  const handleSave = async (formData) => {
    // 画像ファイル・削除フラグは DB には保存しないので、物件データ本体と分離する
    const { imageFile, removeImage, ...propertyData } = formData

    // 画像が選択されていれば Supabase Storage にアップロードし、公開URLを取得する
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      // ユーザーごとのフォルダに一意なファイル名で保存する
      const filePath = `${user.id}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, imageFile)

      if (uploadError) {
        // アップロード失敗時はモーダルにエラーを返す
        return { error: uploadError }
      }

      // 取得した公開URLを保存データに含める
      const { data } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath)
      propertyData.image_url = data.publicUrl

      // 画像を差し替えた場合は、元の画像ファイルを Storage から削除する
      if (editingProperty?.image_url) {
        await removeStorageFile(editingProperty.image_url)
      }
    } else if (removeImage) {
      // 「画像を削除」が押された場合：URLを空にし、Storage のファイルも削除する
      propertyData.image_url = null
      if (editingProperty?.image_url) {
        await removeStorageFile(editingProperty.image_url)
      }
    }

    let result

    if (editingProperty) {
      // 編集モード: 既存レコードを更新する
      result = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', editingProperty.id)
    } else {
      // 新規追加モード: レコードを挿入する
      result = await supabase.from('properties').insert(propertyData)
    }

    // エラーがあれば呼び出し元（モーダル）に返して表示させる
    if (result.error) {
      return { error: result.error }
    }

    // 成功したらモーダルを閉じて一覧を再取得する
    handleCloseModal()
    await fetchProperties()
    return {}
  }

  // 「削除」ボタン: 確認のうえ削除する
  const handleDelete = async (property) => {
    // 誤操作防止のため確認ダイアログを表示する
    const confirmed = window.confirm(`「${property.name}」を削除しますか？`)
    if (!confirmed) return

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', property.id)

    if (error) {
      setError('削除に失敗しました：' + error.message)
      return
    }

    // 成功したら一覧を再取得する
    await fetchProperties()
  }

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
        <div className="header-actions">
          {/* 表示モード切り替え（タイル / 一覧） */}
          <div className="view-toggle" role="group" aria-label="表示モード切り替え">
            <button
              type="button"
              className={viewMode === 'grid' ? 'is-active' : ''}
              onClick={() => handleViewModeChange('grid')}
              aria-pressed={viewMode === 'grid'}
            >
              タイル
            </button>
            <button
              type="button"
              className={viewMode === 'list' ? 'is-active' : ''}
              onClick={() => handleViewModeChange('list')}
              aria-pressed={viewMode === 'list'}
            >
              一覧
            </button>
          </div>
          <button className="add-button" onClick={handleAddClick}>
            ＋ 物件を追加
          </button>
          <button className="logout-button" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </header>

      <main>
        {/* 取得中・エラー・0件・一覧表示をそれぞれ出し分ける */}
        {loading && <p className="status-text">読み込み中...</p>}

        {error && <p className="error">{error}</p>}

        {!loading && !error && properties.length === 0 && (
          <p className="status-text">登録されている物件はありません。</p>
        )}

        {!loading && !error && properties.length > 0 && (
          <div className={viewMode === 'list' ? 'property-list' : 'property-grid'}>
            {properties.map((property) => (
              <div className="property-card" key={property.id}>
                {/* 画像が登録されていれば表示し、無ければ NO IMAGE を表示する */}
                <img
                  className="property-image"
                  src={property.image_url || '/no-image.svg'}
                  alt={property.name}
                  onError={(e) => {
                    // 画像URLが無効な場合も NO IMAGE にフォールバックする
                    e.currentTarget.src = '/no-image.svg'
                  }}
                />
                <h2 className="property-name">{property.name}</h2>
                <p className="property-rent">{formatRent(property.rent)} / 月</p>
                <p className="property-area">エリア：{property.area}</p>

                {/* 各カードの操作ボタン（編集・削除） */}
                <div className="card-actions">
                  <button
                    className="button-secondary"
                    onClick={() => handleEditClick(property)}
                  >
                    編集
                  </button>
                  <button
                    className="button-danger"
                    onClick={() => handleDelete(property)}
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 追加・編集モーダル */}
      {isModalOpen && (
        <PropertyFormModal
          property={editingProperty}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}
