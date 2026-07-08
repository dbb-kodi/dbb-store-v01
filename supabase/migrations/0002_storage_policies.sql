-- Run once via Supabase dashboard (Storage tab) or CLI before applying these policies:
--   supabase storage buckets create product-images --public
-- Bucket name: product-images, public = true (public read)

create policy "product_images_public_read"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "product_images_admin_write"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "product_images_admin_update"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "product_images_admin_delete"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );
