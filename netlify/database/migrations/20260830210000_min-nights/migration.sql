-- Minimum stay, per room.
--
-- It was a constant of 3 in the availability function: every room, forever, and enforced
-- only in the browser — the API accepted one-night bookings all along, so the rule was a
-- suggestion the guest could not see and the server did not keep.
--
-- Three nights everywhere also quietly bans the most common short booking there is: a
-- weekend. Friday to Sunday and Saturday to Monday are both two nights.
--
-- Defaults to 1 so weekends work out of the box; raise it per room where it earns its keep.

ALTER TABLE units ADD COLUMN IF NOT EXISTS min_nights integer NOT NULL DEFAULT 1
  CHECK (min_nights >= 1 AND min_nights <= 30);
