# CLAUDE.md

このファイルは、本プロジェクトで Claude Code（および開発者）が従うべき指針をまとめたものです。
**IMPORTANT: ここに書かれたルールはデフォルト動作よりも優先されます。必ず従ってください。**

---

## プロジェクト概要

- **名称**: property-management-app（物件管理アプリ）
- **目的**: 不動産・賃貸物件の管理を行う Web アプリケーション
- **技術スタック**:
  - フロントエンド: React 18 + Vite
  - 認証・バックエンド: Supabase（メールアドレス＋パスワード認証）
  - ルーティング: React Router v6
- **主な機能**:
  - メールアドレス＋パスワードによる会員登録・ログイン・ログアウト
  - ログイン必須の物件一覧画面（未ログイン時はログイン画面へリダイレクト）

---

## Git 運用ルール（最重要）

**IMPORTANT: コードを変更するたびに、必ず GitHub へプッシュすること。**

### 基本フロー

1. コードを変更したら、変更内容を確認する
   ```bash
   git status
   git diff
   ```
2. 変更をステージングしてコミットする
   ```bash
   git add -A
   git commit -m "<変更内容を表す日本語メッセージ>"
   ```
3. **コミット後は必ず GitHub へプッシュする**
   ```bash
   git push
   ```

### ルール詳細

- **1つの意味のある変更ごとにコミットし、その都度プッシュする。** 変更を溜め込まない。
- コミットメッセージは **日本語** で、何を・なぜ変更したかが分かるように書く。
- `main` ブランチへ直接プッシュしてよいかはチーム方針に従う。ブランチ運用が定まっている場合はそれに従う。
- プッシュ前に、ビルド・テスト・Lint が通ることを確認する（下記「開発コマンド」参照）。
- 機密情報（APIキー、パスワード、`.env` など）は **絶対にコミットしない**。`.gitignore` で除外する。

### コミットメッセージの例

```
物件一覧画面のページネーション機能を追加
入居者検索でのnull参照バグを修正
READMEにセットアップ手順を追記
```

---

## セットアップ

1. 依存関係をインストールする
   ```bash
   npm install
   ```
2. `.env.example` をコピーして `.env` を作成し、Supabase の接続情報を設定する
   ```bash
   cp .env.example .env
   # VITE_SUPABASE_URL と VITE_SUPABASE_PUBLISHABLE_KEY を自分のプロジェクトの値に書き換える
   ```

## 開発コマンド

```bash
# 開発サーバー起動（http://localhost:5173）
npm run dev

# 本番ビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

---

## 環境変数

Supabase の接続情報は `.env` で管理し、**Git にはコミットしない**（`.gitignore` で除外済み）。

| 変数名 | 説明 |
|--------|------|
| `VITE_SUPABASE_URL` | Supabase の Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase の Publishable key |

> Vite では環境変数を `VITE_` プレフィックス付きで定義し、`import.meta.env.VITE_xxx` で参照する。

---

## デプロイ（Vercel）

本アプリは **Vercel** にデプロイしている。GitHub リポジトリと連携しており、**`main` ブランチへの push で本番環境へ自動デプロイ**される。

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

- SPA 用のルーティング対応として、ルート直下の `vercel.json` に `rewrites`（全パス → `/index.html`）を定義している。React Router のパスを直接開いても 404 にならないようにするための設定。

### 環境（Settings > Environments）

| 環境 | ブランチ連携 | ドメイン |
|------|--------------|----------|
| Production | `main` | property-management-app-g1ct.vercel.app ほか |
| Preview | 未割り当ての全 git ブランチ | カスタムドメインなし |
| Development | CLI からアクセス | カスタムドメインなし |

### 環境変数（Settings > Environment Variables）

Supabase の接続情報を **Vercel ダッシュボード側にも登録**している（変数名はローカルの `.env` と同一。**値は機密のため Git にはコミットしない**）。

| 変数名 | 説明 |
|--------|------|
| `VITE_SUPABASE_URL` | Supabase の Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase の Publishable key |

**IMPORTANT: Vercel 側の環境変数を変更した場合は、反映のために再デプロイ（Redeploy）が必要。**

---

## ディレクトリ構成

```
property-management-app/
├── CLAUDE.md               # 本ファイル
├── .env                    # Supabase 接続情報（Git管理外）
├── .env.example            # .env のテンプレート
├── index.html              # エントリー HTML
├── vite.config.js          # Vite 設定
├── package.json
└── src/
    ├── main.jsx            # アプリのエントリーポイント
    ├── App.jsx             # ルーティング定義
    ├── index.css           # 全体スタイル
    ├── lib/
    │   └── supabaseClient.js   # Supabase クライアント初期化
    ├── context/
    │   └── AuthContext.jsx     # 認証状態の管理（Context + カスタムフック）
    ├── components/
    │   └── ProtectedRoute.jsx  # 認証ガード（未ログイン時はリダイレクト）
    └── pages/
        ├── Login.jsx           # ログイン画面
        ├── Register.jsx        # 会員登録画面
        └── Properties.jsx      # 物件一覧画面（ログイン必須）
```

---

## アーキテクチャ / 設計方針

- **認証状態の管理**: `AuthContext` が Supabase のセッションを保持し、`onAuthStateChange` で状態変化を監視する。各コンポーネントは `useAuth()` フックで `session` / `user` / `signIn` / `signUp` / `signOut` を利用する。
- **ルート保護**: ログイン必須の画面は `ProtectedRoute` でラップする。未ログイン時は `/login` へリダイレクトし、セッション確認中はローディング表示を出す。
- **画面構成**:
  - `/login` … ログイン画面
  - `/register` … 会員登録画面
  - `/` … 物件一覧画面（ログイン必須）
- **物件データ**: 現状は `Properties.jsx` 内のダミーデータ。将来的に Supabase のテーブルから取得する想定。

---

## コーディング規約

- コメント・ドキュメント・コミットメッセージは **日本語** で記述する。
- 既存コードのスタイル（命名・インデント・コメント量）に合わせる。
- 関数・変数名は意味が明確な名前にする。
- 秘密情報をコードに直接書かない。

---

## 対応言語

- Claude への指示・応答、およびドキュメントは原則 **日本語** とする。
