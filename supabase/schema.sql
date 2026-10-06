-- ============================================================
-- 物件テーブル（properties）のスキーマ定義
-- Supabase ダッシュボード > SQL Editor に貼り付けて実行してください
-- ============================================================

-- 1. 物件テーブルの作成
create table if not exists public.properties (
  id         bigint generated always as identity primary key, -- 物件ID（自動採番）
  name       text        not null,                            -- 物件名
  rent       integer     not null,                            -- 家賃（円）
  area       text        not null,                            -- エリア
  created_at timestamptz not null default now()               -- 登録日時
);

-- 2. 行レベルセキュリティ（RLS）を有効化
--    これにより、下で定義したポリシーに合致するアクセスだけが許可される
alter table public.properties enable row level security;

-- 3. ポリシー: ログイン済み（authenticated）ユーザーは物件を閲覧できる
drop policy if exists "ログインユーザーは物件を閲覧可能" on public.properties;
create policy "ログインユーザーは物件を閲覧可能"
  on public.properties
  for select
  to authenticated
  using (true);

-- （参考）物件の追加・編集・削除も許可したい場合は以下のポリシーを有効化する
-- create policy "ログインユーザーは物件を追加可能"
--   on public.properties for insert to authenticated with check (true);
-- create policy "ログインユーザーは物件を更新可能"
--   on public.properties for update to authenticated using (true) with check (true);
-- create policy "ログインユーザーは物件を削除可能"
--   on public.properties for delete to authenticated using (true);

-- 4. サンプルデータの投入（物件名・家賃・エリア）
insert into public.properties (name, rent, area) values
  ('グランドメゾン秋田中央',       85000, '秋田市中央'),
  ('リバーサイド川反レジデンス',   72000, '秋田市川反'),
  ('サンシャイン土崎ハイツ',       58000, '秋田市土崎'),
  ('パークビュー御所野',           94000, '秋田市御所野'),
  ('コンフォート横手ステーション', 63000, '横手市駅前'),
  ('ノースフォレスト大館',         51000, '大館市');
