import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';
import CheckoutHeader from '../components/CheckoutHeader';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { clearDraft, createBooking, formatDate, loadDraft, nightsBetween } from '../lib/bookings';
import { useCart } from '../lib/cart';
import Photo from '../components/Photo';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import PaymentIcon from '@mui/icons-material/Payment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import VerifiedIcon from '@mui/icons-material/Verified';
import InfoIcon from '@mui/icons-material/Info';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import BedIcon from '@mui/icons-material/Bed';
import { c } from '../tokens';

export default function PaymentMethod() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('bsv');

  const draft = loadDraft();
  const { cart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  // What the guest is actually about to pay. This used to be three fixed figures in the
  // markup, so the summary described a different room, different dates and a different
  // price from the booking the Confirm button went on to create.
  const nights = draft ? nightsBetween(draft.checkIn, draft.checkOut) || 1 : 0;
  // The quote the guest agreed to, not a fresh multiplication that ignores seasons.
  const stayTotal = draft ? (draft.stayTotal ?? draft.price * nights) : 0;
  const total = stayTotal + cart.subtotal;

  // Nothing to pay for without a draft — that means the flow was entered sideways.
  useEffect(() => {
    if (!draft) navigate('/book-stay', { replace: true });
  }, [draft, navigate]);
  // Render nothing while that redirect lands; every figure below comes from the draft.
  if (!draft) return null;

  const handleContinue = async () => {
    if (!draft || submitting) return;
    setSubmitting(true);
    setPayError(null);
    try {
      // The booking is written here, inside a transaction that re-checks availability.
      // Someone else may have taken these dates while this guest was in the Shop.
      const booking = await createBooking({
        unitId: draft.unitId,
        checkIn: draft.checkIn,
        checkOut: draft.checkOut,
        guests: draft.guests,
        guestName: draft.guestName,
        guestEmail: draft.guestEmail,
        guestPhone: draft.guestPhone,
        notes: draft.notes,
        paymentMethod,
        status: 'paid',
      });
      clearDraft();
      navigate('/processing-payment', { state: { reference: booking.reference } });
    } catch (e) {
      setPayError((e as Error).message);
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <Box>
        <CheckoutHeader
          step={2}
          title="Payment"
          subtitle="Choose how you want to settle. Nothing is charged until you confirm."
          backTo="/shop"
          backLabel="Back to extras"
        />

        <Grid container spacing={3}>
          {/* Payment Options */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <Card elevation={1}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <PaymentIcon color="primary" />
                  <Box>
                    <Typography variant="h6" component="h2">Choose Payment Method</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Select how you would like to pay
                    </Typography>
                  </Box>
                </Box>

                <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  {/* BSV Option */}
                  <Card
                    variant="outlined"
                    sx={{
                      mb: 2,
                      border: paymentMethod === 'bsv' ? 2 : 1,
                      borderColor: paymentMethod === 'bsv' ? 'primary.main' : 'divider',
                      cursor: 'pointer',
                    }}
                    onClick={() => setPaymentMethod('bsv')}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <FormControlLabel
                          value="bsv"
                          control={<Radio />}
                          label=""
                          sx={{ m: 0 }}
                        />
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                            bgcolor: 'warning.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            color: 'warning.contrastText',
                          }}
                        >
                          B
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              BSV
                            </Typography>
                            <Chip label="Recommended" color="success" size="small" />
                          </Box>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                            Bitcoin SV
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Fast, secure blockchain payment with instant verification and lowest fees.
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Chip icon={<SpeedIcon />} label="Instant" size="small" variant="outlined" />
                            <Chip icon={<VerifiedIcon />} label="Verified" size="small" variant="outlined" />
                            <Chip label="0.5% fee" size="small" variant="outlined" />
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Stablecoin Option */}
                  <Card
                    variant="outlined"
                    sx={{
                      mb: 2,
                      border: paymentMethod === 'stablecoin' ? 2 : 1,
                      borderColor: paymentMethod === 'stablecoin' ? 'primary.main' : 'divider',
                      cursor: 'pointer',
                    }}
                    onClick={() => setPaymentMethod('stablecoin')}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <FormControlLabel
                          value="stablecoin"
                          control={<Radio />}
                          label=""
                          sx={{ m: 0 }}
                        />
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                            bgcolor: 'info.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            color: 'info.contrastText',
                            fontSize: '1.25rem',
                          }}
                        >
                          ≋
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Stablecoin
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                            USDC / USDT
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Pay with stablecoins for price stability and blockchain security.
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Chip label="2-5 minutes" size="small" variant="outlined" />
                            <Chip icon={<VerifiedIcon />} label="Verified" size="small" variant="outlined" />
                            <Chip label="1% fee" size="small" variant="outlined" />
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Card Option */}
                  <Card
                    variant="outlined"
                    sx={{
                      border: paymentMethod === 'card' ? 2 : 1,
                      borderColor: paymentMethod === 'card' ? 'primary.main' : 'divider',
                      cursor: 'pointer',
                    }}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <FormControlLabel
                          value="card"
                          control={<Radio />}
                          label=""
                          sx={{ m: 0 }}
                        />
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                            bgcolor: 'text.primary',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'background.paper',
                          }}
                        >
                          <PaymentIcon />
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Credit / Debit Card
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                            Visa, Mastercard, Amex
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Traditional payment method with standard processing time.
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Chip label="Instant" size="small" variant="outlined" />
                            <Chip icon={<SecurityIcon />} label="Secure" size="small" variant="outlined" />
                            <Chip label="2.9% + $0.30 fee" size="small" variant="outlined" />
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </RadioGroup>

                {payError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {payError}
                  </Alert>
                )}

                {/* One action. Back is in the checkout header with every other step's. */}
                <Box sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    endIcon={submitting ? undefined : <ArrowForwardIcon />}
                    fullWidth
                    size="large"
                    onClick={handleContinue}
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : undefined}
                  >
                    {submitting ? 'Confirming your booking…' : `Confirm and pay $${total.toFixed(2)}`}
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Processing Fees Info */}
            <Card elevation={1} sx={{ mt: 2, bgcolor: c.amber100, border: `1px solid ${c.amber200}` }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <InfoIcon sx={{ color: c.amber800, fontSize: 20 }} />
                  <Typography variant="subtitle1" sx={{ color: c.stone900, fontWeight: 600 }}>
                    Processing Fees
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: c.stone600, mb: 1.5 }}>
                  Transaction fees vary by payment method. BSV offers the lowest fees and fastest processing time.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography variant="body2" sx={{ color: c.stone800 }}>
                    • <strong>BSV:</strong> 0.5% transaction fee
                  </Typography>
                  <Typography variant="body2" sx={{ color: c.stone800 }}>
                    • <strong>Stablecoin:</strong> 1% transaction fee
                  </Typography>
                  <Typography variant="body2" sx={{ color: c.stone800 }}>
                    • <strong>Card:</strong> 2.9% + $0.30 processing fee
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Blockchain Verification */}
            <Card elevation={1} sx={{ mt: 2, bgcolor: c.blue50, border: `1px solid ${c.blue100}` }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <VerifiedIcon sx={{ color: c.coral700, fontSize: 20 }} />
                  <Typography variant="subtitle1" sx={{ color: c.stone900, fontWeight: 600 }}>
                    Blockchain Verification
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: c.stone600, mb: 1 }}>
                  All payments are secured and verified on the blockchain with a unique reference ID for complete transparency.
                </Typography>
                <Typography variant="body2" sx={{ color: c.stone600 }}>
                  Your booking remains in <strong>Reserved</strong> status until payment is successfully processed.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Booking Summary Sidebar */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Card elevation={1}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <BedIcon color="primary" />
                  <Typography variant="h6" component="h2">Booking Summary</Typography>
                </Box>
                <Chip label="Reserved" color="primary" size="small" sx={{ mb: 2 }} />

                <Box sx={{ position: 'relative', mb: 2 }}>
                  <Photo src={draft.unitImage} alt={draft.unitName} sx={{ height: 120 }} />
                  <Chip
                    label={draft.unitFloor}
                    size="small"
                    sx={{ position: 'absolute', top: 8, left: 8, bgcolor: 'background.paper' }}
                  />
                </Box>

                <Typography variant="h6" component="h2" gutterBottom>
                  {draft.unitName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                  <BedIcon sx={{ fontSize: 16, color: c.stone500 }} />
                  <Typography variant="body2" color="text.secondary">
                    {draft.guests} guest{draft.guests === 1 ? '' : 's'}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CalendarTodayIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Check-in
                  </Typography>
                  <Typography variant="body2" fontWeight={500} sx={{ ml: 'auto' }}>
                    {formatDate(draft.checkIn)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CalendarTodayIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Check-out
                  </Typography>
                  <Typography variant="body2" fontWeight={500} sx={{ ml: 'auto' }}>
                    {formatDate(draft.checkOut)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <NightsStayIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography variant="body2" fontWeight={500} sx={{ ml: 'auto' }}>
                    {nights} night{nights === 1 ? '' : 's'}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {draft.rateLines?.length > 1
                      ? `${nights} nights across ${draft.rateLines.length} seasons`
                      : `$${(draft.averageRate ?? draft.price).toFixed(2)} × ${nights} night${nights === 1 ? '' : 's'}`}
                  </Typography>
                  <Typography variant="body2" className="tnum">${stayTotal.toFixed(2)}</Typography>
                </Box>

                {/* Spell the seasons out when a stay spans more than one, so the total is
                    explainable rather than just asserted. */}
                {draft.rateLines?.length > 1 && draft.rateLines.map((l) => (
                  <Box key={`${l.season}-${l.rate}`} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, pl: 1.5 }}>
                    <Typography variant="caption" sx={{ color: c.stone600 }}>
                      {l.season} · ${l.rate.toFixed(2)} × {l.nights}
                    </Typography>
                    <Typography variant="caption" className="tnum" sx={{ color: c.stone600 }}>
                      ${l.subtotal.toFixed(2)}
                    </Typography>
                  </Box>
                ))}

                {cart.itemCount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Extras ({cart.itemCount} item{cart.itemCount === 1 ? '' : 's'})
                    </Typography>
                    <Typography variant="body2" className="tnum">${cart.subtotal.toFixed(2)}</Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Service fee
                  </Typography>
                  <Typography variant="body2">None</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" component="p">Total</Typography>
                  <Typography variant="h5" component="p" color="primary" fontWeight={600} className="tnum">
                    ${total.toFixed(2)}
                  </Typography>
                </Box>

                <Typography variant="caption" color="text.secondary" display="block">
                  Including all taxes and fees
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}