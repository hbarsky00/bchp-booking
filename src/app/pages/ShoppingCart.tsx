import { useState } from 'react';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';
import Photo from '../components/Photo';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShieldIcon from '@mui/icons-material/Shield';
import LockIcon from '@mui/icons-material/Lock';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { c, r } from '../tokens';
import { placeOrder, useCart, type Order } from '../lib/cart';
import { formatDate, guestKey, loadDraft, nightsBetween } from '../lib/bookings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

export default function ShoppingCart() {
  const navigate = useNavigate();
  // The cart now lives in the database, shared with the Shop page. Items previously
  // hardcoded here never reflected anything the user actually added.
  const { cart, loading, error, changeQty, remove, clear } = useCart();
  const cartItems = cart.items.map(i => ({
    id: i.productId,
    name: i.name,
    description: i.description,
    price: i.price,
    quantity: i.quantity,
    image: i.image,
  }));

  // Mid-booking the cart is "your whole order": the stay plus any extras. Showing only
  // the snacks made people think they had lost the room they had just chosen.
  const draft = loadDraft();
  const stayNights = draft ? nightsBetween(draft.checkIn, draft.checkOut) : 0;
  const stayTotal = draft ? draft.price * stayNights : 0;

  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Order | null>(null);

  const handlePlaceOrder = async () => {
    if (placing || !cartItems.length) return;
    setPlacing(true);
    setOrderError(null);
    try {
      setPlaced(await placeOrder(guestKey()));
    } catch (e) {
      setOrderError((e as Error).message);
    } finally {
      setPlacing(false);
    }
  };

  const updateQuantity = (id: number, change: number) => { void changeQty(id, change); };
  const removeItem = (id: number) => { void remove(id); };
  const clearCart = () => { void clear(); };

  const subtotal = cart.subtotal;
  const total = stayTotal + subtotal;

  // Placing an order used to dead-end at the booking payment screen. It now ends here,
  // with a reference, where it is going, and an obvious way onward.
  if (placed) {
    return (
      <Layout>
        <Box sx={{ maxWidth: 560, mx: 'auto', textAlign: 'center', py: { xs: 5, md: 8 } }}>
          <CheckCircleIcon sx={{ fontSize: 56, color: 'success.main', mb: 2 }} />
          <Typography variant="h1" gutterBottom>Order placed</Typography>
          <Typography variant="body1" sx={{ color: c.stone600, mx: 'auto', mb: 1 }}>
            {placed.unitName
              ? `We'll bring it to ${placed.unitName} within 30 minutes.`
              : 'Collect it from reception whenever you are ready.'}
          </Typography>
          <Typography variant="body2" className="tnum" sx={{ color: c.stone600, mx: 'auto', mb: 4 }}>
            Order {placed.reference}
          </Typography>

          <Card sx={{ textAlign: 'left', mb: 4 }}>
            <CardContent>
              {placed.items.map(line => (
                <Box key={line.productId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{line.quantity} × {line.name}</Typography>
                  <Typography variant="body2" className="tnum">
                    ${(line.unitPrice * line.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" fontWeight={700}>Total</Typography>
                <Typography variant="subtitle1" fontWeight={700} className="tnum">
                  ${placed.subtotal.toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" onClick={() => { setPlaced(null); navigate('/shop'); }}>
              Order something else
            </Button>
            <Button variant="outlined" onClick={() => navigate('/my-bookings')}>
              View my trips
            </Button>
          </Box>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box>
        {/* Back Button and Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <IconButton
            onClick={() => navigate('/shop')}
            sx={{
              border: 1,
              borderColor: 'divider',
              '&:hover': { bgcolor: 'action.hover' },
            }}
           aria-label="Go back">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h1" gutterBottom sx={{ mb: 0.5 }}>
              Shopping Cart
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Review your items and proceed to checkout
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* The stay being booked, so the cart shows the whole order and not just snacks */}
          {draft && (
            <Grid size={12}>
              <Card sx={{ mb: 1, bgcolor: c.stone50 }}>
                <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Photo src={draft.unitImage} alt={draft.unitName} radius={r.sm} sx={{ width: 72, height: 72, flexShrink: 0 }} />
                  <Box sx={{ flex: 1, minWidth: 180 }}>
                    <Typography variant="overline" sx={{ color: c.stone600 }}>Your stay</Typography>
                    <Typography variant="h5" component="h2">{draft.unitName}</Typography>
                    <Typography variant="body2" sx={{ color: c.stone600 }}>
                      {formatDate(draft.checkIn)} – {formatDate(draft.checkOut)} · {stayNights} night{stayNights === 1 ? '' : 's'} · {draft.unitFloor}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h5" component="p" className="tnum">${stayTotal.toFixed(2)}</Typography>
                    <Typography variant="caption" sx={{ color: c.stone600 }}>
                      ${draft.price.toFixed(2)} × {stayNights}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}


          {/* Cart Items - Left Column */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card elevation={1}>
              <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShoppingBagIcon sx={{ color: 'primary.main' }} />
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                      Cart Items
                    </Typography>
                    <Box
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {cartItems.length} items
                    </Box>
                  </Box>
                  <Button
                    variant="text"
                    color="primary"
                    size="small"
                    startIcon={<ReceiptIcon />}
                    onClick={clearCart}
                    sx={{ textTransform: 'none' }}
                  >
                    Clear cart
                  </Button>
                </Box>

                {/* Cart Items List */}
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error} — could not load your cart.
                  </Alert>
                )}

                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress aria-label="Loading your cart" />
                  </Box>
                ) : cartItems.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <ShoppingBagIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" component="h2" color="text.secondary" gutterBottom>
                      Your cart is empty
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/shop')}
                      sx={{ mt: 2 }}
                    >
                      Start shopping
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {cartItems.map((item) => (
                      <Card
                        key={item.id}
                        variant="outlined"
                        sx={{
                          bgcolor: c.stone50,
                          border: 1,
                          borderColor: c.stone200,
                        }}
                      >
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { xs: 'stretch', sm: 'center' } }}>
                            {/* Product Image and Info - Mobile stacked, desktop side-by-side */}
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1 }}>
                              {/* Product Image */}
                              <Photo
                                src={item.image}
                                alt={item.name}
                                radius={r.sm}
                                sx={{
                                  width: { xs: 60, sm: 64 },
                                  height: { xs: 60, sm: 64 },
                                  flexShrink: 0,
                                }}
                              />

                              {/* Product Info */}
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                                  {item.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {item.description}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                                  ${item.price.toFixed(2)} each
                                </Typography>
                              </Box>

                              {/* Remove Button - Desktop */}
                              <IconButton
                                aria-label={`Remove ${item.name} from cart`}
                                size="small"
                                onClick={() => removeItem(item.id)}
                                sx={{
                                  display: { xs: 'none', sm: 'flex' },
                                  color: 'text.secondary',
                                  '&:hover': { color: 'error.main' },
                                }}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Box>

                            {/* Quantity and Price - Mobile full width row */}
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              gap: 2,
                              width: { xs: '100%', sm: 'auto' }
                            }}>
                              {/* Quantity Controls */}
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton
                                  aria-label={`Decrease quantity of ${item.name}`}
                                  size="small"
                                  onClick={() => updateQuantity(item.id, -1)}
                                  disabled={item.quantity <= 1}
                                  sx={{
                                    border: 1,
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    width: 32,
                                    height: 32,
                                  }}
                                >
                                  <RemoveIcon fontSize="small" />
                                </IconButton>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    minWidth: 32,
                                    textAlign: 'center',
                                    fontWeight: 600,
                                  }}
                                >
                                  {item.quantity}
                                </Typography>
                                <IconButton
                                  aria-label={`Increase quantity of ${item.name}`}
                                  size="small"
                                  onClick={() => updateQuantity(item.id, 1)}
                                  sx={{
                                    border: 1,
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    width: 32,
                                    height: 32,
                                  }}
                                >
                                  <AddIcon fontSize="small" />
                                </IconButton>
                              </Box>

                              {/* Price */}
                              <Typography
                                variant="h6" component="p"
                                sx={{ color: 'primary.main', fontWeight: 700 }}
                              >
                                ${(item.price * item.quantity).toFixed(2)}
                              </Typography>

                              {/* Remove Button - Mobile */}
                              <IconButton
                                aria-label={`Remove ${item.name} from cart`}
                                size="small"
                                onClick={() => removeItem(item.id)}
                                sx={{
                                  display: { xs: 'flex', sm: 'none' },
                                  color: 'text.secondary',
                                  '&:hover': { color: 'error.main' },
                                }}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Delivery Info */}
            {cartItems.length > 0 && (
              <Card
                elevation={0}
                sx={{
                  mt: 3,
                  bgcolor: c.blue50,
                  border: 1,
                  borderColor: c.blue200,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
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
                      <LocalShippingIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                        Fast Delivery to Your Room
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Items will be delivered to your room within 30 minutes of order confirmation. Our staff will notify you upon arrival.
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Order Summary - Right Column */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card elevation={1}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <ReceiptIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                    Order Summary
                  </Typography>
                </Box>

                {/* Pricing Breakdown — mirrors what will actually be charged. There is
                    no tax or delivery fee in the booking total, so none is shown. */}
                <Box sx={{ mb: 3 }}>
                  {draft && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {draft.unitName} · {stayNights} night{stayNights === 1 ? '' : 's'}
                      </Typography>
                      <Typography variant="body2" className="tnum" sx={{ fontWeight: 600 }}>
                        ${stayTotal.toFixed(2)}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {draft ? 'Extras from the shop' : 'Items'}
                    </Typography>
                    <Typography variant="body2" className="tnum" sx={{ fontWeight: 600 }}>
                      ${subtotal.toFixed(2)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Delivery</Typography>
                    <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 700 }}>
                      Free
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>Total</Typography>
                    <Typography variant="h5" component="p" className="tnum" sx={{ color: 'primary.main', fontWeight: 700 }}>
                      ${(stayTotal + subtotal).toFixed(2)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {draft ? 'Stay and extras, paid together' : 'No delivery charge'}
                  </Typography>
                </Box>

                {orderError && (
                  <Alert severity="error" sx={{ mb: 2 }}>{orderError}</Alert>
                )}

                {/* Action Buttons */}
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={draft ? () => navigate('/payment-method') : handlePlaceOrder}
                  disabled={placing || (!draft && cartItems.length === 0)}
                  startIcon={placing ? <CircularProgress size={18} color="inherit" /> : <LockIcon />}
                  sx={{
                    mb: 1.5,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {placing ? 'Placing order…'
                    : draft ? `Continue to payment · $${(stayTotal + subtotal).toFixed(2)}`
                    : 'Place order'}
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/shop')}
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Continue shopping
                </Button>

                {/* Secure Payment Badge */}
                <Card
                  elevation={0}
                  sx={{
                    mt: 3,
                    bgcolor: c.green50,
                    border: 1,
                    borderColor: c.green200,
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <ShieldIcon sx={{ color: 'success.main', fontSize: 20 }} />
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 700, color: 'success.dark', mb: 0.5 }}
                        >
                          Secure Payment
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          All transactions are blockchain-verified and encrypted
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}