-- Allow public read access for categories and menu_items under RLS
-- These policies enable anonymous reads for listing menu and filter data

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories"
ON public.categories FOR SELECT
USING (true);

CREATE POLICY "Public read available menu items"
ON public.menu_items FOR SELECT
USING (is_available IS TRUE);
