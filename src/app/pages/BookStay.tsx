import { useState } from 'react';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';
import Photo from '../components/Photo';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedIcon from '@mui/icons-material/Verified';
import BoltIcon from '@mui/icons-material/Bolt';
import TokenIcon from '@mui/icons-material/Token';
import StarIcon from '@mui/icons-material/Star';

const previewUnits = [
  { name: 'Satoshi Room', floor: '2nd floor · 2 guests', rating: 4.9, price: 45, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800' },
  { name: 'Nakamoto Room', floor: '2nd floor · 2 guests', rating: 4.8, price: 52, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800' },
  { name: 'Tominaga Room', floor: '3rd floor · 3 guests', rating: 5.0, price: 65, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800' },
  { name: 'Peer to Peer Room', floor: '3rd floor · 4 guests', rating: 4.7, price: 68, image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800' },
];
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
import { c, r } from '../tokens';

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
        {/* Hero: photography first, search on top of it — the shape of a stay, not a form */}
        <Box
          sx={{
            position: 'relative', borderRadius: `${r.lg}px`, overflow: 'hidden',
            minHeight: { xs: 420, md: 480 },
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            px: { xs: 3, md: 7 }, py: { xs: 4, md: 7 }, mb: { xs: 5, md: 8 },
          }}
        >
          <Photo
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600"
            alt=""
            radius={0}
            eager
            sx={{ position: 'absolute', inset: 0 }}
          />
          <Box sx={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(28,25,23,.15) 0%, rgba(28,25,23,.35) 45%, rgba(28,25,23,.78) 100%)',
          }} />

          <Box sx={{ position: 'relative', maxWidth: 660 }}>
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.75, mb: 2,
              bgcolor: 'rgba(28,25,23,.62)', border: '1px solid rgba(255,255,255,.22)',
              backdropFilter: 'blur(2px)',
              borderRadius: 999, px: 1.5, py: 0.5,
            }}>
              <VerifiedIcon sx={{ fontSize: 15, color: c.white }} />
              <Typography component="span" sx={{ fontSize: 12.5, fontWeight: 600, color: c.white }}>
                Settled on-chain · no chargebacks
              </Typography>
            </Box>
            <Typography variant="h1" sx={{ color: c.white, mb: 1.5 }}>
              Stay in Yogyakarta,<br />pay in crypto
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,.86)', fontSize: { xs: 15, md: 17 }, maxWidth: 480 }}>
              Verified rooms and commercial space, booked in minutes and settled instantly.
            </Typography>
          </Box>
        </Box>

        {/* Search — one horizontal bar on desktop, stacked on phones */}
        <Box
          component="section"
          aria-label="Search availability"
          sx={{
            mt: { xs: -9, md: -12 }, mx: { xs: 0, md: 2 }, mb: { xs: 5, md: 8 },
            position: 'relative', bgcolor: c.white, borderRadius: `${r.lg}px`,
            boxShadow: '0 6px 16px rgba(28,25,23,.10), 0 1px 3px rgba(28,25,23,.08)',
            p: { xs: 2, md: 1.25 },
            display: 'grid', alignItems: { md: 'center' },
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr) auto' },
            columnGap: { xs: 2, md: 0 }, rowGap: { xs: 2, md: 0 },
          }}
        >
          {[
            { label: 'Check in', node: (
              <TextField fullWidth type="date" variant="standard" value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                InputProps={{ disableUnderline: true }} inputProps={{ 'aria-label': 'Check-in date' }} />
            )},
            { label: 'Check out', node: (
              <TextField fullWidth type="date" variant="standard" value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                InputProps={{ disableUnderline: true }} inputProps={{ 'aria-label': 'Check-out date' }} />
            )},
            { label: 'Guests', node: (
              <FormControl fullWidth variant="standard">
                <Select value={guests} onChange={(e) => setGuests(e.target.value)} displayEmpty disableUnderline
                  inputProps={{ 'aria-label': 'Number of guests' }}>
                  <MenuItem value="">Add guests</MenuItem>
                  {[1, 2, 3, 4, 5].map(n => (
                    <MenuItem key={n} value={String(n)}>{n === 5 ? '5+ guests' : `${n} guest${n > 1 ? 's' : ''}`}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )},
            { label: 'Beds', node: (
              <FormControl fullWidth variant="standard">
                <Select value={beds} onChange={(e) => setBeds(e.target.value)} displayEmpty disableUnderline
                  inputProps={{ 'aria-label': 'Number of beds' }}>
                  <MenuItem value="">Any</MenuItem>
                  {[1, 2, 3, 4, 5].map(n => (
                    <MenuItem key={n} value={String(n)}>{n === 5 ? '5+ beds' : `${n} bed${n > 1 ? 's' : ''}`}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )},
          ].map((field, i, arr) => (
            <Box key={field.label} sx={{
              minWidth: 0, py: { xs: 0, md: 0.5 },
              // Divider only between the pair on mobile; between every field on desktop.
              borderRight: {
                xs: i % 2 === 0 ? `1px solid ${c.stone200}` : 0,
                md: i < arr.length - 1 ? `1px solid ${c.stone200}` : 0,
              },
              // Breathing room on both sides of a divider, never flush against it.
              pl: { xs: i % 2 === 1 ? 2 : 0, md: 2.5 },
              pr: { xs: i % 2 === 0 ? 2 : 0, md: 2.5 },
            }}>
              <Typography component="span" sx={{ display: 'block', fontSize: 12, fontWeight: 700, color: c.stone900, mb: .25 }}>
                {field.label}
              </Typography>
              {field.node}
            </Box>
          ))}

          <Button
            variant="contained"
            onClick={handleSearchAvailability}
            startIcon={<SearchIcon />}
            sx={{
              ml: { md: 1.5 }, flexShrink: 0,
              gridColumn: { xs: '1 / -1', md: 'auto' },
              borderRadius: `${r.md}px`, px: 3.5, minHeight: 52,
              width: { xs: '100%', md: 'auto' },
            }}
          >
            Search
          </Button>
        </Box>

        {/* Why book here — the crypto angle, stated once, without shouting */}
        <Grid container spacing={{ xs: 2.5, md: 4 }} sx={{ mb: { xs: 5, md: 8 } }}>
          {[
            { icon: <ShieldIcon />, title: 'Settled on-chain', body: 'Every booking is written to the chain. No disputes, no chargebacks, no middleman holding your money.' },
            { icon: <BoltIcon />, title: 'Confirmed in seconds', body: 'Pay in BSV or stablecoin and your room is held immediately — no three-day card authorisation.' },
            { icon: <TokenIcon />, title: 'Proof of stay', body: 'Each completed stay mints a token you keep. It is your receipt, your review right, and your loyalty status.' },
          ].map(f => (
            <Grid key={f.title} size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{
                  flexShrink: 0, width: 42, height: 42, borderRadius: `${r.md}px`, display: 'grid', placeItems: 'center',
                  bgcolor: c.stone100, color: c.stone900,
                }}>
                  {f.icon}
                </Box>
                <Box>
                  <Typography variant="h5" component="h2" sx={{ mb: .5 }}>{f.title}</Typography>
                  <Typography variant="body2" sx={{ color: c.stone600 }}>{f.body}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* A look at what is available, so the page is never a dead end */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 2, mb: 2.5 }}>
          <Typography variant="h2" component="h2">Rooms in Yogyakarta</Typography>
          <Button onClick={handleSearchAvailability} sx={{ px: 0, fontWeight: 700, textDecoration: 'underline' }}>
            Show all
          </Button>
        </Box>
        <Grid container spacing={{ xs: 3, md: 4 }} rowSpacing={{ xs: 4, md: 5 }}>
          {previewUnits.map(u => (
            <Grid key={u.name} size={{ xs: 12, sm: 6, md: 3 }}>
              <Box
                role="button"
                tabIndex={0}
                aria-label={`${u.name}, $${u.price} per night`}
                onClick={handleSearchAvailability}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSearchAvailability(); } }}
                sx={{
                  cursor: 'pointer',
                  '&:hover img': { transform: 'scale(1.045)' },
                  '@media (prefers-reduced-motion: reduce)': { '&:hover img': { transform: 'none' } },
                }}
              >
                <Photo src={u.image} alt={u.name} ratio="20 / 19" sx={{ mb: 1.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'baseline' }}>
                  <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 600 }}>{u.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: .375 }}>
                    <StarIcon sx={{ fontSize: 14, color: c.stone900 }} />
                    <Typography component="span" className="tnum" sx={{ fontSize: 14 }}>{u.rating}</Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: c.stone600 }}>{u.floor}</Typography>
                <Typography className="tnum" sx={{ mt: .75, fontSize: 15 }}>
                  <Box component="span" sx={{ fontWeight: 700 }}>${u.price}</Box>
                  <Box component="span" sx={{ color: c.stone600 }}> night</Box>
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Layout>
  );
}