import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import Layout from '../components/Layout';
import CheckoutHeader from '../components/CheckoutHeader';
import { formatDate, nightsBetween, saveDraft } from '../lib/bookings';
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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import BedIcon from '@mui/icons-material/Bed';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import InfoIcon from '@mui/icons-material/Info';
import ChatIcon from '@mui/icons-material/Chat';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShieldIcon from '@mui/icons-material/Shield';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Link from '@mui/material/Link';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

export default function GuestDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateGuest = () => {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = 'Enter the name the booking is under';
    if (!phone.trim()) next.phone = 'We need a phone number for check-in';
    if (!email.trim()) next.email = 'Enter an email address for your confirmation';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) next.email = 'That does not look like a valid email address';
    if (!termsAccepted) next.terms = 'Please accept the booking terms to continue';
    return next;
  };

  const handleContinue = () => {
    const found = validateGuest();
    setErrors(found);
    if (Object.keys(found).length) {
      const first = ['fullName', 'phone', 'email'].find(k => found[k]);
      if (first) document.querySelector<HTMLElement>(`[data-field="${first}"] input`)?.focus();
      return;
    }
    return continueToShop();
  };

  const continueToShop = () => {
    // Persist the draft before the Shop detour — router state does not survive it.
    const unit = bookingData?.unit;
    if (unit) {
      saveDraft({
        unitId: unit.id,
        unitName: unit.name,
        unitImage: unit.image,
        unitFloor: unit.floor,
        price: Number(unit.price),
        // Straight from the property page's server quote, so no step downstream has to
        // re-derive a seasonal total and risk disagreeing with it.
        stayTotal: Number(bookingData.searchParams?.stayTotal) || Number(unit.price) * nights,
        averageRate: Number(bookingData.searchParams?.averageRate) || Number(unit.price),
        rateLines: bookingData.searchParams?.rateLines ?? [],
        checkIn: bookingData.searchParams?.checkIn ?? '',
        checkOut: bookingData.searchParams?.checkOut ?? '',
        guests: Number(bookingData.searchParams?.guests) || 1,
        guestName: fullName.trim(),
        guestEmail: email.trim(),
        guestPhone: phone.trim(),
        notes: specialRequests.trim(),
      });
    }
    navigate('/shop');
  };

  // Mock booking data - in real app, this would come from route state or API
  const { unit, searchParams } = (location.state as any) || {};

  // Without a chosen unit there is nothing to book; send the guest back to search.
  useEffect(() => {
    if (!unit) navigate('/search-results', { replace: true });
  }, [unit, navigate]);
  if (!unit) return null;

  const checkIn = searchParams?.checkIn ?? '';
  const checkOut = searchParams?.checkOut ?? '';
  const nights = nightsBetween(checkIn, checkOut) || 1;
  const roomRate = Number(unit.price) * nights;

  const bookingData = {
    unit: {
      id: unit.id,
      name: unit.name,
      image: unit.image,
      floor: unit.floor,
      rating: unit.rating,
      price: Number(unit.price),
    },
    searchParams,
    checkIn: checkIn ? formatDate(checkIn) : 'Dates not set',
    checkOut: checkOut ? formatDate(checkOut) : 'Dates not set',
    nights,
    pricing: {
      roomRate,
      serviceFee: 0,
      cleaningFee: 0,
      total: roomRate,
    },
  };

  return (
    <Layout>
      <Box>
        <CheckoutHeader
          step={0}
          title="Guest details"
          subtitle="Who is staying? We use this to hold the room and send your confirmation."
          backTo={-1}
          backLabel="Back to stay"
        />

        <Grid container spacing={3}>
          {/* Contact Information Form */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <Card elevation={1}>
              <CardContent>
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
                      data-field="fullName"
                      error={Boolean(errors.fullName)}
                      helperText={errors.fullName ?? ' '}
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
                      data-field="phone"
                      error={Boolean(errors.phone)}
                      helperText={errors.phone ?? ' '}
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
                      data-field="email"
                      error={Boolean(errors.email)}
                      helperText={errors.email ?? ' '}
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
                    {errors.terms && (
                      <Typography role="alert" variant="body2" sx={{ color: 'error.main', mb: 0.5 }}>
                        {errors.terms}
                      </Typography>
                    )}
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          sx={{ color: errors.terms ? 'error.main' : undefined }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                          <Typography variant="body2" component="span">
                            I agree to the{' '}
                          </Typography>
                          <Link
                            component="button"
                            type="button"
                            onClick={(e) => { e.preventDefault(); setTermsOpen(true); }}
                            sx={{
                              fontSize: '0.875rem', mx: 0.5, verticalAlign: 'baseline',
                              // Inside a checkbox label, so a small target here is not just
                              // hard to hit — a miss silently toggles the checkbox instead.
                              display: 'inline-flex', alignItems: 'center', minHeight: 44, px: 0.5,
                            }}
                          >
                            terms and conditions
                          </Link>
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
              <CardContent>
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
          <CardContent>
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

      {/* The terms the app genuinely enforces — nothing here is aspirational text. */}
      <Dialog open={termsOpen} onClose={() => setTermsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Booking terms</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" component="div">
            <Box component="ul" sx={{ pl: 2.5, m: 0, display: 'grid', gap: 1.5 }}>
              <li>Stays run for a minimum of three nights.</li>
              <li>
                Check-in is from 3:00 PM and check-out is by 11:00 AM. Your room is held from
                your check-in date up to, but not including, your check-out date.
              </li>
              <li>
                Cancel from your Trips page at any time before check-in and the dates are
                released immediately.
              </li>
              <li>
                Settlement is recorded against your booking reference. Shop extras are charged
                as a separate order against the same stay.
              </li>
              <li>
                The name, email and phone number you give here are used to hold the room and to
                reach you about this booking only.
              </li>
            </Box>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTermsOpen(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => { setTermsAccepted(true); setTermsOpen(false); }}
          >
            Accept and continue
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}