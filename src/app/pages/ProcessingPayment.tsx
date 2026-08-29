import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShieldIcon from '@mui/icons-material/Shield';
import { c } from '../tokens';

export default function ProcessingPayment() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Simulate payment processing
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleViewConfirmation = () => {
    navigate('/booking-confirmed');
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h1" gutterBottom>
            Processing Payment
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please wait while we securely process your transaction
          </Typography>
        </Box>

        {/* Important Information Card */}
        <Card
          elevation={0}
          sx={{
            mb: 4,
            bgcolor: c.amber100,
            border: 1,
            borderColor: c.amber200,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
              <WarningIcon sx={{ color: c.amber500, mt: 0.25 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Important Information
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 4 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <CheckCircleIcon fontSize="small" sx={{ color: c.amber500 }} />
                <Typography variant="body2">
                  Your booking remains in <strong>Reserved</strong> status until payment verification is complete
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <CheckCircleIcon fontSize="small" sx={{ color: c.amber500 }} />
                <Typography variant="body2">
                  On successful payment, your booking status will automatically update to <strong>Paid</strong>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <CheckCircleIcon fontSize="small" sx={{ color: c.amber500 }} />
                <Typography variant="body2">
                  You will receive a confirmation email with your transaction reference ID
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <CheckCircleIcon fontSize="small" sx={{ color: c.amber500 }} />
                <Typography variant="body2">
                  Please do not close this window or navigate away during processing
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Processing/Success State */}
        <Card elevation={1}>
          <CardContent sx={{ p: 6 }}>
            {isProcessing ? (
              // Processing State
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: c.sky100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <CircularProgress size={40} />
                </Box>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
                  Processing Payment...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please wait while we verify your transaction
                </Typography>
              </Box>
            ) : (
              // Success State
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: c.emerald100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main' }} />
                </Box>

                <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
                  Payment Successful!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Your booking has been confirmed and payment processed successfully.
                </Typography>

                {/* Transaction Details */}
                <Card
                  elevation={0}
                  sx={{
                    bgcolor: c.slate100,
                    border: 1,
                    borderColor: c.slate200,
                    mb: 4,
                    maxWidth: 500,
                    mx: 'auto',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    {/* Transaction Status */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon fontSize="small" sx={{ color: 'success.main' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Transaction Status
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'success.main',
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                          Verified
                        </Typography>
                      </Box>
                    </Box>

                    {/* Verification Badge */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ShieldIcon fontSize="small" sx={{ color: 'info.main' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Verification Badge
                        </Typography>
                      </Box>
                      <VerifiedIcon fontSize="small" sx={{ color: 'info.main' }} />
                    </Box>

                    {/* TX Reference ID */}
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mb: 0.5, textAlign: 'center' }}
                      >
                        TX Reference ID
                      </Typography>
                      <Box
                        sx={{
                          bgcolor: 'white',
                          p: 1.5,
                          borderRadius: 1,
                          border: 1,
                          borderColor: c.slate200,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: 'monospace',
                            wordBreak: 'break-all',
                            fontSize: '0.7rem',
                            display: 'block',
                            textAlign: 'center',
                          }}
                        >
                          0x79abc2e8b7c4f6dc5d3e2b6d19fac76c8d02d5ffa8c467b3de5 f9a2c5e88bf4477a
                        </Typography>
                      </Box>
                    </Box>

                    {/* Booking Status */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Booking Status
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'success.main',
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                          Paid
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* View Booking Button */}
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleViewConfirmation}
                  sx={{
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  View Booking Confirmation
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <Box sx={{ mt: 4, py: 3, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
            <ShieldIcon fontSize="small" sx={{ color: 'success.main' }} />
            <Typography variant="caption" color="text.secondary">
              Secure blockchain-verified booking
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            © 2026 BCHP Booking. All rights reserved
          </Typography>
        </Box>
      </Box>
    </Layout>
  );
}