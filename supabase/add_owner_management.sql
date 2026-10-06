-- ============================================================
-- ユーザーごとの所有者管理機能のセットアップ（冪等・再実行可能）
--
-- 目的:
--   物件に「所有者（owner_id）」を持たせ、各ユーザーは
--   自分が登録した物件だけを 閲覧・追加・更新・削除 できるようにする。
--
-- 使い方:
--   Supabase ダッシュボード > SQL Editor に貼り付けて実行してください。
--   （schema.sql / add_crud_policies.sql を実行済みの前提）
--
-- 注意:
--   既存の物件（owner_id が NULL のサンプルデータ等）は、どのユーザーの
--   ものでもないため一覧に表示されなくなります。必要なら下部の補足を参照。
-- ============================================================

-- 1) 所有者カラムを追加する（既にあれば何もしない）
--    auth.users を参照し、ユーザー削除時は物件も一緒に削除する。
--    default auth.uid() により、INSERT 時にログインユーザーが自動的に所有者になる。
alter table public.properties
  add column if not exists owner_id uuid
  references auth.users (id) on delete cascade
  default auth.uid();

-- 2) 絞り込みを高速化するためのインデックス（既にあれば何もしない）
create index if not exists properties_owner_id_idx
  on public.properties (owner_id);

-- 3) RLS ポリシーを「所有者本人のみ」に貼り替える
--    まず既存の全ユーザー向けポリシーを削除する。
drop policy if exists "ログインユーザーは物件を閲覧可能" on public.properties;
drop policy if exists "ログインユーザーは物件を追加可能" on public.properties;
drop policy if exists "ログインユーザーは物件を更新可能" on public.properties;
drop policy if exists "ログインユーザーは物件を削除可能" on public.properties;

-- 閲覧（SELECT）: 自分が所有する物件だけ見られる
drop policy if exists "自分の物件のみ閲覧可能" on public.properties;
create policy "自分の物件のみ閲覧可能"
  on public.properties
  for select
  to authenticated
  using (owner_id = auth.uid());

-- 追加（INSERT）: 自分を所有者とする物件だけ登録できる
drop policy if exists "自分の物件のみ追加可能" on public.properties;
create policy "自分の物件のみ追加可能"
  on public.properties
  for insert
  to authenticated
  with check (owner_id = auth.uid());

-- 更新（UPDATE）: 自分が所有する物件だけ編集できる
--    using で対象行を限定し、with check で他人へ付け替えられないようにする。
drop policy if exists "自分の物件のみ更新可能" on public.properties;
create policy "自分の物件のみ更新可能"
  on public.properties
  for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- 削除（DELETE）: 自分が所有する物件だけ削除できる
drop policy if exists "自分の物件のみ削除可能" on public.properties;
create policy "自分の物件のみ削除可能"
  on public.properties
  for delete
  to authenticated
  using (owner_id = auth.uid());

-- ============================================================
-- 補足: 既存の owner_id が NULL の物件を特定ユーザーに割り当てたい場合
--   下記の <USER_ID> を自分のユーザーID（auth.users の id）に置き換えて実行する。
--   ※ ユーザーIDは Supabase ダッシュボード > Authentication > Users で確認できる。
--
-- update public.properties
--   set owner_id = '<USER_ID>'
--   where owner_id is null;
-- ============================================================
