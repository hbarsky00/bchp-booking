import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import { c, r } from '../tokens';

/**
 * Route-level fallback. This replaces the whole shell while a lazy page loads, so it
 * mimics the shell — header bar, title block, content grid — rather than showing a
 * spinner on an empty screen. The point is that nothing jumps when the real page
 * arrives.
 */
export default function LoadingFallback() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }} aria-busy="true" aria-live="polite">
      <Box sx={{ borderBottom: `1px solid ${c.stone200}`, bgcolor: c.white }}>
        <Container maxWidth="xl" disableGutters>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: { xs: 2, md: 3 }, minHeight: { xs: 64, md: 76 } }}>
            <Skeleton variant="circular" width={30} height={30} />
            <Skeleton variant="text" width={64} height={24} />
            <Box sx={{ flexGrow: 1 }} />
            <Skeleton variant="rounded" width={180} height={32} sx={{ display: { xs: 'none', md: 'block' }, borderRadius: `${r.pill}px` }} />
            <Skeleton variant="circular" width={34} height={34} />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        <Skeleton variant="text" width="min(360px, 70%)" height={52} />
        <Skeleton variant="text" width="min(280px, 55%)" height={24} sx={{ mb: 4 }} />

        <Grid container spacing={{ xs: 3, md: 4 }} rowSpacing={{ xs: 4, md: 5 }}>
          {Array.from({ length: 8 }, (_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Skeleton variant="rectangular" sx={{ aspectRatio: '20 / 19', borderRadius: `${r.md}px`, mb: 1.5 }} />
              <Skeleton variant="text" width="70%" />
              <Skeleton variant="text" width="45%" />
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box component="span" sx={{
        position: 'absolute', width: 1, height: 1, overflow: 'hidden',
        clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap',
      }}>
        Loading page
      </Box>
    </Box>
  );
}
