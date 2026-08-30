import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import Layout from '../components/Layout';
import Photo from '../components/Photo';
import { c, r } from '../tokens';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import { useUnits } from '../lib/bookings';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VerifiedIcon from '@mui/icons-material/Verified';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';



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

  // Availability comes from the database for the requested range, so a unit already
  // booked over those nights shows as taken instead of being bookable twice.
  const { units: availableUnits, loading: unitsLoading, error: unitsError } =
    useUnits(searchParams.checkIn, searchParams.checkOut, searchParams.guests);


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
    const query = new URLSearchParams({ unit: String(unit.id) });
    if (searchParams.checkIn) query.set('checkIn', searchParams.checkIn);
    if (searchParams.checkOut) query.set('checkOut', searchParams.checkOut);
    if (searchParams.guests) query.set('guests', String(searchParams.guests));
    // State makes the hop instant; the query string makes the page shareable.
    navigate(`/property-details?${query}`, { state: { unit, searchParams } });
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
                    onClick={() =>
                      navigate('/search-results', {
                        replace: true,
                        state: { searchParams: { checkIn, checkOut, guests } },
                      })
                    }
                  >
                    Update Search
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* Sort Bar */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
            {unitsLoading ? 'Checking availability…'
              : `${availableUnits.filter(u => u.available).length} of ${availableUnits.length} available`}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
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

        {unitsError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {unitsError} — could not load availability.
          </Alert>
        )}

        {unitsLoading && (
          <Grid container spacing={{ xs: 3, md: 4 }} rowSpacing={{ xs: 4, md: 5 }}>
            {Array.from({ length: 8 }, (_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Skeleton variant="rectangular" sx={{ aspectRatio: '20 / 19', borderRadius: `${r.md}px`, mb: 1.5 }} />
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="45%" />
              </Grid>
            ))}
          </Grid>
        )}

        {!unitsLoading && availableUnits.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" component="h2" gutterBottom>No rooms match those dates</Typography>
            <Typography variant="body2" sx={{ color: c.stone600, mx: 'auto', mb: 3 }}>
              Try different dates, or fewer guests.
            </Typography>
            <Button variant="outlined" onClick={() => navigate('/book-stay', { state: null })}>
              Change search
            </Button>
          </Box>
        )}

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
                <Box className="listing-photo" sx={{ position: 'relative', mb: 1.5 }}>
                  <Photo
                    src={unit.image}
                    alt={unit.name}
                    ratio="20 / 19"
                    imgSx={{ filter: unit.available ? 'none' : 'grayscale(1) brightness(.94)' }}
                  />

                  {!unit.available && (
                    <Box sx={{
                      position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
                      bgcolor: 'rgba(28,25,23,0.35)',
                    }}>
                      {/* Solid pill rather than text on a scrim: over a bright photo the
                          translucent version measured 2.9:1. */}
                      <Typography sx={{
                        bgcolor: c.stone900, color: c.white, fontWeight: 700,
                        letterSpacing: '0.06em', fontSize: 12,
                        px: 1.75, py: 0.75, borderRadius: `${r.pill}px`,
                      }}>
                        BOOKED
                      </Typography>
                    </Box>
                  )}

                  {unit.available && (
                    <Box sx={{
                      position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 0.5,
                      bgcolor: c.white, borderRadius: 999, px: 1.25, py: 0.5,
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
                      position: 'absolute', top: 6, right: 6, color: c.white,
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
                  {unit.floor} · {unit.amenities.join(' · ')}
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