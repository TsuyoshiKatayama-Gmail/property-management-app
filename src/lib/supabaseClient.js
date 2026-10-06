import { createClient } from '@supabase/supabase-js'

// .env から Supabase の接続情報を読み込む
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// 環境変数が未設定の場合は開発者に分かるように警告を出す
if (!supabaseUrl || !supabasePublishableKey) {
  console.warn(
    'Supabase の環境変数が設定されていません。.env に VITE_SUPABASE_URL と VITE_SUPABASE_PUBLISHABLE_KEY を設定してください。'
  )
}

// アプリ全体で使い回す Supabase クライアント
export const supabase = createClient(supabaseUrl, supabasePublishableKey)
