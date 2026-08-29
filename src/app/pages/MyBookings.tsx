import { useState } from 'react';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import { downloadText } from '../lib/actions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import BedIcon from '@mui/icons-material/Bed';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TokenIcon from '@mui/icons-material/Token';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessIcon from '@mui/icons-material/Business';
import ChatIcon from '@mui/icons-material/Chat';
import EmailIcon from '@mui/icons-material/Email';

const bookings = [
  {
    id: 1,
    bookingId: 'BCHP-2026-00847',
    unitName: '2nd Floor Unit',
    dates: 'Mar 15 - Mar 20, 2026',
    checkIn: 'Mar 15, 2026 3:00 PM',
    checkOut: 'Mar 20, 2026 11:00 AM',
    nights: 5,
    refund: '$850.00 Deposit',
    status: 'Paid',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
  },
  {
    id: 2,
    bookingId: 'BCHP-2026-00762',
    unitName: '3rd Floor Unit',
    dates: 'Feb 10 - Feb 14, 2026',
    checkIn: 'Feb 10, 2026 2:00 PM',
    checkOut: 'Feb 14, 2026 10:00 AM',
    nights: 4,
    refund: '$720.00 Refunded',
    status: 'Cancelled',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
  },
  {
    id: 3,
    bookingId: 'BCHP-2026-00601',
    unitName: 'Commercial Space',
    dates: 'Jan 22 - Jan 24, 2026',
    checkIn: 'Jan 22, 2026 9:00 AM',
    checkOut: 'Jan 24, 2026 6:00 PM',
    nights: 2,
    refund: '$450.00 Processed',
    status: 'Checked Out',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
  },
];

const tokens = [
  {
    id: 1,
    name: 'My Tokens',
    subtitle: 'Blockchain verified',
    count: 3,
    status: 'active',
    color: 'secondary',
  },
  {
    id: 2,
    name: 'Proof of Stay',
    date: 'Feb 14, 2026',
    bookingId: 'BCHP-2026-00762',
    status: 'verified',
    color: 'success',
  },
  {
    id: 3,
    name: 'Thank You Token',
    date: 'Jan 24, 2026',
    bookingId: 'BCHP-2026-00601',
    status: 'received',
    color: 'primary',
  },
  {
    id: 4,
    name: 'Proof of Stay',
    date: 'Nov 21, 2025',
    bookingId: 'BCHP-2025-90098',
    status: 'archived',
    color: 'warning',
  },
];

export default function MyBookings() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState<{ anchor: HTMLElement; id: number; ref: string } | null>(null);
  const [toast, setToast] = useState('');
  const closeMenu = () => setMenu(null);
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Layout>
      <Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 4 }}>
          <Box>
            <Typography variant="h1" gutterBottom>
              My Bookings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View and manage your current and past reservations
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<CalendarTodayIcon />}
            onClick={() => navigate('/book-stay')}
          >
            New booking
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Bookings List */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card elevation={1}>
              <Tabs value={currentTab} onChange={handleTabChange} sx={{ px: 3, pt: 2 }}>
                <Tab label="All bookings" />
                <Tab label="Active" />
                <Tab label="Past" />
                <Tab label="Cancelled" />
              </Tabs>
              <Divider />

              <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  {bookings.map((booking) => (
                    <Grid key={booking.id} size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                      <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 1,
                                  bgcolor: booking.unitName.includes('Commercial') ? 'warning.light' : 'primary.light',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {booking.unitName.includes('Commercial') ? (
                                  <BusinessIcon fontSize="small" sx={{ color: 'warning.dark' }} />
                                ) : (
                                  <BedIcon fontSize="small" sx={{ color: 'primary.dark' }} />
                                )}
                              </Box>
                              <Box>
                                <Typography variant="subtitle1" fontWeight={600}>{booking.unitName}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {booking.bookingId}
                                </Typography>
                              </Box>
                            </Box>
                            <IconButton
                              size="small"
                              aria-label={`Actions for ${booking.bookingId}`}
                              onClick={(e) => setMenu({ anchor: e.currentTarget, id: booking.id, ref: booking.bookingId })}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Box>

                          <Chip
                            label={booking.status}
                            size="small"
                            color={
                              booking.status === 'Paid'
                                ? 'success'
                                : booking.status === 'Checked out'
                                ? 'info'
                                : 'error'
                            }
                            sx={{ alignSelf: 'flex-start', mb: 2 }}
                          />

                          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                            <Chip
                              icon={<CalendarTodayIcon />}
                              label={booking.dates}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              icon={<PeopleIcon />}
                              label={`${booking.nights} nights`}
                              size="small"
                              variant="outlined"
                            />
                          </Box>

                          <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid size={{ xs: 6 }}>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Check-in
                              </Typography>
                              <Typography variant="body2" fontWeight={500}>
                                {booking.checkIn.split(' ')[0]}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {booking.checkIn.split(' ').slice(2).join(' ')}
                              </Typography>
                            </Grid>

                            <Grid size={{ xs: 6 }}>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Check-out
                              </Typography>
                              <Typography variant="body2" fontWeight={500}>
                                {booking.checkOut.split(' ')[0]}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {booking.checkOut.split(' ').slice(2).join(' ')}
                              </Typography>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Refund
                              </Typography>
                              <Typography variant="body2" fontWeight={500}>
                                {booking.refund.split(' ')[0]}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {booking.refund.split(' ')[1]}
                              </Typography>
                            </Grid>
                          </Grid>

                          <Button
                            variant="contained"
                            fullWidth
                            size="small"
                            startIcon={<DownloadIcon />}
                            onClick={() => navigate(`/booking-details/${booking.id}`)}
                            sx={{ mt: 'auto' }}
                          >
                            View details
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Card>
          </Grid>

          {/* Tokens and Statistics Sidebar */}
          <Grid size={{ xs: 12, lg: 4 }}>
            {/* Tokens Card */}
            <Card elevation={1} sx={{ mb: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TokenIcon color="secondary" />
                    <Typography variant="h6" component="h2">{tokens[0].name}</Typography>
                  </Box>
                  <Chip label={`${tokens[0].count} tokens`} color="secondary" size="small" />
                </Box>

                {tokens.slice(1).map((token, index) => (
                  <Card
                    key={token.id}
                    variant="outlined"
                    sx={{
                      mb: index < tokens.length - 2 ? 2 : 0,
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 8,
                        top: 12,
                        bottom: 12,
                        width: 4,
                        borderRadius: '2px',
                        bgcolor: `${token.color}.main`,
                      },
                    }}
                  >
                    <CardContent sx={{ pl: 3, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2">{token.name}</Typography>
                        <Chip label={token.status} size="small" color={token.color as any} />
                      </Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {token.date}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {token.bookingId}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}

              </CardContent>
            </Card>

            {/* Statistics Card */}
            <Card elevation={1} sx={{ mb: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <TrendingUpIcon color="primary" />
                  <Typography variant="h6" component="h2">Booking Statistics</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                  Your activity summary
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total bookings
                    </Typography>
                    <Typography variant="h6" component="h2">5</Typography>
                  </Box>
                  <Chip label="+21% this year" size="small" color="success" sx={{ mb: 2 }} />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total nights
                    </Typography>
                    <Typography variant="h6" component="h2">15</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Across all stays
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total spent
                    </Typography>
                    <Typography variant="h6" component="p">$3,010</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    All-time payments
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Need Help Card */}
            <Card elevation={1}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
                  Need Help?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Our support team is here if you need assistance
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ChatIcon />}
                    onClick={() => navigate('/contact-support')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Live Chat
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                      Available 24/7
                    </Typography>
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EmailIcon />}
                    onClick={() => navigate('/contact-support')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Email Support
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                      Response within 2 hours
                    </Typography>
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Menu anchorEl={menu?.anchor ?? null} open={Boolean(menu)} onClose={closeMenu}>
        <MenuItem onClick={() => { if (menu) navigate(`/booking-details/${menu.id}`); closeMenu(); }}>
          View details
        </MenuItem>
        <MenuItem onClick={() => {
          if (menu) {
            downloadText(`${menu.ref}-confirmation.txt`,
              `BCHP BOOKING\n============\nReference: ${menu.ref}\n`);
            setToast('Confirmation downloaded');
          }
          closeMenu();
        }}>
          Download confirmation
        </MenuItem>
        <MenuItem onClick={() => { navigate('/contact-support'); closeMenu(); }}>
          Contact support
        </MenuItem>
      </Menu>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3000}
        onClose={() => setToast('')}
        message={toast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Layout>
  );
}