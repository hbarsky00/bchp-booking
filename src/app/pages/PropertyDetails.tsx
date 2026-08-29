import { useEffect } from 'react';
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

export default function PropertyDetails() {
  const navigate = useNavigate();
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
        {/* Header with Back Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              border: 1,
              borderColor: 'divider',
              '&:hover': {
                bgcolor: 'action.hover',
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h1" gutterBottom>
              {unit.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Review property details and amenities
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Property Details */}
          <Grid size={{ xs: 12, lg: 8 }}>
            {/* Main Image */}
            <Card elevation={2} sx={{ mb: 3 }}>
              <CardMedia
                component="img"
                height="400"
                image={unit.image}
                alt={unit.name}
                sx={{ objectFit: 'cover' }}
              />
            </Card>

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
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      {unit.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <StarIcon sx={{ fontSize: 20, color: 'warning.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {unit.rating}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {unit.description}
                </Typography>

                <Divider sx={{ my: 3 }} />

                {/* Room Details */}
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
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
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
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
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Booking Summary
                </Typography>

                {/* Price */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Price per night
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
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
                    bgcolor: '#F0FDF4',
                    border: 1,
                    borderColor: '#BBF7D0',
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