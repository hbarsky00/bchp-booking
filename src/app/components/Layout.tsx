import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BedIcon from '@mui/icons-material/Bed';
import BusinessIcon from '@mui/icons-material/Business';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import StorefrontIcon from '@mui/icons-material/Storefront';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VerifiedIcon from '@mui/icons-material/Verified';
import { c } from '../tokens';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Sections own their sub-routes, so a deep page (e.g. /payment-method) keeps its parent
 * lit rather than falling back to the first entry and mislabelling where the user is.
 */
const sections = [
  {
    label: 'Stays',
    value: '/book-stay',
    icon: <BedIcon />,
    match: ['/book-stay', '/search-results', '/property-details', '/guest-details', '/payment-method', '/processing-payment', '/booking-confirmed'],
  },
  { label: 'Commercial', value: '/commercial-rental', icon: <BusinessIcon />, match: ['/commercial-rental'] },
  { label: 'Shop', value: '/shop', icon: <StorefrontIcon />, match: ['/shop', '/shopping-cart'] },
  { label: 'Trips', value: '/my-bookings', icon: <BookmarkIcon />, match: ['/my-bookings', '/booking-details'] },
  { label: 'Help', value: '/faqs', icon: <HelpOutlineIcon />, match: ['/faqs', '/contact-support'] },
  { label: 'Admin', value: '/admin', icon: <AdminPanelSettingsIcon />, match: ['/admin'] },
];

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const current = sections.find(s => s.match.some(p => location.pathname.startsWith(p)));
  const onSearchSurface = location.pathname.startsWith('/book-stay');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{ bgcolor: c.white, borderBottom: `1px solid ${c.stone200}` }}
      >
        <Container maxWidth="xl" disableGutters>
          <Toolbar sx={{ gap: 2, minHeight: { xs: 64, md: 76 }, px: { xs: 2, md: 3 } }}>
            <Box
              component="button"
              onClick={() => navigate('/book-stay', { state: null })}
              aria-label="BCHP home"
              sx={{
                display: 'flex', alignItems: 'center', gap: 1, border: 0, background: 'none',
                p: 0, cursor: 'pointer', color: 'primary.main', flexShrink: 0,
              }}
            >
              <Box sx={{ width: 30, height: 30, borderRadius: '50%', display: 'grid', placeItems: 'center',
                bgcolor: c.coral600,
                backgroundImage: `linear-gradient(145deg, ${c.coral500}, ${c.coral700})` }}>
                <Typography component="span" sx={{ color: c.white, fontWeight: 800, fontSize: 15, lineHeight: 1 }}>B</Typography>
              </Box>
              <Typography component="span" sx={{ fontWeight: 800, fontSize: 19, letterSpacing: '-0.03em', color: c.stone900 }}>
                bchp
              </Typography>
            </Box>

            {/* Compact search recall — the full search lives on the Stays page itself. */}
            {!onSearchSurface && (
              <Box
                component="button"
                onClick={() => navigate('/book-stay', { state: null })}
                sx={{
                  display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5,
                  mx: 'auto', px: 2.5, py: 1.25, cursor: 'pointer',
                  border: `1px solid ${c.stone300}`, borderRadius: 999, bgcolor: c.white,
                  boxShadow: '0 1px 2px rgba(28,25,23,0.06)', transition: 'box-shadow .2s',
                  '&:hover': { boxShadow: '0 2px 10px rgba(28,25,23,0.12)' },
                }}
              >
                <Typography component="span" sx={{ fontWeight: 600, fontSize: 14, color: c.stone900 }}>Anywhere</Typography>
                <Box sx={{ width: '1px', height: 20, bgcolor: c.stone200 }} />
                <Typography component="span" sx={{ fontWeight: 600, fontSize: 14, color: c.stone900 }}>Any week</Typography>
                <Box sx={{ width: '1px', height: 20, bgcolor: c.stone200 }} />
                <Typography component="span" sx={{ fontSize: 14, color: c.stone600 }}>Add guests</Typography>
                <Box sx={{ display: 'grid', placeItems: 'center', width: 30, height: 30, borderRadius: '50%', bgcolor: 'primary.main' }}>
                  <SearchIcon sx={{ fontSize: 16, color: c.white }} />
                </Box>
              </Box>
            )}

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
              {sections.slice(1).map(s => (
                <Button
                  key={s.value}
                  onClick={() => navigate(s.value)}
                  sx={{
                    px: 1.75, minHeight: 40, borderRadius: 999, fontSize: 14,
                    color: current?.value === s.value ? c.stone900 : c.stone600,
                    bgcolor: current?.value === s.value ? c.stone100 : 'transparent',
                    '&:hover': { bgcolor: c.stone100 },
                  }}
                >
                  {s.label}
                </Button>
              ))}
            </Box>

            <Tooltip title="Your trips">
              <IconButton
                aria-label="Your trips"
                onClick={() => navigate('/my-bookings')}
                sx={{ color: c.stone600 }}
              >
                <NotificationsIcon />
              </IconButton>
            </Tooltip>
            <Avatar sx={{ width: 34, height: 34, bgcolor: c.stone900, fontSize: 14, fontWeight: 700 }}>G</Avatar>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="xl" sx={{ flexGrow: 1, py: { xs: 3, md: 5 }, pb: { xs: 12, md: 5 } }}>
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3, px: { xs: 2, md: 3 }, mt: 'auto',
          bgcolor: c.stone50, borderTop: `1px solid ${c.stone200}`,
          display: { xs: 'none', md: 'flex' }, gap: 2,
          justifyContent: 'space-between', alignItems: 'center',
        }}
      >
        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: c.stone600 }}>
          <VerifiedIcon sx={{ fontSize: 16, color: c.green700 }} />
          Every stay settled and verified on-chain
        </Typography>
        <Typography variant="caption" sx={{ color: c.stone600 }}>© 2026 BCHP</Typography>
      </Box>

      {/* Thumb-reachable navigation on phones, where a six-item scroller was unusable. */}
      <Paper
        elevation={0}
        sx={{
          display: { xs: 'block', md: 'none' }, position: 'fixed', bottom: 0, left: 0, right: 0,
          zIndex: 1200, borderTop: `1px solid ${c.stone200}`, borderRadius: 0,
          pb: 'env(safe-area-inset-bottom)',
        }}
      >
        <BottomNavigation
          value={current?.value ?? false}
          onChange={(_e, v) => navigate(v, v === '/book-stay' ? { state: null } : undefined)}
          showLabels
          sx={{
            height: 62,
            '& .Mui-selected': { color: `${c.coral600} !important` },
            '& .MuiBottomNavigationAction-label': { fontSize: 11, fontWeight: 600 },
          }}
        >
          {sections.map(s => (
            <BottomNavigationAction key={s.value} label={s.label} value={s.value} icon={s.icon} sx={{ minWidth: 0, color: c.stone600 }} />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
