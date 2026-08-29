import { useState } from 'react';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BedIcon from '@mui/icons-material/Bed';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import ChatIcon from '@mui/icons-material/Chat';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import TokenIcon from '@mui/icons-material/Token';
import VerifiedIcon from '@mui/icons-material/Verified';
import ShieldIcon from '@mui/icons-material/Shield';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { c } from '../tokens';

export default function BookingConfirmed() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(14);

  const bookingData = {
    confirmationId: 'BCHP-2026-00847',
    status: 'Paid',
    checkIn: {
      date: 'March 19, 2026',
      day: 'Tuesday',
      time: '3:00 PM',
      location: '123 Main Street, Downtown District',
    },
    checkOut: {
      date: 'March 20, 2026',
      day: 'Wednesday',
      time: '11:00 AM',
    },
    nights: 1,
    accommodation: {
      name: '2nd Floor Unit',
      type: 'Full-floor accommodation',
      guests: 2,
      bedrooms: 2,
      bathrooms: 1,
      price: 150.0,
    },
    guest: {
      name: 'Alex Morgan',
      email: 'alex.morgan@email.com',
      phone: '+1 (555) 123-4567',
      requests: 'Early check-in if possible. Traveling with family.',
    },
    payment: {
      method: 'BSV (Bitcoin SV)',
      type: 'Blockchain verified payment',
      accommodation: 150.0,
      serviceFee: 46.0,
      taxes: 50.0,
      total: 850.0,
      txReference: '0x7fda5cc2b7c4f6d2c5d3e2b6d19fac8d02f0a5cf3...',
    },
  };

  return (
    <Layout>
      <Box>
        {/* Success Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: c.emerald100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main' }} />
          </Box>
          <Typography variant="h1" gutterBottom>
            Booking Confirmed!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your payment has been processed successfully and your booking is now confirmed
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column - Booking Details */}
          <Grid size={{ xs: 12, lg: 7 }}>
            {/* Booking Summary */}
            <Card elevation={1} sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                    Booking Summary
                  </Typography>
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Paid"
                    color="success"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Confirmation ID: {bookingData.confirmationId}
                </Typography>

                <Divider sx={{ my: 3 }} />

                {/* Stay Dates */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CalendarTodayIcon fontSize="small" sx={{ color: 'primary.main' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Stay Dates
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Check-in
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {bookingData.checkIn.date}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {bookingData.checkIn.day}, {bookingData.checkIn.time}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {bookingData.checkIn.location}
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Check-out
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {bookingData.checkOut.date}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {bookingData.checkOut.day}, {bookingData.checkOut.time}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Typography variant="caption" sx={{ color: 'primary.main', display: 'block', mt: 1 }}>
                    ← {bookingData.nights} night total stay
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Accommodation */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <BedIcon fontSize="small" sx={{ color: 'primary.main' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Accommodation
                    </Typography>
                  </Box>
                  <Card elevation={0} sx={{ bgcolor: c.stone50, border: 1, borderColor: c.stone200 }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {bookingData.accommodation.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {bookingData.accommodation.type}
                          </Typography>
                        </Box>
                        <Typography variant="h6" component="p" sx={{ color: 'primary.main', fontWeight: 700 }}>
                          ${bookingData.accommodation.price.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Chip label={`Up to ${bookingData.accommodation.guests} guests`} size="small" variant="outlined" />
                        <Chip label={`${bookingData.accommodation.bedrooms} bedrooms`} size="small" variant="outlined" />
                        <Chip label={`${bookingData.accommodation.bathrooms} bathroom`} size="small" variant="outlined" />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Guest Information */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PersonIcon fontSize="small" sx={{ color: 'primary.main' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Guest Information
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Guest Name
                      </Typography>
                      <Typography variant="body2">{bookingData.guest.name}</Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Number of Guests
                      </Typography>
                      <Typography variant="body2">{bookingData.accommodation.guests} guests</Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Email Address
                      </Typography>
                      <Typography variant="body2">{bookingData.guest.email}</Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Contact Number
                      </Typography>
                      <Typography variant="body2">{bookingData.guest.phone}</Typography>
                    </Grid>
                    <Grid size={12}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Special Requests
                      </Typography>
                      <Typography variant="body2">{bookingData.guest.requests}</Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Payment Details */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <VerifiedIcon fontSize="small" sx={{ color: 'success.main' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Payment Details
                    </Typography>
                  </Box>
                  <Card
                    elevation={0}
                    sx={{
                      bgcolor: c.green50,
                      border: 1,
                      borderColor: c.green200,
                      mb: 2,
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <WarningIcon fontSize="small" sx={{ color: 'success.main' }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'success.dark' }}>
                          {bookingData.payment.method}
                        </Typography>
                        <Chip label="Verified" size="small" color="success" sx={{ ml: 'auto' }} />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {bookingData.payment.type}
                      </Typography>
                    </CardContent>
                  </Card>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Accommodation (Original)
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${bookingData.payment.accommodation.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Service Fee
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${bookingData.payment.serviceFee.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Taxes
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${bookingData.payment.taxes.toFixed(2)}
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                      Total Paid
                    </Typography>
                    <Typography variant="h5" component="p" sx={{ color: 'success.main', fontWeight: 700 }}>
                      ${bookingData.payment.total.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <ShieldIcon fontSize="small" sx={{ color: 'success.main' }} />
                    <Typography variant="caption" color="text.secondary">
                      Transaction Reference ID
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: 'monospace',
                      wordBreak: 'break-all',
                      display: 'block',
                    }}
                  >
                    {bookingData.payment.txReference}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* What Happens Next */}
            <Card elevation={1} sx={{ mb: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <InfoIcon fontSize="small" sx={{ color: 'primary.main' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    What Happens Next?
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Here's what you can expect before your arrival:
                </Typography>
              </CardContent>
            </Card>

            {/* Timeline Cards */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Card elevation={0} sx={{ bgcolor: c.stone50, border: 1, borderColor: c.stone200 }}>
                <CardContent sx={{ p: 2, display: 'flex', gap: 2 }}>
                  <EmailIcon sx={{ color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Confirmation Email Sent
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Check your inbox for booking confirmation receipt
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card elevation={0} sx={{ bgcolor: c.stone50, border: 1, borderColor: c.stone200 }}>
                <CardContent sx={{ p: 2, display: 'flex', gap: 2 }}>
                  <NotificationsIcon sx={{ color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Pre-Arrival Reminder
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      You'll receive a check-in notice 24 hours before arrival
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card elevation={0} sx={{ bgcolor: c.stone50, border: 1, borderColor: c.stone200 }}>
                <CardContent sx={{ p: 2, display: 'flex', gap: 2 }}>
                  <VpnKeyIcon sx={{ color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Access Information
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Receive access codes via email and verified check-in
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card elevation={0} sx={{ bgcolor: c.stone50, border: 1, borderColor: c.stone200 }}>
                <CardContent sx={{ p: 2, display: 'flex', gap: 2 }}>
                  <TokenIcon sx={{ color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Proof of Stay Token
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      A blockchain-based record will be issued after check-in
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {/* Right Column - Calendar & Actions */}
          <Grid size={{ xs: 12, lg: 5 }}>
            {/* Calendar */}
            <Card elevation={1} sx={{ mb: 3 }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                  Your Booking Dates
                </Typography>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">March 2026</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: 0.5,
                    mb: 2,
                  }}
                >
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <Box key={day} sx={{ textAlign: 'center', py: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {day}
                      </Typography>
                    </Box>
                  ))}
                  {[null, null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((date, index) => (
                    <Box
                      key={index}
                      sx={{
                        textAlign: 'center',
                        py: 0.5,
                        bgcolor: date === 19 || date === 20 ? 'primary.main' : 'transparent',
                        color: date === 19 || date === 20 ? 'white' : 'text.primary',
                        borderRadius: 1,
                        cursor: date ? 'pointer' : 'default',
                      }}
                    >
                      {date && (
                        <Typography variant="caption" sx={{ fontWeight: date === 19 || date === 20 ? 700 : 400 }}>
                          {date}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: 'primary.main', borderRadius: 0.5 }} />
                    <Typography variant="caption">Your booking</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: c.stone200, borderRadius: 0.5 }} />
                    <Typography variant="caption">Today</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Important Information */}
            <Card
              elevation={0}
              sx={{
                mb: 3,
                bgcolor: c.amber100,
                border: 1,
                borderColor: c.amber200,
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <WarningIcon fontSize="small" sx={{ color: c.amber500 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Important Information
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="caption">
                    ⚠️ Your booking is <strong>Paid</strong> and cannot be modified without admin approval
                  </Typography>
                  <Typography variant="caption">
                    📅 Cancellation policy: Full refund if cancelled 7+ days before check-in
                  </Typography>
                  <Typography variant="caption">
                    📸 Valid photo ID required at check-in
                  </Typography>
                  <Typography variant="caption">
                    📞 Contact support at +1 (555) 999-0088 for assistance
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card elevation={1} sx={{ mb: 3 }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<InfoIcon />}
                    sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                  >
                    View booking
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<DownloadIcon />}
                    sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                  >
                    Download receipt
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/book-stay')}
                    sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                  >
                    Back to Book Stay
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Need Help */}
            <Card elevation={1}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <ChatIcon fontSize="small" sx={{ color: 'primary.main' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Need Help?
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  Our support team is here for you
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="small"
                    startIcon={<ChatIcon />}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ justifyContent: 'space-between', textTransform: 'none' }}
                  >
                    Live Chat
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="small"
                    startIcon={<EmailIcon />}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ justifyContent: 'space-between', textTransform: 'none' }}
                  >
                    Email Support
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box sx={{ mt: 4, py: 3, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
            <ShieldIcon fontSize="small" sx={{ color: 'success.main' }} />
            <Typography variant="caption" color="text.secondary">
              Secure blockchain-verified booking
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            © 2026 BCHP Booking. All rights reserved
          </Typography>
        </Box>
      </Box>
    </Layout>
  );
}