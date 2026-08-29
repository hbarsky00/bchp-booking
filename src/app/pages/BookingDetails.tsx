import { useNavigate, useParams, useLocation } from 'react-router';
import Layout from '../components/Layout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import BedIcon from '@mui/icons-material/Bed';
import WifiIcon from '@mui/icons-material/Wifi';
import KitchenIcon from '@mui/icons-material/Kitchen';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VerifiedIcon from '@mui/icons-material/Verified';
import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Shield';
import CancelIcon from '@mui/icons-material/Cancel';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import EventIcon from '@mui/icons-material/Event';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import EmailIcon from '@mui/icons-material/Email';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { c } from '../tokens';

export default function BookingDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const bookingData = {
    id: 'BCHP-2026-00847',
    status: 'Paid',
    currentStage: 'Paid',
    unit: {
      name: '2nd Floor Unit',
      description: 'Spacious residential unit with modern amenities, full kitchen, and comfortable living space perfect for extended stays.',
      bedrooms: 2,
      bathrooms: 1,
      features: ['WiFi', 'Kitchen'],
      floor: '2nd Floor',
    },
    checkIn: {
      date: 'March 15, 2026',
      time: '3:00 PM',
    },
    checkOut: {
      date: 'March 20, 2026',
      time: '11:00 AM',
    },
    nights: 5,
    adults: 2,
    guest: {
      name: 'Alex Morgan',
      email: 'alex.morgan@email.com',
      phone: '+1 (305) 123-3457',
      country: 'United States',
    },
    payment: {
      method: 'BSV Payment',
      status: 'Verified',
      transactionId: '0x7fd5cc2b...ed8e8a487a5cf1e4...ba86c6...BefEab0fba',
      date: 'March 10, 2026',
      time: '2:34 PM UTC',
      amount: '$850.00',
      breakdown: {
        nights: '$695.00',
        serviceFee: '$2.80',
        taxes: '$152.20',
      },
    },
    property: {
      name: '123 Main Street',
      address: 'Downtown District, City 12345',
    },
    tokens: [
      {
        name: 'Tokens',
        description: 'Blockchain verified',
        status: 'verified',
      },
      {
        name: 'Proof of Stay',
        description: 'Issued after check-in',
        status: 'pending',
      },
      {
        name: 'Thank You Token',
        description: 'Pending check-out',
        status: 'pending',
      },
    ],
  };

  const stages = [
    { name: 'Draft', label: 'Created', status: 'completed' },
    { name: 'Reserved', label: 'Confirmed', status: 'completed' },
    { name: 'Paid', label: 'Current', status: 'current' },
    { name: 'Checked In', label: 'Pending', status: 'pending' },
    { name: 'Checked Out', label: 'Pending', status: 'pending' },
  ];

  return (
    <Layout>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ border: 1, borderColor: 'divider' }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h1">Booking Details</Typography>
            <Typography variant="body1" color="text.secondary">
              Booking ID: #{bookingData.id}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Booking Status Card */}
            <Card elevation={1} sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">Booking Status</Typography>
                  <Chip
                    icon={<CheckCircleIcon />}
                    label={bookingData.status}
                    color="success"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                {/* Status Timeline */}
                <Box sx={{ display: 'flex', gap: 2, mb: 4, overflowX: 'auto', pb: 1 }}>
                  {stages.map((stage, index) => (
                    <Box key={stage.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: '0 0 auto' }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            bgcolor: stage.status === 'completed' ? 'success.main' : stage.status === 'current' ? 'primary.main' : 'grey.300',
                            border: 3,
                            borderColor: stage.status === 'completed' ? 'success.main' : stage.status === 'current' ? 'primary.main' : 'grey.300',
                            mx: 'auto',
                            mb: 1,
                          }}
                        />
                        <Typography
                          variant="body2"
                          fontWeight={stage.status === 'current' ? 700 : stage.status === 'completed' ? 600 : 500}
                          color={stage.status === 'pending' ? 'text.secondary' : 'text.primary'}
                          sx={{ whiteSpace: 'nowrap' }}
                        >
                          {stage.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {stage.label}
                        </Typography>
                      </Box>
                      {index < stages.length - 1 && (
                        <Box
                          sx={{
                            width: 60,
                            height: 2,
                            bgcolor: stage.status === 'completed' ? 'success.main' : 'grey.300',
                            mt: -3,
                          }}
                        />
                      )}
                    </Box>
                  ))}
                </Box>

                {/* Ready for Check-In Alert */}
                <Card elevation={0} sx={{ bgcolor: 'info.lighter', border: 1, borderColor: 'info.light', p: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        bgcolor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <InfoIcon sx={{ color: 'white' }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Ready for Check-In
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Your booking is confirmed and paid. You can check in starting March 15, 2024 at 3:00 PM. Staff or self check-in will issue your Proof of Stay token.
                      </Typography>
                      <Button variant="contained" startIcon={<ConfirmationNumberIcon />}>
                        Confirm arrival
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </CardContent>

              <Divider />

              <CardContent sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Need to make changes?
                </Typography>
                <Button color="error" startIcon={<CancelIcon />}>
                  Cancel booking
                </Button>
              </CardContent>
            </Card>

            {/* Unit Information Card */}
            <Card elevation={1} sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      width: 96,
                      height: 96,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${c.sky50} 0%, ${c.blue50} 70.711%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <BedIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" gutterBottom>
                      {bookingData.unit.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {bookingData.unit.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label={`${bookingData.unit.bedrooms} Bedrooms`} size="small" variant="outlined" />
                      <Chip label={`${bookingData.unit.bathrooms} Bathroom`} size="small" variant="outlined" />
                      {bookingData.unit.features.map((feature) => (
                        <Chip key={feature} label={feature} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Check-in/Check-out */}
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Check-in
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {bookingData.checkIn.date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {bookingData.checkIn.time}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Check-out
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {bookingData.checkOut.date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {bookingData.checkOut.time}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Summary */}
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography variant="h6">{bookingData.nights} nights</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Guests
                    </Typography>
                    <Typography variant="h6">{bookingData.adults} adults</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Room rate
                    </Typography>
                    <Typography variant="h6">{bookingData.payment.breakdown.nights}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      {bookingData.payment.amount}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Guest Information Card */}
            <Card elevation={1} sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Guest Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Full name
                    </Typography>
                    <Typography variant="body1">{bookingData.guest.name}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Email address
                    </Typography>
                    <Typography variant="body1">{bookingData.guest.email}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Phone number
                    </Typography>
                    <Typography variant="body1">{bookingData.guest.phone}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Country
                    </Typography>
                    <Typography variant="body1">{bookingData.guest.country}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Payment Information Card */}
            <Card elevation={1}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">Payment Information</Typography>
                  <Chip icon={<VerifiedIcon />} label="Verified" color="success" size="small" />
                </Box>

                <Card elevation={0} sx={{ bgcolor: 'success.lighter', border: 1, borderColor: 'success.light', p: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <ShieldIcon fontSize="small" color="success" />
                    <Typography variant="subtitle2" color="success.dark">
                      {bookingData.payment.method}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Transaction Reference
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      wordBreak: 'break-all',
                      color: 'text.secondary',
                      fontSize: '0.75rem',
                    }}
                  >
                    {bookingData.payment.transactionId}
                  </Typography>
                </Card>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Payment date
                    </Typography>
                    <Typography variant="body1">{bookingData.payment.date}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {bookingData.payment.time}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total payment
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      {bookingData.payment.amount}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                  Price Breakdown
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {bookingData.nights} nights x $139.00
                  </Typography>
                  <Typography variant="body2">{bookingData.payment.breakdown.nights}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Service fee
                  </Typography>
                  <Typography variant="body2">{bookingData.payment.breakdown.serviceFee}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Taxes
                  </Typography>
                  <Typography variant="body2">{bookingData.payment.breakdown.taxes}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Total
                  </Typography>
                  <Typography variant="h6" color="primary.main" fontWeight={600}>
                    {bookingData.payment.amount}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Tokens Card */}
            <Card elevation={1} sx={{ mb: 3, bgcolor: 'secondary.lighter', border: 1, borderColor: 'secondary.light' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <LockIcon fontSize="small" color="secondary" />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Tokens
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  Blockchain verified
                </Typography>
                <Divider sx={{ my: 2 }} />
                {bookingData.tokens.map((token, index) => (
                  <Box key={index} sx={{ mb: index < bookingData.tokens.length - 1 ? 2 : 0 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                      <ShieldIcon fontSize="small" color={token.status === 'verified' ? 'success' : 'disabled'} />
                      <Typography variant="body2" fontWeight={600}>
                        {token.name}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {token.description}
                    </Typography>
                    {token.status === 'verified' && (
                      <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 0.5 }}>
                        Will be issued upon check-in confirmation
                      </Typography>
                    )}
                  </Box>
                ))}
              </CardContent>
            </Card>

            {/* Property Details Card */}
            <Card elevation={1} sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <BedIcon fontSize="small" color="primary" />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Property Details
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {bookingData.property.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {bookingData.property.address}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Before Arrival
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CheckCircleIcon fontSize="small" color="success" />
                    <Typography variant="body2">Received booking confirmation via reception</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CheckCircleIcon fontSize="small" color="success" />
                    <Typography variant="body2">Valid ID for verification</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CheckCircleIcon fontSize="small" color="success" />
                    <Typography variant="body2">Keys will be provided upon check-in</Typography>
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    House Rules
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CancelIcon fontSize="small" color="error" />
                    <Typography variant="body2">No smoking inside units</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CancelIcon fontSize="small" color="error" />
                    <Typography variant="body2">No parties or events allowed</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoIcon fontSize="small" color="info" />
                    <Typography variant="body2">Quiet hours: 10 PM - 8 AM</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Need Help Card */}
            <Card elevation={1}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <HelpOutlineIcon fontSize="small" color="primary" />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Need Help?
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  We're here to assist with any questions
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button variant="outlined" fullWidth startIcon={<PhoneIcon />} sx={{ justifyContent: 'flex-start' }}>
                    Call Property
                    <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary' }}>
                      +1 987-654-4321
                    </Typography>
                  </Button>
                  <Button variant="outlined" fullWidth startIcon={<ChatIcon />} sx={{ justifyContent: 'flex-start' }}>
                    Live Chat
                    <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary' }}>
                      Available 24/7
                    </Typography>
                  </Button>
                  <Button variant="outlined" fullWidth startIcon={<EmailIcon />} sx={{ justifyContent: 'flex-start' }}>
                    Email Support
                    <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary' }}>
                      Response in 2-4h
                    </Typography>
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card elevation={1} sx={{ mt: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button variant="text" fullWidth startIcon={<DownloadIcon />} sx={{ justifyContent: 'flex-start' }}>
                    Download confirmation
                  </Button>
                  <Button variant="text" fullWidth startIcon={<ShareIcon />} sx={{ justifyContent: 'flex-start' }}>
                    Share booking
                  </Button>
                  <Button variant="text" fullWidth startIcon={<EventIcon />} sx={{ justifyContent: 'flex-start' }}>
                    Add to calendar
                  </Button>
                  <Button variant="text" fullWidth startIcon={<ReceiptIcon />} sx={{ justifyContent: 'flex-start' }}>
                    View receipt
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}