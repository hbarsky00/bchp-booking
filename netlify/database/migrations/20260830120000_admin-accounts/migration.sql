-- Admin accounts.
--
-- Admin access was a single shared secret in ADMIN_TOKEN, typed into a box and kept in
-- sessionStorage where any injected script could read it. There was no login, no identity,
-- and no way to change the secret without a redeploy.
--
-- The credential lives here rather than in an environment variable so the password can be
-- changed from inside the app. ADMIN_EMAIL / ADMIN_PASSWORD_HASH seed this table the first
-- time someone signs in; once a row exists, the database is the only source of truth.

CREATE TABLE IF NOT EXISTS admin_users (
  id             integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  -- Stored lower-cased; the unique index is what actually prevents a second account.
  email          text NOT NULL UNIQUE,
  -- scrypt: "scrypt$N$r$p$<salt b64>$<derived key b64>". Never the password itself.
  password_hash  text NOT NULL,
  -- Bumped whenever the password changes, and embedded in every session cookie, so
  -- changing the password signs out every other device immediately.
  session_epoch  integer NOT NULL DEFAULT 1,
  -- Brute-force throttling. Serverless instances do not share memory, so the counter has
  -- to live somewhere both of them can see.
  failed_attempts integer NOT NULL DEFAULT 0,
  locked_until   timestamptz,
  last_login_at  timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- One administrator, enforced by the database rather than by hoping the code is careful.
CREATE UNIQUE INDEX IF NOT EXISTS admin_users_only_one ON admin_users ((true));

-- Single-use tokens for "forgot password". Hashed, because a leaked table must not hand
-- someone a working reset link.
CREATE TABLE IF NOT EXISTS admin_password_resets (
  id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  admin_id    integer NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash  text NOT NULL UNIQUE,
  expires_at  timestamptz NOT NULL,
  used_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_password_resets_expiry_idx ON admin_password_resets (expires_at);
