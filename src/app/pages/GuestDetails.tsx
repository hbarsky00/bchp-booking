import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import Layout from '../components/Layout';
import Photo from '../components/Photo';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import NotesIcon from '@mui/icons-material/Notes';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import BedIcon from '@mui/icons-material/Bed';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import VerifiedIcon from '@mui/icons-material/Verified';
import InfoIcon from '@mui/icons-material/Info';
import ChatIcon from '@mui/icons-material/Chat';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShieldIcon from '@mui/icons-material/Shield';
import ReceiptIcon from '@mui/icons-material/Receipt';
import IconButton from '@mui/material/IconButton';

export default function GuestDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleContinue = () => {
    navigate('/shop');
  };

  // Mock booking data - in real app, this would come from route state or API
  const bookingData = {
    unit: {
      name: 'Sunset Studio Suite',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      floor: '2nd Floor',
      rating: 4.9,
    },
    checkIn: 'Feb 20, 2026',
    checkOut: 'Feb 23, 2026',
    nights: 3,
    pricing: {
      roomRate: 114.0,
      serviceFee: 12.0,
      cleaningFee: 8.0,
      total: 134.0,
    },
  };

  return (
    <Layout>
      <Box>
        {/* Header with Back Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              border: 1,
              borderColor: 'divider',
              '&:hover': {
                bgcolor: 'action.hover',
              }
            }}
           aria-label="Go back">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h1" gutterBottom>
              Guest Details
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please provide your contact information to complete your booking.
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Contact Information Form */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <Card elevation={1}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <PersonIcon color="primary" />
                  <Typography variant="h6" component="h2">Contact Information</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  All fields marked with * are required
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <Typography variant="body2" fontWeight={500} gutterBottom>
                      Full Name <Typography component="span" color="error">*</Typography>
                    </Typography>
                    <TextField
                      fullWidth
                      required
                      placeholder="Enter your full name"
                      inputProps={{ 'aria-label': 'Full name' }}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" fontWeight={500} gutterBottom>
                      Phone Number <Typography component="span" color="error">*</Typography>
                    </Typography>
                    <TextField
                      fullWidth
                      required
                      placeholder="+62 812 3456 7890"
                      inputProps={{ 'aria-label': 'Phone number' }}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <PhoneIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" fontWeight={500} gutterBottom>
                      Email Address <Typography component="span" color="error">*</Typography>
                    </Typography>
                    <TextField
                      fullWidth
                      required
                      type="email"
                      placeholder="your.email@example.com"
                      inputProps={{ 'aria-label': 'Email address' }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" fontWeight={500} gutterBottom>
                      Special Requests <Typography component="span" color="text.secondary">(Optional)</Typography>
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Any special requests or notes for your stay? (e.g., early check-in, dietary requirements, accessibility needs)"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      inputProps={{ maxLength: 500, 'aria-label': 'Special requests (optional)' }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                            <NotesIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      Maximum 500 characters
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                          <Typography variant="body2" component="span">
                            I agree to the{' '}
                          </Typography>
                          <Typography 
                            component="span" 
                            color="primary" 
                            sx={{ 
                              cursor: 'pointer', 
                              textDecoration: 'underline',
                              fontSize: '0.875rem',
                              mx: 0.5
                            }}
                          >
                            terms and conditions
                          </Typography>
                          <Typography component="span" color="error" sx={{ fontSize: '0.875rem' }}>
                            *
                          </Typography>
                        </Box>
                      }
                      sx={{ alignItems: 'center', m: 0 }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 4, mt: 0.5 }}>
                      By continuing, you agree to our booking terms, cancellation policy, and privacy policy.
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  fullWidth
                  disabled={!termsAccepted || !fullName || !phone || !email}
                  onClick={handleContinue}
                  sx={{ mt: 3 }}
                >
                  Continue
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Booking Summary Sidebar */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Card elevation={1}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <ReceiptIcon color="primary" />
                  <Typography variant="h6" component="h2">Booking Summary</Typography>
                </Box>
                <Chip label="Light booking" size="small" color="info" sx={{ mb: 2 }} />

                <Card elevation={0} sx={{ bgcolor: 'grey.50', mb: 3 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Photo
                      src={bookingData.unit.image}
                      alt={bookingData.unit.name}
                      sx={{ height: 120 }}
                    />
                  </Box>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                      <BedIcon fontSize="small" color="primary" />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {bookingData.unit.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          {bookingData.unit.floor}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <Typography variant="body2">{bookingData.unit.rating} rating</Typography>
                    </Box>
                  </CardContent>
                </Card>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                  <CalendarTodayIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Check-in
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {bookingData.checkIn}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                  <CalendarTodayIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Check-out
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {bookingData.checkOut}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 3 }}>
                  <NightsStayIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {bookingData.nights} nights
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Room rate
                  </Typography>
                  <Typography variant="body2">${bookingData.pricing.roomRate.toFixed(2)}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Service fee
                  </Typography>
                  <Typography variant="body2">${bookingData.pricing.serviceFee.toFixed(2)}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Cleaning fee
                  </Typography>
                  <Typography variant="body2">${bookingData.pricing.cleaningFee.toFixed(2)}</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" component="p">Total</Typography>
                  <Typography variant="h5" component="p" color="primary" fontWeight={600}>
                    ${bookingData.pricing.total.toFixed(2)}
                  </Typography>
                </Box>

                <Card elevation={0} sx={{ bgcolor: 'success.lighter', border: 1, borderColor: 'success.light', p: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <ShieldIcon fontSize="small" color="success" />
                    <Typography variant="subtitle2" fontWeight={600} color="success.dark">
                      Secure Booking
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="success.dark" sx={{ display: 'block', mb: 1 }}>
                    Your information is protected
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon sx={{ fontSize: 14, color: 'success.main' }} />
                      <Typography variant="caption" color="success.dark">
                        Blockchain-verified transactions
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon sx={{ fontSize: 14, color: 'success.main' }} />
                      <Typography variant="caption" color="success.dark">
                        End-to-end encryption
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon sx={{ fontSize: 14, color: 'success.main' }} />
                      <Typography variant="caption" color="success.dark">
                        Instant booking confirmation
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Need Help Card - Full Width */}
        <Card elevation={1} sx={{ mt: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <HelpOutlineIcon sx={{ color: 'white' }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Need Help?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  If you have any questions or need assistance with your booking, our support team is here to help.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button variant="outlined" startIcon={<ChatIcon />} onClick={() => navigate('/contact-support')}>
                    Contact Support
                  </Button>
                  <Button variant="outlined" startIcon={<InfoIcon />} onClick={() => navigate('/faqs')}>
                    View FAQs
                  </Button>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box sx={{ mt: 4, py: 3, borderTop: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShieldIcon fontSize="small" color="success" />
          <Typography variant="caption" color="text.secondary">
            Secure blockchain-verified booking
          </Typography>
        </Box>
      </Box>
    </Layout>
  );
}