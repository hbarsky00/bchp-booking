import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import Layout from '../components/Layout';
import BitStayMark from '../components/BitStayMark';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import { completeReset, passwordProblem, requestReset, useSession } from '../lib/auth';
import { c, r } from '../tokens';

type Mode = 'signin' | 'forgot' | 'reset';

/**
 * The only door into the admin dashboard.
 *
 * One account, no sign-up: a booking guest never needs one, and an app with a single
 * administrator should not carry a registration form nobody may use.
 */
export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { session, loading, signIn } = useSession();

  const resetToken = params.get('token') ?? '';
  const [mode, setMode] = useState<Mode>(resetToken ? 'reset' : 'signin');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Already signed in? There is nothing to do on this page.
  useEffect(() => {
    if (session?.signedIn) navigate('/admin', { replace: true });
  }, [session, navigate]);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true); setError(''); setNotice('');
    try { await fn(); } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    void run(async () => {
      await signIn(email, password);
      navigate('/admin', { replace: true });
    });
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    void run(async () => {
      await requestReset(email);
      // Same words whether or not that address is the administrator's, so this form
      // cannot be used to find out who the administrator is.
      setNotice('If that address belongs to the administrator, a reset link is on its way. It lasts 30 minutes.');
    });
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    const problem = passwordProblem(newPassword);
    if (problem) return setError(problem);
    if (newPassword !== confirm) return setError('Those two passwords do not match');
    void run(async () => {
      await completeReset(resetToken, newPassword);
      setMode('signin');
      setNotice('Password changed. Sign in with your new one.');
      setPassword(''); setNewPassword(''); setConfirm('');
    });
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  const title = mode === 'signin' ? 'Admin sign-in'
    : mode === 'forgot' ? 'Reset your password'
    : 'Choose a new password';

  return (
    <Layout>
      <Box sx={{ maxWidth: 460, mx: 'auto', py: { xs: 3, md: 6 } }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <BitStayMark size={40} tile={false} />
        </Box>

        <Card elevation={1}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <LockIcon sx={{ fontSize: 20, color: c.stone600 }} />
              <Typography variant="h1" sx={{ fontSize: '1.5rem !important', m: 0 }}>{title}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {mode === 'signin'
                ? 'This dashboard holds every guest’s contact details. Staff only.'
                : mode === 'forgot'
                  ? 'Enter the administrator’s email address and we will send a one-time link.'
                  : 'Pick something long. Length is what protects a password.'}
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {notice && <Alert severity="success" sx={{ mb: 2 }}>{notice}</Alert>}

            {mode === 'signin' && (
              <Box component="form" onSubmit={handleSignIn} sx={{ display: 'grid', gap: 2 }}>
                <TextField
                  label="Email address"
                  type="email"
                  name="email"
                  autoComplete="username"
                  autoFocus
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(v => !v)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button type="submit" variant="contained" size="large" disabled={busy}
                  startIcon={busy ? <CircularProgress size={18} color="inherit" /> : undefined}>
                  {busy ? 'Checking…' : 'Sign in'}
                </Button>
                <Link
                  component="button"
                  type="button"
                  onClick={() => { setMode('forgot'); setError(''); setNotice(''); }}
                  sx={{ justifySelf: 'center', fontSize: 14, py: 1, px: 1 }}
                >
                  Forgot your password?
                </Link>
              </Box>
            )}

            {mode === 'forgot' && (
              <Box component="form" onSubmit={handleForgot} sx={{ display: 'grid', gap: 2 }}>
                <TextField
                  label="Email address"
                  type="email"
                  autoComplete="username"
                  autoFocus
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" variant="contained" size="large" disabled={busy}>
                  {busy ? 'Sending…' : 'Send reset link'}
                </Button>
                <Link
                  component="button"
                  type="button"
                  onClick={() => { setMode('signin'); setError(''); setNotice(''); }}
                  sx={{ justifySelf: 'center', fontSize: 14, py: 1, px: 1 }}
                >
                  Back to sign-in
                </Link>
              </Box>
            )}

            {mode === 'reset' && (
              <Box component="form" onSubmit={handleReset} sx={{ display: 'grid', gap: 2 }}>
                <TextField
                  label="New password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  autoFocus
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  helperText="At least 12 characters"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(v => !v)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Confirm new password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
                <Button type="submit" variant="contained" size="large" disabled={busy}>
                  {busy ? 'Saving…' : 'Set new password'}
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 2, px: 2, borderRadius: `${r.sm}px` }}
        >
          Guests don’t need an account — booking a stay never asks for one.
        </Typography>
      </Box>
    </Layout>
  );
}
