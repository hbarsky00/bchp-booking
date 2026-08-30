import { useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { c, r } from '../tokens';
import type { AvailabilityDay } from '../lib/availability';

/**
 * A month grid that shows what is actually bookable.
 *
 * Two native date inputs came before this, and they could not say the one thing a guest
 * needs to know: which nights are already gone. Picking dates blind meant finding out at
 * the end of checkout that the room was taken.
 *
 * Nights are half-open — the check-out day is a departure, not a night stayed — so it is
 * drawn as the end of the band rather than as a booked night.
 */

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const addDays = (date: string, n: number) =>
  new Date(Date.parse(date + 'T00:00:00Z') + n * 86_400_000).toISOString().slice(0, 10);

const formatShort = (date: string) =>
  new Date(date + 'T00:00:00Z').toLocaleDateString(undefined,
    { timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric' });
const iso = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

export interface AvailabilityCalendarProps {
  days: AvailabilityDay[];
  loading?: boolean;
  checkIn: string;
  checkOut: string;
  minNights: number;
  onChange: (next: { checkIn: string; checkOut: string }) => void;
  months?: number;
}

export default function AvailabilityCalendar({
  days, loading, checkIn, checkOut, minNights, onChange, months = 1,
}: AvailabilityCalendarProps) {
  const byDate = useMemo(() => new Map(days.map(d => [d.date, d])), [days]);
  const first = days[0]?.date ?? new Date().toISOString().slice(0, 10);
  const [cursor, setCursor] = useState(() => {
    const anchor = checkIn || first;
    return { y: Number(anchor.slice(0, 4)), m: Number(anchor.slice(5, 7)) - 1 };
  });
  const [hover, setHover] = useState('');

  /**
   * Follow the check-in date when it changes from outside — arriving with dates in the URL,
   * or the browser going back to a search that had them. The cursor is `useState`, so its
   * initialiser does not re-run on a same-path navigation and the grid was last seen
   * sitting on today's month while the guest's own selection lay eleven months away.
   *
   * Tracks the last check-in it reacted to rather than the current month, so paging around
   * manually is never yanked back.
   */
  const followed = useRef(checkIn);
  useEffect(() => {
    if (checkIn === followed.current) return;
    followed.current = checkIn;
    if (!checkIn) return;
    setCursor({ y: Number(checkIn.slice(0, 4)), m: Number(checkIn.slice(5, 7)) - 1 });
  }, [checkIn]);

  const shift = (by: number) => setCursor(({ y, m }) => {
    const t = new Date(Date.UTC(y, m + by, 1));
    return { y: t.getUTCFullYear(), m: t.getUTCMonth() };
  });

  /** Selecting a range across a booked night would be a booking the server must reject. */
  const blockedBetween = (a: string, b: string) => {
    const [from, to] = a < b ? [a, b] : [b, a];
    for (const d of days) if (d.date >= from && d.date < to && (d.booked || d.past)) return true;
    return false;
  };

  const nightsFrom = (a: string, b: string) =>
    Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);

  /** While a check-in is set, anything closer than the minimum cannot close the range. */
  const tooShort = (date: string) =>
    !!checkIn && !checkOut && date > checkIn && nightsFrom(checkIn, date) < minNights;

  const pick = (date: string) => {
    const day = byDate.get(date);
    if (!day || day.past) return;

    // No start yet, or restarting: a click always begins a new range unless it can
    // legitimately close the current one.
    const startingOver = !checkIn || checkOut || date <= checkIn;
    if (startingOver) {
      if (day.booked) return;                       // cannot arrive on a night that is taken
      return onChange({ checkIn: date, checkOut: '' });
    }
    // Closing the range. The check-out day may itself be booked — someone else arriving
    // the morning you leave is fine — but nothing between may be.
    if (blockedBetween(checkIn, date)) return onChange({ checkIn: date, checkOut: '' });
    if (nightsFrom(checkIn, date) < minNights) return;
    onChange({ checkIn, checkOut: date });
  };

  const previewEnd = !checkOut && hover > checkIn && !blockedBetween(checkIn, hover) ? hover : '';
  const rangeEnd = checkOut || previewEnd;

  const monthGrid = (y: number, m: number) => {
    const lead = new Date(Date.UTC(y, m, 1)).getUTCDay();
    const count = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
    const cells: (string | null)[] = Array.from({ length: lead }, () => null);
    for (let d = 1; d <= count; d++) cells.push(iso(y, m, d));
    return cells;
  };

  const label = (y: number, m: number) =>
    new Date(Date.UTC(y, m, 1)).toLocaleDateString(undefined, { timeZone: 'UTC', month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={140} height={28} sx={{ mx: 'auto', mb: 1 }} />
        <Skeleton variant="rounded" height={230} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <IconButton onClick={() => shift(-1)} aria-label="Previous month" size="small">
          <ChevronLeftIcon />
        </IconButton>
        <Box sx={{ display: 'flex', gap: 4, flex: 1, justifyContent: 'space-around' }}>
          {Array.from({ length: months }, (_, i) => {
            const t = new Date(Date.UTC(cursor.y, cursor.m + i, 1));
            return (
              <Typography key={i} variant="subtitle2" sx={{ fontWeight: 700 }}>
                {label(t.getUTCFullYear(), t.getUTCMonth())}
              </Typography>
            );
          })}
        </Box>
        <IconButton onClick={() => shift(1)} aria-label="Next month" size="small">
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: months }, (_, i) => {
          const t = new Date(Date.UTC(cursor.y, cursor.m + i, 1));
          const [y, m] = [t.getUTCFullYear(), t.getUTCMonth()];
          return (
            <Box key={i} sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 0.5 }}>
                {WEEKDAYS.map(w => (
                  <Typography key={w} variant="caption" sx={{ textAlign: 'center', color: c.stone600, fontWeight: 600 }}>
                    {w}
                  </Typography>
                ))}
              </Box>
              <Box role="grid" sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0 }}>
                {monthGrid(y, m).map((date, idx) => {
                  if (!date) return <Box key={`p${idx}`} />;
                  const day = byDate.get(date);
                  const known = !!day;
                  const past = day?.past ?? date < new Date().toISOString().slice(0, 10);
                  const booked = day?.booked ?? false;
                  const isIn = date === checkIn;
                  const isOut = date === checkOut;
                  const inRange = !!checkIn && !!rangeEnd && date > checkIn && date < rangeEnd;
                  const short = tooShort(date);
                  const disabled = past || !known || short || (booked && !checkIn) || (booked && !!checkOut);

                  return (
                    <Box
                      key={date}
                      component="button"
                      type="button"
                      disabled={past || !known || short}
                      aria-label={
                        `${date}${booked ? ', booked'
                          : short ? `, too short — ${minNights}-night minimum`
                          : day ? `, $${day.rate}` : ''}`
                      }
                      aria-pressed={isIn || isOut}
                      onMouseEnter={() => setHover(date)}
                      onMouseLeave={() => setHover('')}
                      onClick={() => pick(date)}
                      sx={{
                        appearance: 'none', font: 'inherit',
                        border: isIn || isOut ? `1px solid ${c.coral700}` : '1px solid transparent',
                        borderRadius: `${r.sm}px`,
                        // Seven columns of 44px need every pixel the card gives them, so
                        // the grid has no gutters and each cell fills its whole column.
                        minHeight: 44, px: 0, py: 0.25,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        bgcolor: isIn || isOut ? c.coral600 : inRange ? c.coral50 : 'transparent',
                        color: isIn || isOut ? c.white
                          : past || !known || short ? c.stone300
                          : booked ? c.stone600 : c.stone900,
                        opacity: 1,
                        '&:hover:not(:disabled)': {
                          bgcolor: isIn || isOut ? c.coral700 : booked ? 'transparent' : c.coral50,
                        },
                        '&:focus-visible': { outline: `2px solid ${c.coral600}`, outlineOffset: 1 },
                      }}
                    >
                      <Box
                        component="span"
                        className="tnum"
                        sx={{
                          fontSize: 13, fontWeight: isIn || isOut ? 700 : 500, lineHeight: 1.1,
                          // Struck through, not merely greyed: colour alone must not be the
                          // only thing separating "taken" from "expensive".
                          textDecoration: booked && !disabled ? 'none' : booked ? 'line-through' : 'none',
                        }}
                      >
                        {Number(date.slice(8, 10))}
                      </Box>
                      {known && !past && (
                        <Box
                          component="span"
                          className="tnum"
                          sx={{
                            fontSize: 9, lineHeight: 1.1,
                            color: isIn || isOut ? c.coral50 : booked ? c.stone600 : c.stone600,
                          }}
                        >
                          {booked ? '—' : `$${Math.round(day!.rate)}`}
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Say the rule at the moment it starts to bite, not in a card further down the page. */}
      {checkIn && !checkOut && minNights > 1 && (
        <Typography variant="caption" sx={{ display: 'block', mt: 1.25, color: c.stone600 }}>
          {minNights}-night minimum — choose {formatShort(addDays(checkIn, minNights))} or later
          to check out.
        </Typography>
      )}

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1.5 }}>
        {[
          { bg: c.coral600, label: 'Your stay' },
          { bg: c.stone100, label: 'Booked', strike: true },
        ].map(k => (
          <Box key={k.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ width: 12, height: 12, bgcolor: k.bg, borderRadius: `${r.sm}px`, flexShrink: 0 }} />
            <Typography variant="caption" sx={{ color: c.stone600, textDecoration: k.strike ? 'line-through' : 'none' }}>
              {k.label}
            </Typography>
          </Box>
        ))}
        <Typography variant="caption" sx={{ color: c.stone600 }}>
          Prices are per night and change by season.
        </Typography>
      </Box>
    </Box>
  );
}
