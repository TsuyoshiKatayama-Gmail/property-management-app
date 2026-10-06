-- ============================================================
-- 物件テーブル（properties）に 追加・編集・削除 のRLSポリシーを付与
-- 既に properties テーブルを作成済みの環境で、この内容を
-- Supabase ダッシュボード > SQL Editor に貼り付けて実行してください
-- （schema.sql を実行済みの前提。SELECT ポリシーは設定済みのため触れません）
-- ============================================================

-- 追加（INSERT）: ログイン済みユーザーは物件を登録できる
drop policy if exists "ログインユーザーは物件を追加可能" on public.properties;
create policy "ログインユーザーは物件を追加可能"
  on public.properties
  for insert
  to authenticated
  with check (true);

-- 更新（UPDATE）: ログイン済みユーザーは物件を編集できる
drop policy if exists "ログインユーザーは物件を更新可能" on public.properties;
create policy "ログインユーザーは物件を更新可能"
  on public.properties
  for update
  to authenticated
  using (true)
  with check (true);

-- 削除（DELETE）: ログイン済みユーザーは物件を削除できる
drop policy if exists "ログインユーザーは物件を削除可能" on public.properties;
create policy "ログインユーザーは物件を削除可能"
  on public.properties
  for delete
  to authenticated
  using (true);
