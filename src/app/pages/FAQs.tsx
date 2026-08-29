import { useState } from 'react';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ChatIcon from '@mui/icons-material/Chat';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import PaymentIcon from '@mui/icons-material/Payment';
import CancelIcon from '@mui/icons-material/Cancel';
import SecurityIcon from '@mui/icons-material/Security';

const faqCategories = [
  {
    id: 'booking',
    name: 'Booking Process',
    icon: <BookOnlineIcon />,
    color: 'primary',
    faqs: [
      {
        question: 'How do I make a booking?',
        answer: 'To make a booking, simply select your check-in and check-out dates on the landing page, choose the number of guests, and click "Search Available Units". Browse through the available properties and click on your preferred unit to continue with the booking process.'
      },
      {
        question: 'Can I modify my booking after confirmation?',
        answer: 'Yes, you can modify your booking through the "My Bookings" section. Click on the booking you want to modify and select "Edit Booking". Please note that modifications are subject to availability and may incur additional charges.'
      },
      {
        question: 'What is a Light Booking?',
        answer: 'Light Booking is our flexible reservation option that allows you to hold a unit with minimal upfront payment. You can complete the payment closer to your check-in date while securing your preferred accommodation.'
      },
      {
        question: 'How far in advance can I book?',
        answer: 'You can book up to 12 months in advance. For longer stays or special arrangements, please contact our support team directly.'
      },
    ]
  },
  {
    id: 'payment',
    name: 'Payment & Pricing',
    icon: <PaymentIcon />,
    color: 'success',
    faqs: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept major credit cards (Visa, MasterCard, American Express), debit cards, bank transfers, and digital wallets. All payments are processed securely through our blockchain-verified payment system.'
      },
      {
        question: 'When will I be charged?',
        answer: 'For standard bookings, payment is required at the time of booking confirmation. For Light Bookings, a deposit is charged immediately, with the balance due before check-in. You\'ll receive a payment schedule via email after booking.'
      },
      {
        question: 'Are there any hidden fees?',
        answer: 'No hidden fees! All charges including room rate, service fee, and cleaning fee are clearly displayed in your booking summary before you complete your reservation. The total price you see is the total price you pay.'
      },
      {
        question: 'Can I get a receipt for my booking?',
        answer: 'Yes, a receipt is automatically sent to your email after payment confirmation. You can also download receipts anytime from the "My Bookings" section.'
      },
    ]
  },
  {
    id: 'cancellation',
    name: 'Cancellation Policy',
    icon: <CancelIcon />,
    color: 'error',
    faqs: [
      {
        question: 'What is your cancellation policy?',
        answer: 'Our standard cancellation policy allows free cancellation up to 48 hours before check-in. Cancellations made within 48 hours of check-in are subject to a one-night charge. Some special rates may have different cancellation terms.'
      },
      {
        question: 'How do I cancel my booking?',
        answer: 'To cancel your booking, go to "My Bookings", select the booking you want to cancel, and click "Cancel Booking". You\'ll receive a confirmation email once the cancellation is processed.'
      },
      {
        question: 'When will I receive my refund?',
        answer: 'Refunds are typically processed within 5-7 business days after cancellation approval. The refund will be credited to the original payment method used for booking.'
      },
      {
        question: 'Can I cancel a non-refundable booking?',
        answer: 'Non-refundable bookings cannot be cancelled for a refund. However, in case of exceptional circumstances, please contact our support team who may be able to assist on a case-by-case basis.'
      },
    ]
  },
  {
    id: 'security',
    name: 'Security & Privacy',
    icon: <SecurityIcon />,
    color: 'warning',
    faqs: [
      {
        question: 'How is my payment information protected?',
        answer: 'All payment transactions are secured using blockchain-verified technology with end-to-end encryption. We never store your complete payment card details on our servers. Your financial information is handled in compliance with PCI DSS standards.'
      },
      {
        question: 'What information do you collect?',
        answer: 'We collect only the necessary information to process your booking: name, email, phone number, and payment details. Your data is protected according to our Privacy Policy and is never shared with third parties without your consent.'
      },
      {
        question: 'Is my personal data safe?',
        answer: 'Yes, we use industry-standard security measures including SSL encryption, secure servers, and regular security audits. All personal data is stored securely and accessed only by authorized personnel for booking management purposes.'
      },
      {
        question: 'What is blockchain verification?',
        answer: 'Blockchain verification provides an immutable record of your booking transaction, ensuring transparency and security. Each booking is recorded on the blockchain, preventing fraud and providing you with a verifiable proof of your reservation.'
      },
    ]
  },
];

export default function FAQs() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Filter FAQs based on search query and selected category
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      (selectedCategory === null || category.id === selectedCategory) &&
      (searchQuery === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(category => category.faqs.length > 0);

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
              Frequently Asked Questions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Find answers to common questions about booking, payments, and policies.
            </Typography>
          </Box>
        </Box>

        {/* Search and Filter */}
        <Card elevation={1} sx={{ mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label="All"
                    onClick={() => setSelectedCategory(null)}
                    color={selectedCategory === null ? 'primary' : 'default'}
                    variant={selectedCategory === null ? 'filled' : 'outlined'}
                  />
                  {faqCategories.map(category => (
                    <Chip
                      key={category.id}
                      label={category.name}
                      onClick={() => setSelectedCategory(category.id)}
                      color={selectedCategory === category.id ? category.color as any : 'default'}
                      variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* FAQ Categories */}
        {filteredCategories.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {filteredCategories.map(category => (
              <Card key={category.id} elevation={1}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <Box sx={{ color: `${category.color}.main` }}>{category.icon}</Box>
                    <Typography variant="h6" component="h2">{category.name}</Typography>
                    <Chip label={`${category.faqs.length} questions`} size="small" sx={{ ml: 1 }} />
                  </Box>

                  {category.faqs.map((faq, index) => (
                    <Accordion
                      key={`${category.id}-${index}`}
                      expanded={expanded === `${category.id}-${index}`}
                      onChange={handleAccordionChange(`${category.id}-${index}`)}
                      elevation={0}
                      sx={{
                        '&:before': { display: 'none' },
                        bgcolor: 'grey.50',
                        mb: 1,
                        borderRadius: 1,
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="body1" fontWeight={500}>
                          {faq.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '68ch' }}>
                          {faq.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Card elevation={1}>
            <CardContent sx={{ p: 6, textAlign: 'center' }}>
              <HelpOutlineIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" component="h2" gutterBottom>
                No FAQs Found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                We couldn't find any FAQs matching your search. Try different keywords or browse all categories.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Still Need Help Card */}
        <Card elevation={1} sx={{ mt: 4, bgcolor: 'primary.lighter', border: 1, borderColor: 'primary.light' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h6" component="h2" gutterBottom>
                  Still need help?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Can't find the answer you're looking for? Our support team is ready to assist you.
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<ChatIcon />}
                onClick={() => navigate('/contact-support')}
              >
                Contact Support
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
}
