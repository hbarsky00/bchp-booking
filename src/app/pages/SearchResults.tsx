import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import Layout from '../components/Layout';
import { c } from '../tokens';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VerifiedIcon from '@mui/icons-material/Verified';
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
    verified: true,
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
    verified: true,
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
    verified: true,
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
    verified: true,
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
    verified: true,
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
    verified: true,
  },
];

export default function SearchResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sortBy, setSortBy] = useState('recommended');
  const [saved, setSaved] = useState<number[]>([]);
  const toggleSaved = (id: number) =>
    setSaved(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
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

        {/* Listing grid — image-led, chromeless, the card is the photo */}
        <Grid container spacing={{ xs: 3, md: 4 }} rowSpacing={{ xs: 4, md: 5 }}>
          {availableUnits.map((unit) => (
            <Grid key={unit.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Box
                role="button"
                tabIndex={unit.available ? 0 : -1}
                aria-label={`${unit.name}, $${unit.price} per night`}
                onClick={() => unit.available && handleSelectUnit(unit)}
                onKeyDown={(e) => {
                  if (unit.available && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    handleSelectUnit(unit);
                  }
                }}
                sx={{
                  cursor: unit.available ? 'pointer' : 'not-allowed',
                  '&:hover .listing-photo img': { transform: unit.available ? 'scale(1.045)' : 'none' },
                  '@media (prefers-reduced-motion: reduce)': {
                    '&:hover .listing-photo img': { transform: 'none' },
                  },
                }}
              >
                <Box
                  className="listing-photo"
                  sx={{
                    position: 'relative', borderRadius: 4, overflow: 'hidden',
                    aspectRatio: '20 / 19', bgcolor: c.stone100, mb: 1.5,
                  }}
                >
                  <Box
                    component="img"
                    src={unit.image}
                    alt={unit.name}
                    loading="lazy"
                    sx={{
                      width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                      transition: 'transform .45s cubic-bezier(.22,1,.36,1)',
                      filter: unit.available ? 'none' : 'grayscale(1) brightness(.94)',
                    }}
                  />

                  {!unit.available && (
                    <Box sx={{
                      position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
                      bgcolor: 'rgba(28,25,23,0.45)',
                    }}>
                      <Typography sx={{ color: '#fff', fontWeight: 700, letterSpacing: '0.06em', fontSize: 13 }}>
                        BOOKED
                      </Typography>
                    </Box>
                  )}

                  {unit.verified && unit.available && (
                    <Box sx={{
                      position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 0.5,
                      bgcolor: '#fff', borderRadius: 999, px: 1.25, py: 0.5,
                      boxShadow: '0 2px 8px rgba(28,25,23,.16)',
                    }}>
                      <VerifiedIcon sx={{ fontSize: 14, color: c.green700 }} />
                      <Typography component="span" sx={{ fontSize: 12, fontWeight: 700, color: c.stone900 }}>
                        On-chain verified
                      </Typography>
                    </Box>
                  )}

                  <IconButton
                    aria-label={saved.includes(unit.id) ? `Remove ${unit.name} from saved` : `Save ${unit.name}`}
                    onClick={(e) => { e.stopPropagation(); toggleSaved(unit.id); }}
                    sx={{
                      position: 'absolute', top: 6, right: 6, color: '#fff',
                      '&:hover': { bgcolor: 'rgba(255,255,255,.15)' },
                    }}
                  >
                    {saved.includes(unit.id)
                      ? <FavoriteIcon sx={{ fontSize: 22, color: c.coral500 }} />
                      : <FavoriteBorderIcon sx={{ fontSize: 22, filter: 'drop-shadow(0 1px 3px rgba(0,0,0,.5))' }} />}
                  </IconButton>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'baseline' }}>
                  <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600, color: c.stone900 }}>
                    {unit.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.375, flexShrink: 0 }}>
                    <StarIcon sx={{ fontSize: 14, color: c.stone900 }} />
                    <Typography component="span" className="tnum" sx={{ fontSize: 14, color: c.stone900 }}>
                      {unit.rating}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ color: c.stone600, mb: 0.25 }}>
                  {unit.floor} · {unit.amenities.map(a => a.label).join(' · ')}
                </Typography>

                <Typography className="tnum" sx={{ mt: 0.75, fontSize: 15, color: c.stone900 }}>
                  <Box component="span" sx={{ fontWeight: 700 }}>${unit.price}</Box>
                  <Box component="span" sx={{ color: c.stone600 }}> night</Box>
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Layout>
  );
}