import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import Layout from '../components/Layout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import InfoIcon from '@mui/icons-material/Info';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { c } from '../tokens';

const categories = ['All Items', 'Snacks & Drinks', 'Amenities', 'Toiletries', 'Electronics', 'Souvenirs'];

const products = [
  {
    id: 1,
    name: 'Bottled Water',
    description: '500ml spring water',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
    price: 2.50,
    stock: 32,
    status: 'In Stock',
    category: 'Snacks & Drinks',
  },
  {
    id: 2,
    name: 'Premium Coffee',
    description: 'Organic blend, 250g',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
    price: 12.99,
    stock: 18,
    status: 'In Stock',
    category: 'Snacks & Drinks',
  },
  {
    id: 3,
    name: 'Shampoo & Conditioner',
    description: 'Luxury hair care set',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400',
    price: 18.50,
    stock: 26,
    status: 'In Stock',
    category: 'Toiletries',
  },
  {
    id: 4,
    name: 'Phone Charger',
    description: 'Fast charging cable',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400',
    price: 15.00,
    stock: 13,
    status: 'In Stock',
    category: 'Electronics',
  },
  {
    id: 5,
    name: 'Chocolate Bar',
    description: 'Dark chocolate 70%',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400',
    price: 4.99,
    stock: 47,
    status: 'In Stock',
    category: 'Snacks & Drinks',
  },
  {
    id: 6,
    name: 'Extra Towel Set',
    description: 'Premium cotton towels',
    image: 'https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?w=400',
    price: 22.00,
    stock: 12,
    status: 'In Stock',
    category: 'Amenities',
  },
  {
    id: 7,
    name: 'Energy Drink',
    description: 'Sugar-free, 250ml',
    image: 'https://images.unsplash.com/photo-1622543925917-763c34f1f97a?w=400',
    price: 3.75,
    stock: 28,
    status: 'In Stock',
    category: 'Snacks & Drinks',
  },
  {
    id: 8,
    name: 'Toothbrush Kit',
    description: 'Brush + paste combo',
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400',
    price: 8.50,
    stock: 3,
    status: 'Low Stock',
    category: 'Toiletries',
  },
  {
    id: 9,
    name: 'City Keychain',
    description: 'Local souvenir',
    image: 'https://images.unsplash.com/photo-1601524909162-ae8725290836?w=400',
    price: 6.99,
    stock: 50,
    status: 'In Stock',
    category: 'Souvenirs',
  },
  {
    id: 10,
    name: 'Instant Noodles',
    description: 'Hot & spicy flavor',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
    price: 3.25,
    stock: 56,
    status: 'In Stock',
    category: 'Snacks & Drinks',
  },
  {
    id: 11,
    name: 'Bluetooth Speaker',
    description: 'Portable audio device',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    price: 45.00,
    stock: 8,
    status: 'In Stock',
    category: 'Electronics',
  },
  {
    id: 12,
    name: 'Laundry Detergent',
    description: 'Eco-friendly, 500ml',
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400',
    price: 7.50,
    stock: 0,
    status: 'Out of Stock',
    category: 'Amenities',
  },
];

export default function Shop() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Track quantities for each product
  const [productQuantities, setProductQuantities] = useState<Record<number, number>>({});
  
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Check if we're in booking flow (came from guest-details)
  const isBookingFlow = location.state?.fromBookingFlow || false;

  // Calculate total cart items
  const totalCartItems = Object.values(productQuantities).reduce((sum, qty) => sum + qty, 0);

  // Filter products based on category
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All Items' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: any) => {
    const currentQty = productQuantities[product.id] || 0;
    setProductQuantities({
      ...productQuantities,
      [product.id]: currentQty + 1,
    });
    setSnackbarMessage(`${product.name} added to cart`);
    setSnackbarOpen(true);
  };

  const handleIncreaseQuantity = (productId: number) => {
    const currentQty = productQuantities[productId] || 0;
    setProductQuantities({
      ...productQuantities,
      [productId]: currentQty + 1,
    });
  };

  const handleDecreaseQuantity = (productId: number) => {
    const currentQty = productQuantities[productId] || 0;
    if (currentQty > 0) {
      setProductQuantities({
        ...productQuantities,
        [productId]: currentQty - 1,
      });
    }
  };

  const handleContinueToPayment = () => {
    navigate('/payment-method');
  };

  const handleSkipToPayment = () => {
    navigate('/payment-method');
  };

  return (
    <Layout>
      <Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 4 }}>
          <Box>
            <Typography variant="h1" gutterBottom>
              Shop
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Browse and purchase items during your stay
            </Typography>
          </Box>
          <IconButton
            color="primary"
            onClick={() => navigate('/shopping-cart')}
            sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            <Badge badgeContent={totalCartItems} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Box>

        {/* Search */}
        <Card elevation={1} sx={{ mb: 3 }}>
          <CardContent>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </CardContent>
        </Card>

        {/* Categories */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => setSelectedCategory(category)}
              sx={{
                bgcolor: selectedCategory === category ? c.coral700 : 'white',
                color: selectedCategory === category ? 'white' : c.stone500,
                borderColor: c.gray200,
                border: selectedCategory === category ? 'none' : '1px solid',
                fontWeight: selectedCategory === category ? 600 : 400,
                '&:hover': {
                  bgcolor: selectedCategory === category ? c.coral700 : c.stone50,
                },
              }}
            />
          ))}
        </Box>

        {/* Products Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {filteredProducts.map((product) => {
            const quantity = productQuantities[product.id] || 0;
            return (
              <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  {/* Quantity Badge */}
                  {quantity > 0 && (
                    <Chip
                      label={`${quantity} in cart`}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        bgcolor: c.coral700,
                        color: 'white',
                        fontWeight: 700,
                        zIndex: 1,
                      }}
                    />
                  )}
                  <CardMedia
                    component="img"
                    sx={{
                      height: 200,
                      objectFit: 'cover',
                    }}
                    image={product.image}
                    alt={product.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h5" component="p" color="primary" fontWeight={600}>
                        ${product.price.toFixed(2)}
                      </Typography>
                      <Chip
                        label={product.status}
                        size="small"
                        sx={{
                          bgcolor: product.status === 'In Stock' ? c.green100 : product.status === 'Low Stock' ? c.amber100 : c.red100,
                          color: product.status === 'In Stock' ? c.green700 : product.status === 'Low Stock' ? c.amber800 : c.red800,
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {product.stock} available
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    {quantity > 0 ? (
                      <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleDecreaseQuantity(product.id)}
                          sx={{
                            bgcolor: c.stone100,
                            '&:hover': { bgcolor: c.stone200 },
                          }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{ fontWeight: 600 }}
                        >
                          {quantity} in Cart
                        </Button>
                        <IconButton
                          size="small"
                          onClick={() => handleIncreaseQuantity(product.id)}
                          disabled={product.status === 'Out of Stock'}
                          sx={{
                            bgcolor: c.blue100,
                            '&:hover': { bgcolor: c.blue200 },
                          }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<ShoppingCartIcon />}
                        disabled={product.status === 'Out of Stock'}
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to cart
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Shopping Information */}
        <Card elevation={1} sx={{ bgcolor: c.blue50, mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
              <InfoIcon sx={{ color: c.coral700 }} />
              <Typography variant="h6" component="h2" sx={{ color: c.stone900 }}>Shopping Information</Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <LocalShippingIcon fontSize="small" sx={{ color: c.coral700 }} />
                  <Typography variant="subtitle2" sx={{ color: c.stone900 }}>Instant Delivery</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: c.stone600 }}>
                  Items delivered to your room within 30 minutes of order confirmation. Our staff will notify you upon arrival.
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Box sx={{ fontSize: 20 }}>💳</Box>
                  <Typography variant="subtitle2" sx={{ color: c.stone900 }}>Multiple Payment Options</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: c.stone600 }}>
                  Pay with BSV, stablecoins, or card
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <VerifiedIcon fontSize="small" sx={{ color: c.coral700 }} />
                  <Typography variant="subtitle2" sx={{ color: c.stone900 }}>Secure Checkout</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: c.stone600 }}>
                  Blockchain-verified transactions
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Booking Flow Navigation - Only shown during booking flow */}
        {isBookingFlow && (
          <Card elevation={1} sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ShoppingCartIcon color="primary" />
                <Typography variant="h6" component="h2">Ready to continue?</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                You can add items now or continue to payment and shop during your stay.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/guest-details')}
                >
                  Back to Details
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleSkipToPayment}
                  sx={{ flex: { xs: '1 1 100%', sm: '0 1 auto' } }}
                >
                  Skip Shopping
                </Button>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleContinueToPayment}
                  sx={{ flex: { xs: '1 1 100%', sm: '1 1 auto' } }}
                >
                  Continue to Payment {totalCartItems > 0 && `(${totalCartItems} items)`}
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Snackbar for cart notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          icon={<CheckCircleIcon />}
          sx={{
            width: '100%',
            fontSize: '1rem',
            fontWeight: 600,
            bgcolor: c.green100,
            color: c.green700,
            border: `1px solid ${c.green200}`,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Layout>
  );
}