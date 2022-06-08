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

-- Functions

create or replace function reserve_seats(seat_ids uuid[]) returns boolean as $$
  begin
    -- make sure user is authenticated
    if auth.uid() is null then
      raise exception 'You must be logged in to reserve seats' using errcode = 'AUTHN';
    end if;

    -- make sure all seats are available
    if not array_length(seat_ids, 1) = array_length(array(
      select id from seats where id = any(seat_ids) and reserved_by_user_id is null
    ), 1) then
      raise exception 'Some seats are already reserved' using errcode = 'RSRVD'; -- error code RSRVD is reserved
    end if;

    -- can only reserve 3 seats or less
    if array_length(seat_ids, 1) > 3 then
      raise exception 'Can only reserve 3 seats or less' using errcode = 'TOMNY'; -- error code TOMNY is too many
    end if;

    -- reserve seats
    update seats set reserved_by_user_id = auth.uid() where id = any(seat_ids);

    -- done
    return true;
  end;
$$ language plpgsql security definer;

-- Insert a movie
do $$
  declare
    v_movie movies;
  begin
    insert into movies ("title", "thumbnail_url")
    values ('The Batman', 'https://vrboaxyqrlqfshjmugrb.supabase.co/storage/v1/object/public/posters/The-Batman-poster.jpeg')
    returning * into v_movie;

    insert into seats ("movie_id", "row", "number")
    select v_movie.id, chr("row" + 64) as "row", sub.number from generate_series(1,5) as "row"
    join lateral (select * from generate_series(1,5) as "number") sub on true;
  end;
$$;

-- Insert a movie
do $$
  declare
    v_movie movies;
  begin
    insert into movies ("title", "thumbnail_url")
    values ('Everything Everywhere All at Once', 'https://vrboaxyqrlqfshjmugrb.supabase.co/storage/v1/object/public/posters/Everything-Everywhere-All-at-Once-poster.jpeg')
    returning * into v_movie;

    insert into seats ("movie_id", "row", "number")
    select v_movie.id, chr("row" + 64) as "row", sub.number from generate_series(1,10) as "row"
    join lateral (select * from generate_series(1,5) as "number") sub on true;
  end;
$$;

