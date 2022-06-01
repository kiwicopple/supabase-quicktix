create extension if not exists moddatetime schema extensions;

create table movies (
  "id" uuid not null primary key default uuid_generate_v4(),
  "created_at" timestamptz not null default now(),
  "updated_at" timestamptz not null default now(),
  "title" text not null,
  "thumbnail_url" text
);

create trigger movies_updated_at before update on movies 
  for each row execute procedure moddatetime (updated_at);

alter table movies enable row level security;

create table seats (
  "id" uuid not null primary key default uuid_generate_v4(),
  "created_at" timestamptz not null default now(),
  "updated_at" timestamptz not null default now(),
  "movie_id" uuid not null references movies(id) on delete cascade on update cascade,
  "row" text not null check ("row" ~* '^[A-Z]$'),
  "number" int not null check ("number" >= 1 and "number" <= 100),
  "reserved_by_user_id" uuid references users(id) on delete set null on update set null
);

create index on seats("movie_id");
create index on seats("reserved_by_user_id");

create trigger seats_updated_at before update on seats 
  for each row execute procedure moddatetime (updated_at);

alter table seats enable row level security;

-- RLS

create policy "can read all movies" on movies
for select using (true);

create policy "can read all seats" on seats
for select using (true);

-- Insert a movie
do $$
  declare
    v_movie movies;
  begin
    insert into movies ("title", "thumbnail_url")
    values ('The Batman', 'https://upload.wikimedia.org/wikipedia/en/f/ff/The_Batman_%28film%29_poster.jpg')
    returning * into v_movie;

    insert into seats ("movie_id", "row", "number")
    select v_movie.id, chr("row" + 64) as "row", sub.number from generate_series(1,5) as "row"
    join lateral (select * from generate_series(1,5) as "number") sub on true;
  end;
$$;


