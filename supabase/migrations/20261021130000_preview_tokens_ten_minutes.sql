-- Preview links last at most 10 minutes.

alter table public.preview_tokens
  alter column expires_at set default now() + interval '10 minutes';

-- Tokens made before this change were given an hour; cut them down to the new limit.
update public.preview_tokens
set expires_at = least(expires_at, created_at + interval '10 minutes');
