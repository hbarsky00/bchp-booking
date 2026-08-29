import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import Layout from '../components/Layout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import WifiIcon from '@mui/icons-material/Wifi';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import KitchenIcon from '@mui/icons-material/Kitchen';
import StarIcon from '@mui/icons-material/Star';
import WorkIcon from '@mui/icons-material/Work';
import WeekendIcon from '@mui/icons-material/Weekend';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import BathtubIcon from '@mui/icons-material/Bathtub';
import HomeIcon from '@mui/icons-material/Home';
import DeckIcon from '@mui/icons-material/Deck';
import HotelIcon from '@mui/icons-material/Hotel';

const availableUnits = [
  {
    id: 1,
    name: 'Satoshi Room',
    description: 'Named after the Bitcoin creator. Modern room with premium amenities.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    floor: '2nd Floor',
    beds: 2,
    maxGuests: 4,
    amenities: [
      { icon: 'wifi', label: 'Wifi' },
      { icon: 'ac', label: 'AC' },
      { icon: 'kitchen', label: 'Kitchen' },
    ],
    rating: 4.9,
    price: 45,
    available: true,
  },
  {
    id: 2,
    name: 'Nakamoto Room',
    description: 'Elegant space inspired by blockchain innovation.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    floor: '2nd Floor',
    beds: 1,
    maxGuests: 2,
    amenities: [
      { icon: 'wifi', label: 'Wifi' },
      { icon: 'work', label: 'Work' },
      { icon: 'lounge', label: 'Lounge' },
    ],
    rating: 4.8,
    price: 52,
    available: true,
  },
  {
    id: 3,
    name: 'Tominaga Room',
    description: 'Spacious room with modern design and comfort.',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    floor: '3rd Floor',
    beds: 2,
    maxGuests: 4,
    amenities: [
      { icon: 'wifi', label: 'Wifi' },
      { icon: 'bar', label: 'Bar' },
      { icon: 'bath', label: 'Bath' },
    ],
    rating: 5.0,
    price: 65,
    available: true,
  },
  {
    id: 4,
    name: 'DRCSW Room',
    description: 'Comfortable accommodation with full amenities.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    floor: '2nd Floor',
    beds: 2,
    maxGuests: 4,
    amenities: [
      { icon: 'wifi', label: 'Wifi' },
      { icon: 'beds', label: '2 Beds' },
      { icon: 'kitchen', label: 'Kitchen' },
    ],
    rating: 4.7,
    price: 58,
    available: true,
  },
  {
    id: 5,
    name: 'TimeCoin Room',
    description: 'Cozy room perfect for solo travelers or couples.',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
    floor: '3rd Floor',
    beds: 1,
    maxGuests: 2,
    amenities: [
      { icon: 'wifi', label: 'Wifi' },
      { icon: 'desk', label: 'Desk' },
      { icon: 'coffee', label: 'Coffee' },
    ],
    rating: 4.6,
    price: 42,
    available: true,
  },
  {
    id: 6,
    name: 'Peer to Peer Room',
    description: 'Premium room with exceptional comfort and style.',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800',
    floor: '2nd Floor',
    beds: 2,
    maxGuests: 4,
    amenities: [
      { icon: 'wifi', label: 'Wifi' },
      { icon: 'office', label: 'Office' },
    ],
    rating: 4.9,
    price: 68,
    available: false,
  },
];

export default function SearchResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sortBy, setSortBy] = useState('recommended');
  const [filterOpen, setFilterOpen] = useState(false); // Collapsed by default on mobile
  
  // Get search params from navigation state and set as initial values
  const searchParams = (location.state as any) || {
    checkIn: '',
    checkOut: '',
    guests: '',
    beds: '',
  };
  
  const [checkIn, setCheckIn] = useState(searchParams.checkIn || '');
  const [checkOut, setCheckOut] = useState(searchParams.checkOut || '');
  const [guests, setGuests] = useState(searchParams.guests || '');
  const [beds, setBeds] = useState(searchParams.beds || '');

  // Update state when location.state changes
  useEffect(() => {
    if (location.state) {
      const state = location.state as any;
      if (state.checkIn) setCheckIn(state.checkIn);
      if (state.checkOut) setCheckOut(state.checkOut);
      if (state.guests) setGuests(state.guests);
      if (state.beds) setBeds(state.beds);
    }
  }, [location.state]);

  const handleSelectUnit = (unit: typeof availableUnits[0]) => {
    navigate('/property-details', { 
      state: { 
        unit,
        searchParams 
      } 
    });
  };

  const getAmenityIcon = (iconType: string) => {
    switch (iconType) {
      case 'wifi': return <WifiIcon fontSize="small" />;
      case 'ac': return <AcUnitIcon fontSize="small" />;
      case 'kitchen': return <KitchenIcon fontSize="small" />;
      case 'work': return <WorkIcon fontSize="small" />;
      case 'lounge': return <WeekendIcon fontSize="small" />;
      case 'bar': return <DeckIcon fontSize="small" />;
      case 'bath': return <BathtubIcon fontSize="small" />;
      case 'beds': return <HotelIcon fontSize="small" />;
      case 'desk': return <WorkIcon fontSize="small" />;
      case 'coffee': return <LocalCafeIcon fontSize="small" />;
      case 'office': return <HomeIcon fontSize="small" />;
      default: return <WifiIcon fontSize="small" />;
    }
  };

  return (
    <Layout>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h1" gutterBottom>
            Available Units
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Showing results for your selected dates
          </Typography>
        </Box>

        {/* Search Bar - Hidden on mobile, sticky on desktop/tablet */}
        <Box 
          sx={{ 
            display: { xs: 'none', md: 'block' },
            position: 'sticky', 
            top: 0, 
            zIndex: 100,
            bgcolor: 'background.default',
            pb: 2,
            pt: 1,
            mb: 2
          }}
        >
          <Card elevation={1} sx={{ borderRadius: 0 }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    Check-in Date
                  </Typography>
                  <TextField
                    fullWidth
                    type="date"
                    size="small"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    Check-out Date
                  </Typography>
                  <TextField
                    fullWidth
                    type="date"
                    size="small"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    Guests
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">Select guests</MenuItem>
                      <MenuItem value="1">1 guest</MenuItem>
                      <MenuItem value="2">2 guests</MenuItem>
                      <MenuItem value="3">3 guests</MenuItem>
                      <MenuItem value="4">4 guests</MenuItem>
                      <MenuItem value="5">5+ guests</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    &nbsp;
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ textTransform: 'none' }}
                  >
                    Update Search
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* Sort Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {availableUnits.filter(u => u.available).length} properties available
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Sort by:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="recommended">Recommended</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="rating">Highest Rated</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Property Grid - 3 per row */}
        <Grid container spacing={3}>
          {availableUnits.map((unit) => (
            <Grid key={unit.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card 
                elevation={2}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  cursor: unit.available ? 'pointer' : 'not-allowed',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '& .unit-image': {
                    filter: unit.available ? 'none' : 'grayscale(1) brightness(0.92)',
                  },
                  '&:hover': {
                    transform: unit.available ? 'translateY(-4px)' : 'none',
                    boxShadow: unit.available ? 6 : 2,
                  },
                  '@media (prefers-reduced-motion: reduce)': {
                    transition: 'none',
                    '&:hover': { transform: 'none' },
                  },
                }}
                onClick={() => unit.available && handleSelectUnit(unit)}
              >
                {/* Property Image */}
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    className="unit-image"
                    component="img"
                    height="200"
                    image={unit.image}
                    alt={unit.name}
                  />
                  {/* Floor Badge */}
                  <Chip
                    icon={<HomeIcon fontSize="small" />}
                    label={unit.floor}
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: 12, 
                      left: 12,
                      bgcolor: 'rgba(255, 255, 255, 0.95)',
                      fontWeight: 600,
                    }}
                  />
                  {/* Available Badge */}
                  {unit.available ? (
                    <Chip
                      label="Available"
                      size="small"
                      color="success"
                      sx={{ 
                        position: 'absolute', 
                        top: 12, 
                        right: 12,
                        fontWeight: 600,
                      }}
                    />
                  ) : (
                    <Chip
                      label="BOOKED"
                      size="small"
                      sx={{ 
                        position: 'absolute', 
                        top: 12, 
                        right: 12,
                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                        color: 'white',
                        fontWeight: 700,
                      }}
                    />
                  )}
                </Box>

                <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Property Name & Rating */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                      {unit.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {unit.rating}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Description */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {unit.description}
                  </Typography>

                  {/* Amenities */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    {unit.amenities.map((amenity, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {getAmenityIcon(amenity.icon)}
                        <Typography variant="caption">{amenity.label}</Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Price & Button */}
                  <Box sx={{ mt: 'auto' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {unit.available ? 'From' : ''}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                          <Typography variant="h5" component="p" sx={{ fontWeight: 700 }}>
                            ${unit.price}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            / night
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Button
                      variant={unit.available ? 'contained' : 'outlined'}
                      fullWidth
                      disabled={!unit.available}
                      onClick={() => handleSelectUnit(unit)}
                      sx={{ 
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      {unit.available ? 'View Details' : 'Unavailable'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Layout>
  );
}