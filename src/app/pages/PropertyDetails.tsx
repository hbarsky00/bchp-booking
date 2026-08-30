import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router';
import Layout from '../components/Layout';
import Photo from '../components/Photo';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VerifiedIcon from '@mui/icons-material/Verified';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import WifiIcon from '@mui/icons-material/Wifi';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import KitchenIcon from '@mui/icons-material/Kitchen';
import WorkIcon from '@mui/icons-material/Work';
import WeekendIcon from '@mui/icons-material/Weekend';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import BathtubIcon from '@mui/icons-material/Bathtub';
import HomeIcon from '@mui/icons-material/Home';
import DeckIcon from '@mui/icons-material/Deck';
import HotelIcon from '@mui/icons-material/Hotel';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { c, r } from '../tokens';
import { useUnits, nightsBetween } from '../lib/bookings';
import { shareOrCopy } from '../lib/actions';

export default function PropertyDetails() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState('');
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const state = (location.state as any) || {};

  /**
   * A listing has to live at a URL. It used to exist only in router state, so a refresh,
   * a bookmark or a shared link all bounced the visitor out to search — which made the
   * Share button pointless even once it worked. The id is now in the query string and the
   * unit is re-fetched when arriving cold.
   */
  const idParam = Number(params.get('unit')) || 0;
  const searchParams = state.searchParams ?? {
    checkIn: params.get('checkIn') ?? '',
    checkOut: params.get('checkOut') ?? '',
    guests: params.get('guests') ?? '',
  };
  const needsFetch = !state.unit && idParam > 0;
  const { units, loading: unitsLoading } = useUnits(
    needsFetch ? searchParams.checkIn : undefined,
    needsFetch ? searchParams.checkOut : undefined,
  );
  const unit = state.unit ?? (needsFetch ? units.find(u => u.id === idParam) : undefined);

  // Keep the address bar in step with the listing being shown, so whatever the visitor
  // copies — from Share or from the browser — resolves for the next person.
  useEffect(() => {
    if (state.unit && Number(params.get('unit')) !== state.unit.id) {
      const next = new URLSearchParams(params);
      next.set('unit', String(state.unit.id));
      if (searchParams?.checkIn) next.set('checkIn', searchParams.checkIn);
      if (searchParams?.checkOut) next.set('checkOut', searchParams.checkOut);
      if (searchParams?.guests) next.set('guests', String(searchParams.guests));
      setParams(next, { replace: true, state });
    }
  }, [state, params, setParams, searchParams]);

  // Only give up once there is genuinely nothing to show — never while the fetch is open.
  useEffect(() => {
    if (!state.unit && !idParam) navigate('/search-results', { replace: true });
  }, [state.unit, idParam, navigate]);

  // Dates live here now, seeded from whatever the search carried in.
  const today = new Date().toISOString().slice(0, 10);
  const [checkIn, setCheckIn] = useState<string>(searchParams?.checkIn ?? '');
  const [checkOut, setCheckOut] = useState<string>(searchParams?.checkOut ?? '');
  const [guests, setGuests] = useState<string>(String(searchParams?.guests || 1));
  const nights = nightsBetween(checkIn, checkOut);
  const dateError =
    checkIn && checkOut && nights <= 0 ? 'Check-out must be after check-in'
    : checkIn && checkOut && nights < 3 ? 'This stay has a three-night minimum'
    : '';

  const handleShare = async () => {
    const result = await shareOrCopy({
      title: `${unit.name} on BitStay`,
      text: `${unit.name} — ${unit.floor}, $${unit.price} / night on BitStay`,
    });
    setToast(result === 'copied' ? 'Link copied to clipboard'
      : result === 'failed' ? 'Could not share on this device'
      : result === 'shared' ? 'Listing shared'
      : '');
  };

  if (!unit) {
    return (
      <Layout>
        <Box sx={{ py: 10, textAlign: 'center', color: c.stone600 }}>
          <Typography variant="body1">
            {unitsLoading ? 'Loading this stay…' : 'That stay is no longer listed.'}
          </Typography>
          {!unitsLoading && (
            <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/search-results')}>
              Browse stays
            </Button>
          )}
        </Box>
      </Layout>
    );
  }

  // The mock unit carries a single photo; pad the mosaic with interior shots so the
  // layout is exercised. Real listings would ship their own gallery array.
  // Dedupe: a unit's own photo may also appear in the filler set, and a repeated
  // src as a React key makes React drop siblings.
  const gallery: string[] = [...new Set([
    unit.image,
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
  ])].slice(0, 5);

  /**
   * Amenities arrive from the database as plain labels ('Wifi', 'AC', '2 Beds'), so match
   * on the label itself. The previous version switched on an `iconType` key that no caller
   * ever supplied, which is why every amenity rendered the same generic tick.
   */
  const getAmenityIcon = (amenity: string) => {
    const key = amenity.toLowerCase();
    if (key.includes('wifi')) return <WifiIcon fontSize="small" />;
    if (key.includes('ac') && !key.includes('back')) return <AcUnitIcon fontSize="small" />;
    if (key.includes('kitchen')) return <KitchenIcon fontSize="small" />;
    if (key.includes('bed')) return <HotelIcon fontSize="small" />;
    if (key.includes('bath')) return <BathtubIcon fontSize="small" />;
    if (key.includes('lounge')) return <WeekendIcon fontSize="small" />;
    if (key.includes('bar')) return <DeckIcon fontSize="small" />;
    if (key.includes('coffee')) return <LocalCafeIcon fontSize="small" />;
    if (key.includes('office')) return <HomeIcon fontSize="small" />;
    if (key.includes('desk') || key.includes('work')) return <WorkIcon fontSize="small" />;
    return <CheckCircleIcon fontSize="small" />;
  };

  const handleBookNow = () => {
    if (dateError || !checkIn || !checkOut) return;
    navigate('/guest-details', {
      state: { unit, searchParams: { checkIn, checkOut, guests } },
    });
  };

  return (
    <Layout>
      <Box>
        {/* Title block — name first, credentials underneath, actions right */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 240 }}>
            <Typography variant="h1" sx={{ mb: 1 }}>{unit.name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', color: c.stone600, fontSize: 14 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: .375, color: c.stone900 }}>
                <StarIcon sx={{ fontSize: 15 }} />
                <Box component="span" className="tnum" sx={{ fontWeight: 700 }}>{unit.rating}</Box>
              </Box>
              <Box component="span">·</Box>
              <Box component="span" sx={{ textDecoration: 'underline', fontWeight: 600, color: c.stone900 }}>{unit.floor}</Box>
              <Box component="span">·</Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: .5, color: c.green700, fontWeight: 700 }}>
                <VerifiedIcon sx={{ fontSize: 15 }} />
                On-chain verified
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: .5 }}>
            <Button startIcon={<ShareIcon />} onClick={handleShare}
              sx={{ color: c.stone900, textDecoration: 'underline', px: 1.25 }}>
              Share
            </Button>
            <Button
              startIcon={saved ? <FavoriteIcon sx={{ color: c.coral500 }} /> : <FavoriteBorderIcon />}
              onClick={() => setSaved(v => !v)}
              aria-pressed={saved}
              sx={{ color: c.stone900, textDecoration: 'underline', px: 1.25 }}
            >
              {saved ? 'Saved' : 'Save'}
            </Button>
          </Box>
        </Box>

        {/* Gallery mosaic — one hero frame plus a supporting grid */}
        <Box
          sx={{
            display: 'grid', gap: 1, mb: { xs: 4, md: 6 },
            borderRadius: `${r.md}px`, overflow: 'hidden',
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' },
            gridTemplateRows: { xs: 'auto', md: '190px 190px' },
            aspectRatio: { xs: '4 / 3', md: 'auto' },
          }}
        >
          {gallery.map((src, i) => (
            <Photo
              key={`${i}-${src}`}
              src={src}
              alt={i === 0 ? unit.name : `${unit.name}, view ${i + 1}`}
              eager={i === 0}
              radius={0}
              sx={{
                display: { xs: i === 0 ? 'block' : 'none', md: 'block' },
                gridRow: { md: i === 0 ? 'span 2' : 'auto' },
                height: '100%',
              }}
            />
          ))}
        </Box>

        <Grid container spacing={{ xs: 3, md: 6 }}>
          {/* Property Details */}
          <Grid size={{ xs: 12, lg: 8 }}>
            {/* Property Info */}
            <Card elevation={1} sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Chip 
                        icon={<HomeIcon fontSize="small" />} 
                        label={unit.floor} 
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                      <Chip 
                        label="Available" 
                        size="small" 
                        color="success"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
                      {unit.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <StarIcon sx={{ fontSize: 20, color: 'warning.main' }} />
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                      {unit.rating}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {unit.description}
                </Typography>

                <Divider sx={{ my: 3 }} />

                {/* Room Details */}
                <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
                  Room Details
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HotelIcon sx={{ color: 'primary.main' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Beds
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {unit.beds} {unit.beds === 1 ? 'Bed' : 'Beds'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PeopleIcon sx={{ color: 'primary.main' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Max Guests
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {unit.maxGuests} Guests
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HomeIcon sx={{ color: 'primary.main' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Floor
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {unit.floor}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Amenities */}
                <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
                  Amenities
                </Typography>
                <Grid container spacing={2}>
                  {(unit.amenities as string[]).map((amenity) => (
                    <Grid key={amenity} size={{ xs: 6, sm: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, color: c.stone900 }}>
                        <Box sx={{ display: 'flex', color: c.stone600 }}>{getAmenityIcon(amenity)}</Box>
                        <Typography variant="body2">{amenity}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Booking Summary Sidebar */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card elevation={1} sx={{ position: { lg: 'sticky' }, top: { lg: 16 } }}>
              <CardContent>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 3 }}>
                  Booking Summary
                </Typography>

                {/* Price */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Price per night
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                    <Typography variant="h4" component="p" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      ${unit.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      / night
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/*
                  Dates are chosen here, not merely echoed here. Reaching this page without
                  them was possible (Search Results does not insist on them), and nothing
                  downstream asked either — so a guest could fill in their details, browse
                  extras, choose a payment method, and only discover at the final click that
                  the booking had no dates, via a raw "Dates must be YYYY-MM-DD" from the API.
                */}
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                  Your stay
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                  <TextField
                    type="date"
                    label="Check-in"
                    size="small"
                    fullWidth
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: today } }}
                  />
                  <TextField
                    type="date"
                    label="Check-out"
                    size="small"
                    fullWidth
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: checkIn || today } }}
                  />
                </Box>
                <TextField
                  select
                  label="Guests"
                  size="small"
                  fullWidth
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  sx={{ mb: 2 }}
                >
                  {Array.from({ length: unit.maxGuests || 4 }, (_, i) => i + 1).map(n => (
                    <MenuItem key={n} value={String(n)}>{n} guest{n === 1 ? '' : 's'}</MenuItem>
                  ))}
                </TextField>

                {nights > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      ${unit.price} × {nights} night{nights === 1 ? '' : 's'}
                    </Typography>
                    <Typography variant="body2" className="tnum" sx={{ fontWeight: 700 }}>
                      ${(unit.price * nights).toFixed(2)}
                    </Typography>
                  </Box>
                )}

                {dateError && (
                  <Typography variant="caption" sx={{ display: 'block', mb: 1.5, color: c.red600 }}>
                    {dateError}
                  </Typography>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Book Button */}
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleBookNow}
                  disabled={!!dateError || !checkIn || !checkOut}
                  sx={{
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {!checkIn || !checkOut ? 'Choose your dates' : 'Book now'}
                </Button>

                {/* Info */}
                <Card
                  elevation={0}
                  sx={{
                    mt: 3,
                    bgcolor: c.green50,
                    border: 1,
                    borderColor: c.green200,
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: 'success.dark' }}>
                      Minimum Stay: 3 Nights
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      All bookings require a minimum stay of 3 nights
                    </Typography>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={!!toast}
        message={toast}
        autoHideDuration={3000}
        onClose={() => setToast('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Layout>
  );
}