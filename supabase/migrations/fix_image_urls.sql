-- Normalize image_url values for menu_items
UPDATE public.menu_items
SET image_url = NULLIF(BTRIM(image_url), '')
WHERE image_url IS NOT NULL;

UPDATE public.menu_items
SET image_url = REGEXP_REPLACE(image_url, '^http://', 'https://')
WHERE image_url ~ '^http://';

