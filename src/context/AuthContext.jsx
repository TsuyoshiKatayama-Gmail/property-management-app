import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// 認証状態をアプリ全体で共有するためのコンテキスト
const AuthContext = createContext(null)

// 認証情報を提供するプロバイダー
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null) // 現在のログインセッション
  const [loading, setLoading] = useState(true) // 初期化中かどうか

  useEffect(() => {
    // 起動時に現在のセッションを取得する
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // ログイン・ログアウトなどの状態変化を監視する
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    // クリーンアップ時に監視を解除する
    return () => subscription.unsubscribe()
  }, [])

  // メールアドレス＋パスワードで新規会員登録する
  const signUp = (email, password) =>
    supabase.auth.signUp({ email, password })

  // メールアドレス＋パスワードでログインする
  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  // ログアウトする
  const signOut = () => supabase.auth.signOut()

  const value = { session, user: session?.user ?? null, loading, signUp, signIn, signOut }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 認証情報を取り出すためのカスタムフック
export function useAuth() {
  return useContext(AuthContext)
}
