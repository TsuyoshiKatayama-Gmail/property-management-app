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

## デプロイ（Vercel）

本アプリは Vercel にデプロイしています。GitHub リポジトリと連携しており、`main` ブランチへの push で本番環境へ自動デプロイされます。

- **本番 URL**: https://property-management-app-g1ct.vercel.app/
- **連携リポジトリ**: https://github.com/TsuyoshiKatayama-Gmail/property-management-app

### プロジェクト設定（Settings > Build and Deployment）

| 項目 | 設定値 |
|------|--------|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | 既定（Override なし） |
| Node.js Version | 既定（Override なし） |

> `vercel.json` の `rewrites` により、全パスを `/index.html` に書き換えて SPA（React Router）のルーティングに対応しています。

### 環境（Settings > Environments）

| 環境 | ブランチ連携 | ドメイン |
|------|--------------|----------|
| Production | `main` | 下記3ドメイン |
| Preview | 未割り当ての全 git ブランチ | カスタムドメインなし |
| Development | CLI からアクセス | カスタムドメインなし |

Production に割り当てられているドメイン：

- https://property-management-app-g1ct.vercel.app/ （本番 URL）
- property-management-app-g1ct-acme-6db9.vercel.app
- property-management-app-g1ct-git-main-acme-6db9.vercel.app

### 環境変数（Settings > Environment Variables）

Vercel ダッシュボード側に以下を登録しています（**値は機密のため Git には含めません**）。

| 変数名 | 説明 |
|--------|------|
| `VITE_SUPABASE_URL` | Supabase の Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase の Publishable key |

## 注意

- `.env` は機密情報を含むため Git 管理対象外です（`.gitignore` で除外済み）。
- Supabase 側でメール確認が有効な場合、会員登録後に確認メールのクリックが必要です。
- 環境変数を Vercel 側で変更した場合は、反映のため再デプロイ（Redeploy）が必要です。
