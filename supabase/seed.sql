-- Seeds the 8 static products from src/lib/data/catalog.ts into real tables.
-- Run after 0001/0002 migrations. Image URLs kept as existing Unsplash URLs;
-- replace via the admin uploader once real product photos are ready.

with p1 as (
  insert into products (name, slug, description, price, category, image_url, featured, active)
  values ('Mindset Heavyweight Hoodie', 'mindset-hoodie', 'A 450gsm heavyweight hoodie built to last. Boxy fit, dropped shoulders, embroidered DBB mark.', 120, 'hoodies', 'https://images.unsplash.com/photo-1499972777470-6a932ea55420?auto=format&fit=crop&w=800&h=1000&q=80', true, true)
  returning id
)
insert into variants (product_id, size, color, stock_qty, sku)
select id, v.size, 'Black', v.stock_qty, 'MINDSET-HOODIE-' || v.size
from p1, (values ('XS',0),('S',11),('M',10),('L',9),('XL',8),('XXL',7)) as v(size, stock_qty);

with p2 as (
  insert into products (name, slug, description, price, category, image_url, featured, active)
  values ('No Excuses Hoodie', 'no-excuses-hoodie', 'Premium fleece-lined hoodie with a bold back print. Your daily reminder.', 110, 'hoodies', 'https://images.unsplash.com/photo-1612978322313-be209301e185?auto=format&fit=crop&w=800&h=1000&q=80', true, true)
  returning id
)
insert into variants (product_id, size, color, stock_qty, sku)
select id, v.size, 'Black', v.stock_qty, 'NO-EXCUSES-HOODIE-' || v.size
from p2, (values ('XS',0),('S',11),('M',10),('L',9),('XL',8),('XXL',7)) as v(size, stock_qty);

with p3 as (
  insert into products (name, slug, description, price, category, image_url, featured, active)
  values ('Built Different Tee', 'built-different-tee', 'Heavyweight cotton tee with a relaxed drape. Screen-printed graphic.', 48, 'tees', 'https://images.unsplash.com/photo-1564382225035-dbdf309682a6?auto=format&fit=crop&w=800&h=1000&q=80', true, true)
  returning id
)
insert into variants (product_id, size, color, stock_qty, sku)
select id, v.size, 'Black', v.stock_qty, 'BUILT-DIFFERENT-TEE-' || v.size
from p3, (values ('XS',0),('S',11),('M',10),('L',9),('XL',8),('XXL',7)) as v(size, stock_qty);

with p4 as (
  insert into products (name, slug, description, price, category, image_url, featured, active)
  values ('The Movement Tee', 'the-movement-tee', 'Garment-dyed essential tee. Soft hand-feel, structured collar.', 45, 'tees', 'https://images.unsplash.com/photo-1722310752951-4d459d28c678?auto=format&fit=crop&w=800&h=1000&q=80', true, true)
  returning id
)
insert into variants (product_id, size, color, stock_qty, sku)
select id, v.size, 'Black', v.stock_qty, 'THE-MOVEMENT-TEE-' || v.size
from p4, (values ('XS',0),('S',11),('M',10),('L',9),('XL',8),('XXL',7)) as v(size, stock_qty);

with p5 as (
  insert into products (name, slug, description, price, category, image_url, featured, active)
  values ('Done Being Broke Tee', 'dbb-tee', 'The statement piece. Oversized fit with chest and sleeve hits.', 50, 'tees', 'https://images.unsplash.com/photo-1494578924983-b472e391e1fa?auto=format&fit=crop&w=800&h=1000&q=80', false, true)
  returning id
)
insert into variants (product_id, size, color, stock_qty, sku)
select id, v.size, 'Black', v.stock_qty, 'DBB-TEE-' || v.size
from p5, (values ('XS',0),('S',11),('M',10),('L',9),('XL',8),('XXL',7)) as v(size, stock_qty);

with p6 as (
  insert into products (name, slug, description, price, category, image_url, featured, active)
  values ('DBB Structured Cap', 'dbb-cap', '6-panel structured cap with raised embroidery and adjustable strap.', 38, 'headwear', 'https://images.unsplash.com/photo-1678951671924-bd2c022382b0?auto=format&fit=crop&w=800&h=1000&q=80', true, true)
  returning id
)
insert into variants (product_id, size, color, stock_qty, sku)
select id, v.size, 'Black', v.stock_qty, 'DBB-CAP-' || v.size
from p6, (values ('XS',0),('S',11),('M',10),('L',9),('XL',8),('XXL',7)) as v(size, stock_qty);

with p7 as (
  insert into products (name, slug, description, price, category, image_url, featured, active)
  values ('Mindset Beanie', 'mindset-beanie', 'Ribbed cuffed beanie in heavyweight knit. One size.', 32, 'headwear', 'https://images.unsplash.com/photo-1606748294390-f6449e6c61ef?auto=format&fit=crop&w=800&h=1000&q=80', false, true)
  returning id
)
insert into variants (product_id, size, color, stock_qty, sku)
select id, v.size, 'Black', v.stock_qty, 'MINDSET-BEANIE-' || v.size
from p7, (values ('XS',0),('S',11),('M',10),('L',9),('XL',8),('XXL',7)) as v(size, stock_qty);

with p8 as (
  insert into products (name, slug, description, price, category, image_url, featured, active)
  values ('Movement Tote', 'movement-tote', 'Heavy canvas tote with reinforced straps. Carry the mindset.', 28, 'accessories', 'https://images.unsplash.com/photo-1583911201080-eb7064a15428?auto=format&fit=crop&w=800&h=1000&q=80', false, true)
  returning id
)
insert into variants (product_id, size, color, stock_qty, sku)
select id, v.size, 'Black', v.stock_qty, 'MOVEMENT-TOTE-' || v.size
from p8, (values ('XS',0),('S',11),('M',10),('L',9),('XL',8),('XXL',7)) as v(size, stock_qty);
