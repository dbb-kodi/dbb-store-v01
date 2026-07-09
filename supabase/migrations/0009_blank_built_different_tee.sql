-- 0009_blank_built_different_tee.sql
--
-- 0005 blanked the six product images that carried a third party's brand mark
-- or showed the wrong object entirely, and deliberately left two alone on the
-- grounds that they were merely weak rather than infringing.
--
-- That was the wrong call for one of them. photo-1564382225035 is a rooftop
-- scene in which the tee is a small fraction of the frame — no legal exposure,
-- but a product photo that doesn't show the product reads to a shopper as a
-- broken page, which is worse than an honest placeholder. It appeared on the
-- shop grid, the home featured rail, the related-products rail, and as the
-- TEES category tile.
--
-- the-movement-tee (photo-1722310752951, a cream tee on a hanger) stays: it is
-- unremarkable, but it does show the garment.
--
-- Rerunnable: matches by URL substring, so applying twice is a no-op.

begin;

update public.products
set image_url = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%221000%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23111111%22%2F%3E%3C%2Fsvg%3E'
where image_url like '%photo-1564382225035%';  -- built-different-tee (rooftop scene, garment barely in frame)

commit;

-- Verify (should return zero rows):
--   select slug from public.products where image_url like '%photo-1564382225035%';
