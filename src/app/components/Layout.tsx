import { ReactNode } from 'react';
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
import NotificationsIcon from '@mui/icons-material/Notifications';
import BedIcon from '@mui/icons-material/Bed';
import BusinessIcon from '@mui/icons-material/Business';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PageTransition from './PageTransition';
import PersonIcon from '@mui/icons-material/Person';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: 'Book Stay', value: '/book-stay', icon: <BedIcon /> },
    { label: 'Commercial Rental', value: '/commercial-rental', icon: <BusinessIcon /> },
    { label: 'My Booking', value: '/my-bookings', icon: <BookmarkIcon /> },
    { label: 'Admin', value: '/admin', icon: <AdminPanelSettingsIcon /> },
  ];

  const currentTab = tabs.find(tab => location.pathname.startsWith(tab.value))?.value || '/book-stay';

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    // If clicking Book Stay from search results or any sub-page, reset to landing
    if (newValue === '/book-stay') {
      navigate('/book-stay', { replace: true, state: null });
    } else {
      navigate(newValue, { replace: true });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="default" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontFamily: 'Raleway, sans-serif', fontWeight: 600 }}>
            <Box component="span" sx={{ fontWeight: 700 }}>BCHP</Box> Booking
          </Typography>
          
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
        
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="standard"
          sx={{ px: 2 }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              value={tab.value}
              icon={tab.icon}
              iconPosition="start"
              sx={{ minHeight: 48, textTransform: 'none' }}
            />
          ))}
        </Tabs>
      </AppBar>

      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
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
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            component="span"
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'success.main',
              display: 'inline-block',
            }}
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