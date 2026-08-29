import { useState } from 'react';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import ShieldIcon from '@mui/icons-material/Shield';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InputAdornment from '@mui/material/InputAdornment';
import PeopleIcon from '@mui/icons-material/People';
import HotelIcon from '@mui/icons-material/Hotel';
import { c } from '../tokens';

export default function BookStay() {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('');
  const [beds, setBeds] = useState('');

  const handleSearchAvailability = () => {
    // Navigate to search results with search parameters
    navigate('/search-results', {
      state: {
        checkIn: checkIn || '',
        checkOut: checkOut || '',
        guests: guests || '',
        beds: beds || '',
      }
    });
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h1" gutterBottom>
          Book Your Stay
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Select your dates and explore available accommodations in Yogyakarta.
        </Typography>

        <Grid container spacing={3}>
          {/* Date Selection Card */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <Card elevation={1}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CalendarTodayIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Select Dates
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Choose your check-in and check-out dates
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                      Check-in Date
                    </Typography>
                    <TextField
                      fullWidth
                      type="date"
                      placeholder="mm/dd/yyyy"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                      Check-out Date
                    </Typography>
                    <TextField
                      fullWidth
                      type="date"
                      placeholder="mm/dd/yyyy"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                      Number of Guests (Optional)
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="">Select number of guests</MenuItem>
                        <MenuItem value="1">1 guest</MenuItem>
                        <MenuItem value="2">2 guests</MenuItem>
                        <MenuItem value="3">3 guests</MenuItem>
                        <MenuItem value="4">4 guests</MenuItem>
                        <MenuItem value="5">5+ guests</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                      Number of Beds (Optional)
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={beds}
                        onChange={(e) => setBeds(e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="">Select number of beds</MenuItem>
                        <MenuItem value="1">1 bed</MenuItem>
                        <MenuItem value="2">2 beds</MenuItem>
                        <MenuItem value="3">3 beds</MenuItem>
                        <MenuItem value="4">4 beds</MenuItem>
                        <MenuItem value="5">5+ beds</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3, mb: 3 }}>
                  <InfoOutlinedIcon fontSize="small" sx={{ color: 'info.main' }} />
                  <Typography variant="caption" color="text.secondary">
                    Minimum stay: 3 nights
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleSearchAvailability}
                  sx={{
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  Search Availability
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Tips and Security */}
          <Grid size={{ xs: 12, lg: 5 }}>
            {/* Booking Tips */}
            <Card
              elevation={0}
              sx={{
                bgcolor: c.violet100,
                border: 1,
                borderColor: c.violet200,
                mb: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LightbulbOutlinedIcon sx={{ color: c.violet600 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Booking Tips
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Get the best experience
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <CheckCircleIcon fontSize="small" sx={{ color: c.violet600, mt: 0.25 }} />
                    <Typography variant="body2">
                      Book early for better rates and availability
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <CheckCircleIcon fontSize="small" sx={{ color: c.violet600, mt: 0.25 }} />
                    <Typography variant="body2">
                      Flexible dates? Check nearby dates for deals
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <CheckCircleIcon fontSize="small" sx={{ color: c.violet600, mt: 0.25 }} />
                    <Typography variant="body2">
                      Weekend stays may have different pricing
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Secure Booking */}
            <Card
              elevation={0}
              sx={{
                bgcolor: c.green50,
                border: 1,
                borderColor: c.green200,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <ShieldIcon sx={{ color: 'success.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Secure Booking
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                  Blockchain verified
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Your booking is protected with blockchain technology, ensuring transparency and security throughout your stay.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LockIcon fontSize="small" sx={{ color: 'success.main' }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    256-bit encryption
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}