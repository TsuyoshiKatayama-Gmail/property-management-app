import { useState } from 'react'

// 物件の追加・編集を行うモーダルフォーム
// property が渡された場合は「編集」、null の場合は「新規追加」として動作する
export default function PropertyFormModal({ property, onSave, onClose }) {
  // 編集時は既存の値を初期値にする（新規時は空）
  const [name, setName] = useState(property?.name ?? '')
  const [rent, setRent] = useState(property?.rent ?? '')
  const [area, setArea] = useState(property?.area ?? '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const isEdit = Boolean(property) // 編集モードかどうか

  // フォーム送信時の処理
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    // 入力値を整形して親コンポーネントの保存処理に渡す
    const result = await onSave({
      name: name.trim(),
      rent: Number(rent),
      area: area.trim(),
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
