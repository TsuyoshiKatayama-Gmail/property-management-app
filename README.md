# 不動産管理アプリ（property-management-app）

React + Vite + Supabase で構成した、認証機能付きの不動産管理 Web アプリです。

## 主な機能

- メールアドレス＋パスワードによる会員登録・ログイン・ログアウト
- ログイン後は物件一覧画面（物件名・家賃・エリアをカード表示）へ遷移
- 未ログイン時はログイン画面へ自動リダイレクト

## セットアップ

```bash
# 1. 依存関係をインストール
npm install

# 2. .env を作成して Supabase の接続情報を設定
cp .env.example .env
#    VITE_SUPABASE_URL と VITE_SUPABASE_PUBLISHABLE_KEY を自分の値に書き換える

# 3. 開発サーバー起動（http://localhost:5173）
npm run dev
```

## 技術スタック

| 分類 | 使用技術 |
|------|----------|
| フロントエンド | React 18 + Vite |
| 認証・バックエンド | Supabase |
| ルーティング | React Router v6 |

## 注意

- `.env` は機密情報を含むため Git 管理対象外です（`.gitignore` で除外済み）。
- Supabase 側でメール確認が有効な場合、会員登録後に確認メールのクリックが必要です。
