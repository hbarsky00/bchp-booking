import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { c, r } from '../tokens';
import type { AdminData } from '../lib/admin';

/**
 * Per-room booking rules.
 *
 * Minimum stay was a constant of three nights applied to every room and enforced only in
 * the browser, which quietly banned the most common short booking there is — a weekend is
 * two nights, Friday to Sunday or Saturday to Monday.
 */
export default function RoomRules({
  units, loading, onSave,
}: {
  units: AdminData['units'];
  loading: boolean;
  onSave: (unitId: number, minNights: number) => Promise<void>;
}) {
  const [pending, setPending] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState<number | null>(null);

  const change = async (unitId: number, raw: string) => {
    const minNights = Number(raw);
    if (!Number.isInteger(minNights) || minNights < 1 || minNights > 30) return;
    setPending(unitId); setError('');
    try {
      await onSave(unitId, minNights);
      setSaved(unitId);
      setTimeout(() => setSaved(s => (s === unitId ? null : s)), 2000);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPending(null);
    }
  };

  return (
    <Card elevation={1} sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <MeetingRoomIcon sx={{ color: c.coral700 }} />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
            Room rules
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          The shortest stay each room accepts. A weekend is two nights — set a room to three
          or more and you have taken it off the market for Friday-to-Sunday guests.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'grid', gap: 1 }}>
            {[0, 1, 2].map(i => <Skeleton key={i} variant="rounded" height={56} />)}
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gap: 1 }}>
            {units.map(u => (
              <Box
                key={u.id}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap',
                  p: 1.5, border: `1px solid ${c.stone200}`, borderRadius: `${r.md}px`,
                }}
              >
                <Box sx={{ flex: 1, minWidth: 160 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{u.name}</Typography>
                  <Typography variant="caption" sx={{ color: c.stone600 }}>
                    {u.floor} · {u.liveBookings} live booking{u.liveBookings === 1 ? '' : 's'}
                  </Typography>
                </Box>
                {(u.minNights ?? 1) > 2 && (
                  <Chip
                    size="small"
                    label="No weekends"
                    sx={{ bgcolor: c.amber100, color: c.amber800, fontWeight: 700 }}
                  />
                )}
                {saved === u.id && (
                  <Chip size="small" label="Saved" sx={{ bgcolor: c.green100, color: c.green700, fontWeight: 700 }} />
                )}
                <TextField
                  type="number"
                  size="small"
                  label="Min nights"
                  defaultValue={u.minNights ?? 1}
                  disabled={pending === u.id}
                  onBlur={(e) => {
                    if (Number(e.target.value) !== (u.minNights ?? 1)) void change(u.id, e.target.value);
                  }}
                  slotProps={{ htmlInput: { min: 1, max: 30, step: 1, 'aria-label': `Minimum nights for ${u.name}` } }}
                  sx={{ width: 120 }}
                />
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
