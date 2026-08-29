import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router';
import { lazy, Suspense } from 'react';
import { AnimatePresence } from 'motion/react';
import { theme } from './theme';
import ScrollToTop from './components/ScrollToTop';
import LoadingFallback from './components/LoadingFallback';

// Lazy load all pages for better performance
const BookStay = lazy(() => import('./pages/BookStay'));
const Shop = lazy(() => import('./pages/Shop'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));
const GuestDetails = lazy(() => import('./pages/GuestDetails'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const BookingDetails = lazy(() => import('./pages/BookingDetails'));
const PaymentMethod = lazy(() => import('./pages/PaymentMethod'));
const ProcessingPayment = lazy(() => import('./pages/ProcessingPayment'));
const ShoppingCart = lazy(() => import('./pages/ShoppingCart'));
const BookingConfirmed = lazy(() => import('./pages/BookingConfirmed'));
const CommercialRental = lazy(() => import('./pages/CommercialRental'));
const Admin = lazy(() => import('./pages/Admin'));
const ContactSupport = lazy(() => import('./pages/ContactSupport'));
const FAQs = lazy(() => import('./pages/FAQs'));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/book-stay" replace />} />
        <Route path="/book-stay" element={<BookStay />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/commercial-rental" element={<CommercialRental />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/property-details" element={<PropertyDetails />} />
        <Route path="/guest-details" element={<GuestDetails />} />
        <Route path="/payment-method" element={<PaymentMethod />} />
        <Route path="/booking-details/:id" element={<BookingDetails />} />
        <Route path="/shopping-cart" element={<ShoppingCart />} />
        <Route path="/booking-confirmed" element={<BookingConfirmed />} />
        <Route path="/processing-payment" element={<ProcessingPayment />} />
        <Route path="/contact-support" element={<ContactSupport />} />
        <Route path="/faqs" element={<FAQs />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<LoadingFallback />}>
          <AnimatedRoutes />
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}


export default App;