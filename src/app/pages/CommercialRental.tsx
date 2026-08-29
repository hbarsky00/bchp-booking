import Layout from '../components/Layout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function CommercialRental() {
  return (
    <Layout>
      <Box>
        <Typography variant="h1" gutterBottom>
          Commercial Rental
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Rent commercial space for your business needs in Yogyakarta
        </Typography>

        <Grid container spacing={3}>
          {/* Main Space Card */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card elevation={2}>
              {/* Space Image */}
              <CardMedia
                component="img"
                height="400"
                image="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200"
                alt="Bitcoin Snack Bar"
                sx={{ objectFit: 'cover' }}
              />
              
              <CardContent sx={{ p: 4 }}>
                {/* Header with Badge */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <StorefrontIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      Bitcoin Snack Bar
                    </Typography>
                    <Chip 
                      label="Commercial Space" 
                      color="primary" 
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Prime commercial space perfect for food & beverage operations, retail, or community events
                  </Typography>
                </Box>

                {/* Location */}
                <Card 
                  elevation={0} 
                  sx={{ 
                    bgcolor: '#F3F4F6', 
                    mb: 3,
                    border: 1,
                    borderColor: '#E5E7EB'
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <LocationOnIcon sx={{ color: 'primary.main', mt: 0.5 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                          Location
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Jalan Veteran No.77, Pandeyan, Kec. Umbulharjo, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55161, Indonesia
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<OpenInNewIcon />}
                          href="https://maps.app.goo.gl/v1h7vg87bbHp2JJK6"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                          View on Google Maps
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Features */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Space Features
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                        <Typography variant="body2">
                          Full commercial kitchen setup
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                        <Typography variant="body2">
                          High foot traffic location
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                        <Typography variant="body2">
                          Seating area for customers
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                        <Typography variant="body2">
                          Modern amenities & utilities
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                        <Typography variant="body2">
                          WiFi & networking infrastructure
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                        <Typography variant="body2">
                          Crypto payment ready
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Ideal For */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Ideal For
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip icon={<RestaurantIcon />} label="Food & Beverage" />
                    <Chip icon={<LocalCafeIcon />} label="Café / Snack Bar" />
                    <Chip icon={<BusinessIcon />} label="Retail Space" />
                    <Chip icon={<StorefrontIcon />} label="Pop-up Shop" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact & Inquiry Card */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card elevation={1}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Rental Inquiry
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Interested in renting the Bitcoin Snack Bar space? Contact us for availability, pricing, and lease terms.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<EmailIcon />}
                    href="mailto:rental@bchp.com"
                    sx={{ 
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.5
                    }}
                  >
                    Email Us
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    startIcon={<PhoneIcon />}
                    href="tel:+1234567890"
                    sx={{ 
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.5
                    }}
                  >
                    Call Us
                  </Button>
                </Box>

                {/* Info Box */}
                <Card
                  elevation={0}
                  sx={{
                    bgcolor: '#EFF6FF',
                    border: 1,
                    borderColor: '#BFDBFE',
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                      Flexible Lease Terms
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      We offer short-term and long-term rental options. Monthly, quarterly, and annual leases available.
                    </Typography>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card elevation={1} sx={{ mt: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Quick Facts
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Space Type
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Commercial / F&B Ready
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Location
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Yogyakarta, Indonesia
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Availability
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                      Available Now
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}