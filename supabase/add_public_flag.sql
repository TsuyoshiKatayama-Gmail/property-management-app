-- ============================================================
-- 公開フラグ（is_public）機能のセットアップ（冪等・再実行可能）
--
-- 目的:
--   物件に「公開フラグ（is_public）」を持たせ、ON の物件は
--   所有者以外のログインユーザーも「閲覧のみ」できるようにする。
--   追加・編集・削除は従来どおり所有者本人だけが行える。
--
-- 使い方:
--   Supabase ダッシュボード > SQL Editor に貼り付けて実行してください。
--   （add_owner_management.sql を実行済みの前提）
-- ============================================================

-- 1) 公開フラグのカラムを追加する（既にあれば何もしない）
--    デフォルトは false（非公開）。
alter table public.properties
  add column if not exists is_public boolean not null default false;

-- 2) 閲覧（SELECT）ポリシーを「自分の物件 または 公開物件」に貼り替える
--    まず所有者限定の旧ポリシーを削除する。
drop policy if exists "自分の物件のみ閲覧可能" on public.properties;

drop policy if exists "自分の物件または公開物件を閲覧可能" on public.properties;
create policy "自分の物件または公開物件を閲覧可能"
  on public.properties
  for select
  to authenticated
  using (owner_id = auth.uid() or is_public = true);

-- ※ 追加（INSERT）・更新（UPDATE）・削除（DELETE）のポリシーは変更不要。
--    引き続き所有者本人（owner_id = auth.uid()）のみ許可されるため、
--    他ユーザーの公開物件は閲覧専用になる。
