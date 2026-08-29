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
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Bottled Water',
      description: '500ml spring water',
      price: 2.50,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
    },
    {
      id: 2,
      name: 'Premium Coffee',
      description: 'Organic blend, 250g',
      price: 12.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
    },
    {
      id: 5,
      name: 'Chocolate Bar',
      description: 'Dark chocolate 70%',
      price: 4.99,
      quantity: 3,
      image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400',
    },
  ]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.085;
  const deliveryFee = 0;
  const total = subtotal + tax + deliveryFee;

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
          >
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
                {cartItems.length === 0 ? (
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

                {/* Pricing Breakdown */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Subtotal
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${subtotal.toFixed(2)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Tax (8.5%)
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${tax.toFixed(2)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Delivery Fee
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'success.main', fontWeight: 700 }}
                    >
                      Free
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Total */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                      Total
                    </Typography>
                    <Typography
                      variant="h5" component="p"
                      sx={{ color: 'primary.main', fontWeight: 700 }}
                    >
                      ${total.toFixed(2)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Including all taxes and fees
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={cartItems.length === 0}
                  onClick={() => navigate('/payment-method')}
                  startIcon={<LockIcon />}
                  sx={{
                    mb: 1.5,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  Checkout
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