-- 0005_blank_infringing_images.sql
--
-- Phase 0 harm reduction. Six of the eight seeded product images, and three of
-- the four community images, carry a third party's brand mark or show something
-- other than the product. Each was verified by downloading the file and viewing it:
--
--   photo-1499972777470  a red woven "UNSPLASH / VANSCHNEIDER" tag on the garment
--   photo-1612978322313  an embroidered "UNDERGROUND SNAX" shield
--   photo-1494578924983  a hooded figure in a concrete memorial installation (and a windbreaker, not a tee)
--   photo-1678951671924  a beanie printed "KASIDEEP — THE PRODUCER EDITION"
--   photo-1606748294390  a macro of an adidas logo on a knit shoe upper
--   photo-1583911201080  a CDC-branded duffel packed with biohazard bags and PPE
--   photo-1719620293684  a hoodie carrying a third party's graphic
--
-- Left in place (no brand mark, no legal exposure — merely weak):
--   photo-1564382225035  built-different-tee (rooftop scene, garment barely in frame)
--   photo-1722310752951  the-movement-tee (cream tee on a hanger)
--   photo-1546863929     the hero / one community frame (hooded figure, unbranded)
--
-- Products point at a neutral dark placeholder until art-directed frames land.
-- Rerunnable: matching is by URL substring, so applying twice is a no-op.

begin;

-- 800x1000 flat #111111 rectangle, matching placeholderImage() in src/lib/data/catalog.ts
-- and the aspect-[3/4] the card and PDP hard-code.
update public.products
set image_url = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%221000%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23111111%22%2F%3E%3C%2Fsvg%3E'
where image_url like '%photo-1499972777470%'   -- mindset-hoodie      (UNSPLASH watermark)
   or image_url like '%photo-1612978322313%'   -- no-excuses-hoodie   (UNDERGROUND SNAX)
   or image_url like '%photo-1494578924983%'   -- dbb-tee
   or image_url like '%photo-1678951671924%'   -- dbb-cap             (KASIDEEP)
   or image_url like '%photo-1606748294390%'   -- mindset-beanie      (adidas)
   or image_url like '%photo-1583911201080%';  -- movement-tote       (CDC biohazard)

-- Community posts: drop the rows built on infringing frames rather than blanking
-- them. A "customer photo" that is a grey rectangle is worse than one fewer post.
delete from public.community_posts
where media_url like '%photo-1612978322313%'
   or media_url like '%photo-1499972777470%'
   or media_url like '%photo-1719620293684%';

commit;

-- Verify:
--   select slug, left(image_url, 40) from public.products order by slug;
--   select count(*) from public.community_posts;
