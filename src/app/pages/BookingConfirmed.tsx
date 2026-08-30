import { useNavigate, useLocation } from 'react-router';
import Layout from '../components/Layout';
import CheckoutHeader from '../components/CheckoutHeader';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { formatDate, useBooking } from '../lib/bookings';
import { downloadText } from '../lib/actions';
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
import EmailIcon from '@mui/icons-material/Email';
import ChatIcon from '@mui/icons-material/Chat';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import NotificationsIcon from '@mui/icons-material/Notifications';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import TokenIcon from '@mui/icons-material/Token';
import VerifiedIcon from '@mui/icons-material/Verified';
import ShieldIcon from '@mui/icons-material/Shield';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { c, r } from '../tokens';

export default function BookingConfirmed() {
  const navigate = useNavigate();
  const location = useLocation();
  const reference = (location.state as any)?.reference as string | undefined;
  const { booking, loading: bookingLoading } = useBooking(reference);

  const handleDownloadReceipt = () => {
    downloadText('bitstay-receipt.txt', [
      'BITSTAY BOOKING RECEIPT',
      '====================',
      `Confirmation: ${booking?.reference ?? '—'}`,
      `Unit:         ${booking?.unitName ?? '—'}`,
      `Check-in:     ${booking ? formatDate(booking.checkIn) : '—'}`,
      `Check-out:    ${booking ? formatDate(booking.checkOut) : '—'}`,
      `Guests:       ${booking?.guests ?? '—'}`,
      `Total:        $${(booking?.total ?? 0).toFixed(2)}`,
      'Status:       Paid, settled on-chain',
    ].join('\n'));
  };

  /**
   * The month containing check-in, with the booked nights marked. Half-open, like every
   * other date range here: the check-out day is when the room is handed back, so it is
   * not shaded as a night stayed.
   */
  const calendar = (() => {
    const iso = booking?.checkIn?.slice(0, 10);
    const [cy, cm, cd] = (iso ?? '').split('-').map(Number);
    const anchor = iso ? new Date(Date.UTC(cy, cm - 1, cd)) : new Date();
    const year = anchor.getUTCFullYear();
    const month = anchor.getUTCMonth();
    const first = new Date(Date.UTC(year, month, 1));
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const todayIso = new Date().toISOString().slice(0, 10);
    const dayIso = (d: number) =>
      `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    const cells: ({ day: number; booked: boolean; isToday: boolean } | null)[] =
      Array.from({ length: first.getUTCDay() }, () => null);
    for (let d = 1; d <= daysInMonth; d++) {
      const day = dayIso(d);
      cells.push({
        day: d,
        booked: !!booking && day >= booking.checkIn.slice(0, 10) && day < booking.checkOut.slice(0, 10),
        isToday: day === todayIso,
      });
    }
    return {
      cells,
      monthLabel: first.toLocaleDateString(undefined, { timeZone: 'UTC', month: 'long', year: 'numeric' }),
    };
  })();

  // Everything below reflects the booking that was actually written, not a sample.
  const bookingData = {
    confirmationId: booking?.reference ?? '—',
    status: booking?.status === 'paid' ? 'Paid' : booking?.status ?? '—',
    checkIn: {
      date: booking ? formatDate(booking.checkIn, { weekday: undefined }) : '—',
      day: booking ? formatDate(booking.checkIn, { weekday: 'long', month: undefined, day: undefined, year: undefined }) : '',
      time: '3:00 PM',
      location: '123 Main Street, Downtown District',
    },
    checkOut: {
      date: booking ? formatDate(booking.checkOut) : '—',
      day: booking ? formatDate(booking.checkOut, { weekday: 'long', month: undefined, day: undefined, year: undefined }) : '',
      time: '11:00 AM',
    },
    nights: booking?.nights ?? 0,
    accommodation: {
      name: booking?.unitName ?? '—',
      type: booking?.unitFloor ?? '',
      guests: booking?.guests ?? 0,
      bedrooms: 1,
      bathrooms: 1,
      price: booking?.nightlyRate ?? 0,
    },
    guest: {
      name: booking?.guestName ?? '—',
      email: booking?.guestEmail ?? '—',
      phone: booking?.guestPhone ?? '—',
      requests: booking?.notes || 'None',
    },
    payment: {
      method: (booking?.paymentMethod ?? 'bsv').toUpperCase(),
      type: 'Settled on-chain',
      accommodation: booking?.total ?? 0,
      serviceFee: 0,
      taxes: 0,
      total: booking?.total ?? 0,
      txReference: booking?.reference ?? '—',
    },
  };

  return (
    <Layout>
      <Box>
        {/* The funnel's last step keeps the same rail, so the run of screens reads as one
            flow that finished rather than a separate page that happens to say "confirmed". */}
        <CheckoutHeader
          step={3}
          title="Booking confirmed"
          subtitle="Payment settled and your room is held. The details are below."
        />
        <Box
          sx={{
            display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, p: 2,
            bgcolor: c.green50, border: `1px solid ${c.green200}`, borderRadius: `${r.md}px`,
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 28, color: c.green600 }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: c.green700 }}>
            You're all set — a copy of these details is on your Trips page.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column - Booking Details */}
          <Grid size={{ xs: 12, lg: 7 }}>
            {/* Booking Summary */}
            <Card elevation={1} sx={{ mb: 3 }}>
              <CardContent>
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
              <CardContent>
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
            {/*
              A calendar of the stay that was actually booked. It used to be a fixed
              fixed month grid with the 19th and 20th shaded in whatever the guest had
              booked, and a "Today" key that matched no cell on the page.
            */}
            <Card elevation={1} sx={{ mb: 3 }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }} id="stay-calendar">
                  Your booking dates
                </Typography>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">{calendar.monthLabel}</Typography>
                </Box>
                <Box
                  role="grid"
                  aria-labelledby="stay-calendar"
                  sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 2 }}
                >
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <Box key={day} sx={{ textAlign: 'center', py: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">{day}</Typography>
                    </Box>
                  ))}
                  {calendar.cells.map((cell, index) => (
                    <Box
                      key={index}
                      sx={{
                        textAlign: 'center', py: 0.5, borderRadius: `${r.sm}px`,
                        bgcolor: cell?.booked ? c.coral600 : cell?.isToday ? c.stone200 : 'transparent',
                        color: cell?.booked ? c.white : c.stone900,
                      }}
                    >
                      {cell && (
                        <Typography variant="caption" className="tnum" sx={{ fontWeight: cell.booked ? 700 : 400 }}>
                          {cell.day}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: c.coral600, borderRadius: `${r.sm}px` }} />
                    <Typography variant="caption">Your stay</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: c.stone200, borderRadius: `${r.sm}px` }} />
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
                    onClick={() => navigate('/my-bookings')}
                    sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                  >
                    View booking
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadReceipt}
                    sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                  >
                    Download receipt
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<StorefrontIcon />}
                    onClick={() => navigate('/shop')}
                    sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                  >
                    Order to your room
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
                    onClick={() => navigate('/contact-support')}
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
                    onClick={() => navigate('/contact-support')}
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
            © 2026 BitStay. All rights reserved
          </Typography>
        </Box>
      </Box>
    </Layout>
  );
}