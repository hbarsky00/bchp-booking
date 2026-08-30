import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { changePassword, passwordProblem } from '../lib/auth';

/**
 * Changing the password from inside the app, which is why the credential lives in the
 * database rather than in an environment variable — an env var would need a redeploy.
 *
 * The current password is required: a session someone walked away from should not be
 * enough to lock the owner out of their own dashboard.
 */
export default function ChangePasswordDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const close = () => {
    setCurrent(''); setNext(''); setConfirm(''); setError(''); setDone(false);
    onClose();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const problem = passwordProblem(next);
    if (problem) return setError(problem);
    if (next !== confirm) return setError('Those two passwords do not match');
    setBusy(true); setError('');
    try {
      await changePassword(current, next);
      setDone(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={close} maxWidth="xs" fullWidth>
      <Box component="form" onSubmit={submit}>
        <DialogTitle>Change password</DialogTitle>
        <DialogContent dividers>
          {done ? (
            <Alert severity="success">
              Password changed. Anywhere else you were signed in has been signed out.
            </Alert>
          ) : (
            <Box sx={{ display: 'grid', gap: 2, pt: 0.5 }}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                label="Current password" type="password" autoComplete="current-password"
                required value={current} onChange={(e) => setCurrent(e.target.value)}
              />
              <TextField
                label="New password" type="password" autoComplete="new-password"
                required value={next} onChange={(e) => setNext(e.target.value)}
                helperText="At least 12 characters"
              />
              <TextField
                label="Confirm new password" type="password" autoComplete="new-password"
                required value={confirm} onChange={(e) => setConfirm(e.target.value)}
              />
              <Typography variant="caption" color="text.secondary">
                Changing this signs out every other device immediately.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>{done ? 'Done' : 'Cancel'}</Button>
          {!done && (
            <Button type="submit" variant="contained" disabled={busy}>
              {busy ? 'Saving…' : 'Change password'}
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
}
