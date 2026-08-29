import { useState } from 'react';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatIcon from '@mui/icons-material/Chat';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import SubjectIcon from '@mui/icons-material/Subject';
import MessageIcon from '@mui/icons-material/Message';
import SendIcon from '@mui/icons-material/Send';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

export default function ContactSupport() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Enter your name so we know who to reply to';
    if (!email.trim()) next.email = 'Enter an email address';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) next.email = 'That does not look like a valid email address';
    if (!subject.trim()) next.subject = 'Add a short subject';
    if (!message.trim()) next.message = 'Tell us what you need help with';
    else if (message.trim().length < 10) next.message = 'A little more detail helps us answer faster';
    return next;
  };

  // The button stays enabled: a greyed-out button never explains what is missing.
  // Validating on submit lets every problem be named at once.
  const handleSubmit = () => {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      const first = ['name', 'email', 'subject', 'message'].find(k => found[k]);
      document.querySelector<HTMLElement>(`[data-field="${first}"] input, [data-field="${first}"] textarea`)?.focus();
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <Layout>
        <Box sx={{ maxWidth: 560, mx: 'auto', textAlign: 'center', py: { xs: 6, md: 10 } }}>
          <CheckCircleIcon sx={{ fontSize: 56, color: 'success.main', mb: 2 }} />
          <Typography variant="h1" gutterBottom>Message sent</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mx: 'auto', mb: 1 }}>
            Thanks {name.trim().split(' ')[0]} — our team replies within 2 hours.
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mx: 'auto', mb: 4 }}>
            We will reply to {email.trim()}.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" onClick={() => navigate('/book-stay')}>Back to stays</Button>
            <Button
              variant="outlined"
              onClick={() => {
                setSent(false); setErrors({});
                setName(''); setEmail(''); setPhone(''); setSubject(''); setMessage('');
              }}
            >
              Send another message
            </Button>
          </Box>
        </Box>
      </Layout>
    );
  }

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
           aria-label="Go back">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h1" gutterBottom>
              Contact Support
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Our team is here to help with any questions or concerns about your booking.
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Contact Form */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card elevation={1}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <ChatIcon color="primary" />
                  <Typography variant="h6" component="h2">Send Us a Message</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Fill out the form below and we'll get back to you within 24 hours
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <Typography variant="body2" fontWeight={500} gutterBottom>
                      Your Name <Typography component="span" color="error">*</Typography>
                    </Typography>
                    <TextField
                      fullWidth
                      required
                      placeholder="Enter your full name"
                      data-field="name"
                      error={Boolean(errors.name)}
                      helperText={errors.name ?? ' '}
                      inputProps={{ 'aria-label': 'Your name' }}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" fontWeight={500} gutterBottom>
                      Email Address <Typography component="span" color="error">*</Typography>
                    </Typography>
                    <TextField
                      fullWidth
                      required
                      type="email"
                      placeholder="your.email@example.com"
                      data-field="email"
                      error={Boolean(errors.email)}
                      helperText={errors.email ?? ' '}
                      inputProps={{ 'aria-label': 'Email address' }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" fontWeight={500} gutterBottom>
                      Phone Number <Typography component="span" color="text.secondary">(Optional)</Typography>
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="+62 812 3456 7890"
                      inputProps={{ 'aria-label': 'Phone number (optional)' }}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <PhoneIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" fontWeight={500} gutterBottom>
                      Subject <Typography component="span" color="error">*</Typography>
                    </Typography>
                    <TextField
                      fullWidth
                      required
                      placeholder="What can we help you with?"
                      data-field="subject"
                      error={Boolean(errors.subject)}
                      helperText={errors.subject ?? ' '}
                      inputProps={{ 'aria-label': 'Subject' }}
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <SubjectIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" fontWeight={500} gutterBottom>
                      Message <Typography component="span" color="error">*</Typography>
                    </Typography>
                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={6}
                      placeholder="Please provide details about your inquiry..."
                      data-field="message"
                      error={Boolean(errors.message)}
                      helperText={errors.message ?? ' '}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      inputProps={{ maxLength: 1000, 'aria-label': 'Message' }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                            <MessageIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {message.length}/1000 characters
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  fullWidth
                  onClick={handleSubmit}
                  sx={{ mt: 3 }}
                >
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Information Sidebar */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card elevation={1}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <SupportAgentIcon color="primary" />
                  <Typography variant="h6" component="h2">Contact Information</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                      <EmailIcon fontSize="small" color="primary" sx={{ mt: 0.5 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                          Email Support
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="primary" 
                          sx={{ 
                            cursor: 'pointer', 
                            textDecoration: 'underline',
                            '&:hover': { opacity: 0.8 }
                          }}
                          component="a"
                          href="mailto:support@bitstaybooking.com"
                        >
                          support@bitstaybooking.com
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Response within 24 hours
                        </Typography>
                      </Box>
                    </Box>

                    <Divider />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                      <PhoneIcon fontSize="small" color="primary" sx={{ mt: 0.5 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                          Phone Support
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="primary"
                          sx={{ 
                            cursor: 'pointer', 
                            textDecoration: 'underline',
                            '&:hover': { opacity: 0.8 }
                          }}
                          component="a"
                          href="tel:+622112345678"
                        >
                          +62 21 1234 5678
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Mon-Fri, 9AM-6PM WIB
                        </Typography>
                      </Box>
                    </Box>

                    <Divider />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                      <AccessTimeIcon fontSize="small" color="primary" sx={{ mt: 0.5 }} />
                      <Box>
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                          Business Hours
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Monday - Friday: 9:00 AM - 6:00 PM
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Saturday: 10:00 AM - 4:00 PM
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Sunday: Closed
                        </Typography>
                      </Box>
                    </Box>

                    <Divider />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <LocationOnIcon fontSize="small" color="primary" sx={{ mt: 0.5 }} />
                      <Box>
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                          Office Location
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          BitStay Headquarters
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Jl. Sudirman No. 123
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Jakarta Selatan, 12190
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card elevation={1} sx={{ mt: 3, bgcolor: 'primary.main', color: 'white' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" component="h2" gutterBottom sx={{ color: 'white' }}>
                  Need Immediate Help?
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
                  For urgent booking issues or emergencies, please call our 24/7 hotline
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<PhoneIcon />}
                  component="a"
                  href="tel:+622112345678"
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                    }
                  }}
                >
                  Call Emergency Hotline
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}