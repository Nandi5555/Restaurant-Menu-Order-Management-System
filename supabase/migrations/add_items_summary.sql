-- Adds a normalized summary of ordered items directly on orders
-- so the orders list can render item lines without a join.

alter table public.orders
add column if not exists items_summary jsonb default '[]'::jsonb not null;

-- optional index to query by item id inside summary
create index if not exists orders_items_summary_gin on public.orders using gin (items_summary);

