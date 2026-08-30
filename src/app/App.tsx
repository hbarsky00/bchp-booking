import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router';
import { lazy, Suspense } from 'react';
import { motion, useReducedMotion } from 'motion/react';
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
const Login = lazy(() => import('./pages/Login'));

function AnimatedRoutes() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const y = reduceMotion ? 0 : 10;
  const enter = {
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0.12 : 0.26, ease: [0.22, 1, 0.36, 1] as const },
  };

  // Enter-only transition, deliberately without AnimatePresence. With an exit
  // animation the outgoing route never unmounted, so two pages stayed stacked in the
  // DOM and the browser showed the old one. Keying a plain motion element on the path
  // gives the same felt polish and cannot deadlock.
  return (
    <motion.div key={location.pathname} initial={enter.initial} animate={enter.animate} transition={enter.transition}>
      <Routes location={location}>
        <Route path="/" element={<Navigate to="/book-stay" replace />} />
        <Route path="/book-stay" element={<BookStay />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/commercial-rental" element={<CommercialRental />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/admin" element={<Admin />} />
        {/* Sign-in and the reset link share one page; the token in the query picks the mode. */}
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<Login />} />
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
    </motion.div>
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