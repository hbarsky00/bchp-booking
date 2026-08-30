import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Skeleton from '@mui/material/Skeleton';
import InputAdornment from '@mui/material/InputAdornment';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import { asPercent, useSeasons, type Season, type SeasonDraft } from '../lib/seasons';
import { formatDate } from '../lib/bookings';
import { c, r } from '../tokens';

/**
 * Seasons, editable by the administrator.
 *
 * The rates shipped in a migration, so changing what a week costs needed a code change and
 * a deploy. Pricing is business data — the person who owns the rooms should set it.
 */

const BLANK: SeasonDraft = { name: '', startsOn: '', endsOn: '', multiplier: 1.2, priority: 10 };

export default function SeasonManager() {
  const { seasons, loading, error, save, remove } = useSeasons();
  const [draft, setDraft] = useState<SeasonDraft | null>(null);
  const [confirming, setConfirming] = useState<Season | null>(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setBusy(true); setFormError('');
    try {
      await save(draft);
      setDraft(null);
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const drop = async () => {
    if (!confirming) return;
    setBusy(true);
    try { await remove(confirming.id); setConfirming(null); }
    catch (err) { setFormError((err as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <Card elevation={1} sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <PriceChangeIcon sx={{ color: c.coral700 }} />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, flex: 1 }}>
            Seasonal rates
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setDraft(BLANK); setFormError(''); }}>
            Add season
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          A multiplier on each unit's base rate. Where two seasons overlap the higher
          priority wins, so a festive week can sit inside a longer high season.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'grid', gap: 1 }}>
            {[0, 1, 2].map(i => <Skeleton key={i} variant="rounded" height={56} />)}
          </Box>
        ) : seasons.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No seasons yet — every night is charged at the unit's base rate.
          </Typography>
        ) : (
          <Box sx={{ display: 'grid', gap: 1 }}>
            {seasons.map(s => (
              <Box
                key={s.id}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap',
                  p: 1.5, border: `1px solid ${c.stone200}`, borderRadius: `${r.md}px`,
                }}
              >
                <Box sx={{ flex: 1, minWidth: 180 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{s.name}</Typography>
                  <Typography variant="caption" sx={{ color: c.stone600 }}>
                    {formatDate(s.startsOn)} – {formatDate(s.endsOn)} · priority {s.priority}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label={asPercent(s.multiplier)}
                  sx={{
                    fontWeight: 700,
                    bgcolor: s.multiplier > 1 ? c.amber100 : s.multiplier < 1 ? c.green100 : c.stone100,
                    color: s.multiplier > 1 ? c.amber800 : s.multiplier < 1 ? c.green700 : c.stone800,
                  }}
                />
                <IconButton aria-label={`Edit ${s.name}`} onClick={() => { setDraft(s); setFormError(''); }}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label={`Delete ${s.name}`} onClick={() => setConfirming(s)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>

      <Dialog open={!!draft} onClose={() => setDraft(null)} maxWidth="xs" fullWidth>
        <Box component="form" onSubmit={submit}>
          <DialogTitle>{draft?.id ? 'Edit season' : 'Add season'}</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'grid', gap: 2, pt: 0.5 }}>
              {formError && <Alert severity="error">{formError}</Alert>}
              <TextField
                label="Name" required autoFocus value={draft?.name ?? ''}
                onChange={e => setDraft(d => d && { ...d, name: e.target.value })}
                helperText="Shown to guests on the price breakdown"
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Starts" type="date" required fullWidth value={draft?.startsOn ?? ''}
                  onChange={e => setDraft(d => d && { ...d, startsOn: e.target.value })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField
                  label="Ends" type="date" required fullWidth value={draft?.endsOn ?? ''}
                  onChange={e => setDraft(d => d && { ...d, endsOn: e.target.value })}
                  slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: draft?.startsOn } }}
                />
              </Box>
              <TextField
                label="Multiplier" type="number" required value={draft?.multiplier ?? 1}
                onChange={e => setDraft(d => d && { ...d, multiplier: Number(e.target.value) })}
                slotProps={{ htmlInput: { step: 0.05, min: 0.1, max: 10 } }}
                InputProps={{ endAdornment: (
                  <InputAdornment position="end">
                    {draft ? asPercent(draft.multiplier) : ''}
                  </InputAdornment>
                ) }}
                helperText="1.0 is the base rate. 1.35 charges 35% more."
              />
              <TextField
                label="Priority" type="number" required value={draft?.priority ?? 10}
                onChange={e => setDraft(d => d && { ...d, priority: Number(e.target.value) })}
                slotProps={{ htmlInput: { step: 1, min: 0, max: 1000 } }}
                helperText="Higher wins where seasons overlap"
              />
              <Typography variant="caption" sx={{ color: c.stone600 }}>
                Changing a season only affects future bookings. Stays already booked keep
                the nightly rates they were sold at.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDraft(null)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={busy}>
              {busy ? 'Saving…' : draft?.id ? 'Save changes' : 'Add season'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={!!confirming} onClose={() => setConfirming(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete “{confirming?.name}”?</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">
            Those dates go back to the base rate for anyone booking from now on. Stays
            already booked are unaffected — they keep the rates they were sold at.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirming(null)}>Keep it</Button>
          <Button color="error" variant="contained" onClick={drop} disabled={busy}>
            {busy ? 'Deleting…' : 'Delete season'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
