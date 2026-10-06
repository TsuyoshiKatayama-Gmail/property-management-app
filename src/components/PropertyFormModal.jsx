import { useState } from 'react'

// 物件の追加・編集を行うモーダルフォーム
// property が渡された場合は「編集」、null の場合は「新規追加」として動作する
export default function PropertyFormModal({ property, onSave, onClose }) {
  // 編集時は既存の値を初期値にする（新規時は空）
  const [name, setName] = useState(property?.name ?? '')
  const [rent, setRent] = useState(property?.rent ?? '')
  const [area, setArea] = useState(property?.area ?? '')
  const [imageFile, setImageFile] = useState(null) // 新しく選択された画像ファイル
  const [previewUrl, setPreviewUrl] = useState(property?.image_url ?? '') // プレビュー表示用URL
  const [removeImage, setRemoveImage] = useState(false) // 既存画像を削除するかどうか
  const [isPublic, setIsPublic] = useState(property?.is_public ?? true) // 公開するかどうか（新規は既定で公開）
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const isEdit = Boolean(property) // 編集モードかどうか

  // 画像ファイルが選択されたときの処理（プレビューを表示する）
  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setRemoveImage(false) // 新しい画像を選んだので削除フラグは解除する
    // ブラウザ内で一時的なプレビューURLを生成する
    setPreviewUrl(URL.createObjectURL(file))
  }

  // 「画像を削除」ボタンの処理（プレビューを消して削除フラグを立てる）
  const handleRemoveImage = () => {
    setImageFile(null)
    setPreviewUrl('')
    setRemoveImage(true)
  }

  // フォーム送信時の処理
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    // 入力値を整形して親コンポーネントの保存処理に渡す
    // imageFile は選択された場合のみ渡す（親側で Storage にアップロードする）
    // removeImage が true の場合は親側で画像を削除する
    const result = await onSave({
      name: name.trim(),
      rent: Number(rent),
      area: area.trim(),
      is_public: isPublic,
      imageFile,
      removeImage,
    })

    setSaving(false)

    // 保存に失敗した場合はエラーメッセージを表示してモーダルを閉じない
    if (result?.error) {
      setError('保存に失敗しました：' + result.error.message)
    }
  }

  return (
    // 背景のオーバーレイをクリックするとモーダルを閉じる
    <div className="modal-overlay" onClick={onClose}>
      {/* モーダル本体のクリックは背景に伝播させない */}
      <form
        className="modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2>{isEdit ? '物件を編集' : '物件を追加'}</h2>

        {error && <p className="error">{error}</p>}

        <label>
          物件名
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          家賃（円）
          <input
            type="number"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
            min="0"
            required
          />
        </label>

        <label>
          エリア
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
          />
        </label>

        <label>
          物件画像
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        {/* 選択中の画像、または既存の画像をプレビュー表示する */}
        {previewUrl && (
          <div className="image-preview-wrapper">
            <img className="image-preview" src={previewUrl} alt="物件画像のプレビュー" />
            <button
              type="button"
              className="button-danger"
              onClick={handleRemoveImage}
            >
              画像を削除
            </button>
          </div>
        )}

        {/* 公開設定: ON にすると他のユーザーも閲覧できる（編集・削除は不可） */}
        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <span className="checkbox-text">
            この物件を公開する
            <span className="checkbox-note">（他のユーザーが閲覧できます）</span>
          </span>
        </label>

        <div className="modal-actions">
          <button type="button" className="button-secondary" onClick={onClose}>
            キャンセル
          </button>
          <button type="submit" disabled={saving}>
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  )
}
