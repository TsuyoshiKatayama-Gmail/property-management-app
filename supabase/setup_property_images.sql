-- ============================================
-- 物件画像機能のセットアップ（再実行可能・更新用）
--
-- 使い方:
--   Supabase ダッシュボードの SQL Editor に貼り付けて実行する。
--   何度実行してもエラーにならない（冪等）ため、再設定・修正にも使える。
-- ============================================

-- 1) properties テーブルに画像URL用カラムを追加（既にあれば何もしない）
alter table properties add column if not exists image_url text;

-- 2) 画像保存用の Storage バケットを作成（既にあれば公開設定を更新）
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do update set public = true;

-- 3) アップロード用ポリシー：いったん削除してから作り直す
--    ログイン済みユーザーが自分のフォルダ（ユーザーID配下）にのみアップロード可能
drop policy if exists "認証ユーザーは画像をアップロードできる" on storage.objects;
create policy "認証ユーザーは画像をアップロードできる"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'property-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 4) 閲覧用ポリシー：いったん削除してから作り直す
--    画像は誰でも閲覧可能（公開URL表示用）
drop policy if exists "画像は誰でも閲覧できる" on storage.objects;
create policy "画像は誰でも閲覧できる"
on storage.objects for select to public
using (bucket_id = 'property-images');

-- 5) 削除用ポリシー：いったん削除してから作り直す
--    ログイン済みユーザーは自分のフォルダ（ユーザーID配下）の画像を削除可能
drop policy if exists "認証ユーザーは自分の画像を削除できる" on storage.objects;
create policy "認証ユーザーは自分の画像を削除できる"
on storage.objects for delete to authenticated
using (
  bucket_id = 'property-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);
