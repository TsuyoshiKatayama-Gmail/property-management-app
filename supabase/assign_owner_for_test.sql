-- ============================================================
-- 【テスト用】作成済み物件に所有者（owner_id）を割り当てる
--
-- 目的:
--   owner_id が NULL の既存物件（schema.sql のサンプルデータ等）を、
--   指定したユーザーの所有に変更し、一覧に表示されるようにする。
--
-- 使い方:
--   1) 下の 'あなたのメールアドレス' を、割り当てたいユーザーの
--      ログイン用メールアドレスに書き換える。
--   2) Supabase ダッシュボード > SQL Editor に貼り付けて実行する。
--
-- ※ メールアドレスから auth.users の id を自動で引くため、
--   UUID を手でコピーする必要はありません。
-- ============================================================

-- 所有者が未設定（NULL）の物件だけを、指定ユーザーの所有にする
update public.properties
set owner_id = (
  select id from auth.users
  where email = 'あなたのメールアドレス'   -- ← ここを書き換える
)
where owner_id is null;

-- ------------------------------------------------------------
-- 確認用: 割り当て結果を一覧表示する
--   （所有者メール・公開フラグも一緒に確認できる）
-- ------------------------------------------------------------
select
  p.id,
  p.name,
  p.is_public,
  u.email as owner_email
from public.properties p
left join auth.users u on u.id = p.owner_id
order by p.created_at;
