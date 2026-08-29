import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
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
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
import { c, r } from '../tokens';

export default function PropertyDetails() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const location = useLocation();
  const { unit, searchParams } = (location.state as any) || {};

  // Redirect to search results if no unit is provided - MUST be in useEffect
  useEffect(() => {
    if (!unit) {
      navigate('/search-results');
    }
  }, [unit, navigate]);

  if (!unit) {
    return null;
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

  const handleBookNow = () => {
    navigate('/guest-details', {
      state: {
        unit,
        searchParams
      }
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
            <Button startIcon={<ShareIcon />} onClick={() => navigate(-1)}
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
              <CardContent sx={{ p: 3 }}>
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
                  {unit.amenities.map((amenity: any, index: number) => (
                    <Grid key={index} size={{ xs: 6, sm: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                        <Typography variant="body2">
                          {amenity.label}
                        </Typography>
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
              <CardContent sx={{ p: 3 }}>
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

                {/* Your Search */}
                {searchParams && (searchParams.checkIn || searchParams.checkOut) && (
                  <>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                      Your Search
                    </Typography>
                    {searchParams.checkIn && (
                      <Box sx={{ mb: 1.5 }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Check-in
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {new Date(searchParams.checkIn).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </Typography>
                      </Box>
                    )}
                    {searchParams.checkOut && (
                      <Box sx={{ mb: 1.5 }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Check-out
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {new Date(searchParams.checkOut).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </Typography>
                      </Box>
                    )}
                    {searchParams.guests && (
                      <Box sx={{ mb: 1.5 }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Guests
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {searchParams.guests} {searchParams.guests === '1' ? 'Guest' : 'Guests'}
                        </Typography>
                      </Box>
                    )}
                    <Divider sx={{ my: 3 }} />
                  </>
                )}

                {/* Book Button */}
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleBookNow}
                  sx={{
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  Book Now
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
    </Layout>
  );
}