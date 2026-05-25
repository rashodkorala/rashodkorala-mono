-- Albums feature: albums table + album_photos junction table

create table if not exists public.albums (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  slug        text        not null,
  title       text        not null,
  description text,
  cover_path  text,
  location    text,
  date_from   date,
  date_to     date,
  tags        text[]      not null default '{}',
  featured    boolean     not null default false,
  status      text        not null default 'draft',
  "order"     integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, slug)
);

create trigger set_albums_updated_at
  before update on public.albums
  for each row execute function handle_updated_at();

create index if not exists idx_albums_user_order
  on public.albums(user_id, "order" asc);

create index if not exists idx_albums_status
  on public.albums(status, featured, created_at desc);

alter table public.albums enable row level security;

create policy "albums_public_read"
  on public.albums for select to anon, authenticated
  using (true);

create policy "albums_insert_own"
  on public.albums for insert
  with check ((select auth.uid()) = user_id);

create policy "albums_update_own"
  on public.albums for update
  using ((select auth.uid()) = user_id);

create policy "albums_delete_own"
  on public.albums for delete
  using ((select auth.uid()) = user_id);


create table if not exists public.album_photos (
  id         uuid        primary key default gen_random_uuid(),
  album_id   uuid        not null references public.albums(id) on delete cascade,
  photo_id   uuid        not null references public.photos(id) on delete cascade,
  position   integer     not null default 0,
  caption    text,
  created_at timestamptz not null default now(),
  unique (album_id, photo_id)
);

create index if not exists idx_album_photos_album_position
  on public.album_photos(album_id, position asc);

create index if not exists idx_album_photos_photo
  on public.album_photos(photo_id);

alter table public.album_photos enable row level security;

create policy "album_photos_public_read"
  on public.album_photos for select to anon, authenticated
  using (true);

create policy "album_photos_insert_own"
  on public.album_photos for insert
  with check (
    exists (
      select 1 from public.albums a
      where a.id = album_id and (select auth.uid()) = a.user_id
    )
  );

create policy "album_photos_update_own"
  on public.album_photos for update
  using (
    exists (
      select 1 from public.albums a
      where a.id = album_id and (select auth.uid()) = a.user_id
    )
  );

create policy "album_photos_delete_own"
  on public.album_photos for delete
  using (
    exists (
      select 1 from public.albums a
      where a.id = album_id and (select auth.uid()) = a.user_id
    )
  );
