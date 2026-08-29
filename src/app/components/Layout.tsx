import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BedIcon from '@mui/icons-material/Bed';
import BusinessIcon from '@mui/icons-material/Business';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import StorefrontIcon from '@mui/icons-material/Storefront';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PageTransition from './PageTransition';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Top-level sections. `match` lists every route that belongs to the section, so a
 * deep page (e.g. /payment-method) keeps its parent tab lit instead of falling back
 * to the first tab and mislabelling where the user is.
 */
const tabs = [
  {
    label: 'Book Stay',
    value: '/book-stay',
    icon: <BedIcon />,
    match: [
      '/book-stay',
      '/search-results',
      '/property-details',
      '/guest-details',
      '/payment-method',
      '/processing-payment',
      '/booking-confirmed',
    ],
  },
  { label: 'Commercial Rental', value: '/commercial-rental', icon: <BusinessIcon />, match: ['/commercial-rental'] },
  { label: 'Shop', value: '/shop', icon: <StorefrontIcon />, match: ['/shop', '/shopping-cart'] },
  { label: 'My Booking', value: '/my-bookings', icon: <BookmarkIcon />, match: ['/my-bookings', '/booking-details'] },
  { label: 'Help', value: '/faqs', icon: <HelpOutlineIcon />, match: ['/faqs', '/contact-support'] },
  { label: 'Admin', value: '/admin', icon: <AdminPanelSettingsIcon />, match: ['/admin'] },
];

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab =
    tabs.find(tab => tab.match.some(path => location.pathname.startsWith(path)))?.value ?? false;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    // Book Stay is a fresh start: drop any search/unit state carried in from a sub-page.
    navigate(newValue, newValue === '/book-stay' ? { state: null } : undefined);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600, letterSpacing: '-0.01em' }}
          >
            <Box component="span" sx={{ fontWeight: 700 }}>BCHP</Box> Booking
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title="Notifications">
            <IconButton aria-label="Notifications">
              <Badge color="error" variant="dot">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>G</Avatar>
        </Toolbar>

        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Main sections"
          sx={{ px: { xs: 0, sm: 2 } }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              value={tab.value}
              icon={tab.icon}
              iconPosition="start"
              sx={{ minHeight: 48, textTransform: 'none', whiteSpace: 'nowrap' }}
            />
          ))}
        </Tabs>
      </AppBar>

      <Container maxWidth="xl" sx={{ flexGrow: 1, py: { xs: 3, md: 4 } }}>
        <PageTransition>
          {children}
        </PageTransition>
      </Container>

      <Box
        component="footer"
        sx={{
          py: 2,
          px: 3,
          mt: 'auto',
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1,
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            component="span"
            sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', display: 'inline-block' }}
          />
          Secure blockchain-verified booking
        </Typography>
        <Typography variant="caption" color="text.secondary">
          © 2026 BCHP Booking. All rights reserved
        </Typography>
      </Box>
    </Box>
  );
}
