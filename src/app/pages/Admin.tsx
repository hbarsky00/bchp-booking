import { useState } from 'react';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';
import Snackbar from '@mui/material/Snackbar';
import { downloadCsv } from '../lib/actions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import BlockIcon from '@mui/icons-material/Block';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { c } from '../tokens';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const pendingApprovals = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@email.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    type: 'Commercial Space',
    dates: 'Jan 25 - Jan 27, 2024',
    room: 'Conference Room A',
    attendees: 50,
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael@email.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    type: 'Commercial Space',
    dates: 'Feb 1 - Feb 3, 2024',
    room: 'Event Hall',
    attendees: 100,
  },
  {
    id: 3,
    name: 'Emma Davis',
    email: 'emma@email.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    type: 'Commercial Space',
    dates: 'Feb 8 - Feb 10, 2024',
    room: 'Meeting Room B',
    attendees: 20,
  },
];

const currentBookings = [
  {
    id: '#BK-2024-001',
    guest: {
      name: 'Alex Morgan',
      email: 'alex@email.com',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    unit: 'Unit 201',
    floor: '2nd Floor',
    checkIn: 'Jan 5, 2024',
    checkOut: 'Jan 8, 2024',
    status: 'Checked In',
    amount: 450.0,
  },
  {
    id: '#BK-2024-002',
    guest: {
      name: 'Sarah Johnson',
      email: 'sarah@email.com',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    unit: 'Unit 301',
    floor: '3rd Floor',
    checkIn: 'Jan 18, 2024',
    checkOut: 'Jan 21, 2024',
    status: 'Paid',
    amount: 600.0,
  },
  {
    id: '#BK-2024-003',
    guest: {
      name: 'Michael Chen',
      email: 'michael@email.com',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    unit: 'Unit 202',
    floor: '2nd Floor',
    checkIn: 'Jan 18, 2024',
    checkOut: 'Jan 22, 2024',
    status: 'Checked In',
    amount: 800.0,
  },
];

export default function Admin() {
  const navigate = useNavigate();
  const [propertyType, setPropertyType] = useState('residential');
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [selectedDates, setSelectedDates] = useState<number[]>([5]);
  const [bookedDates, setBookedDates] = useState<number[]>([11, 12]);
  const [blockedDates, setBlockedDates] = useState<number[]>([]);
  const [approvals, setApprovals] = useState(pendingApprovals);
  const [monthOffset, setMonthOffset] = useState(0);
  const [toast, setToast] = useState('');

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const monthLabel = `${MONTHS[(((0 + monthOffset) % 12) + 12) % 12]} ${2024 + Math.floor(monthOffset / 12)}`;

  // Selected days move into the blocked set; blocking clears any booking on that day.
  const handleBlockDates = () => {
    if (!selectedDates.length) { setToast('Select one or more dates first'); return; }
    setBlockedDates(prev => [...new Set([...prev, ...selectedDates])]);
    setBookedDates(prev => prev.filter(d => !selectedDates.includes(d)));
    setToast(`${selectedDates.length} date${selectedDates.length > 1 ? 's' : ''} blocked`);
  };

  const handleOpenDates = () => {
    if (!selectedDates.length) { setToast('Select one or more dates first'); return; }
    setBlockedDates(prev => prev.filter(d => !selectedDates.includes(d)));
    setToast(`${selectedDates.length} date${selectedDates.length > 1 ? 's' : ''} opened`);
  };

  const handleApproval = (id: number, name: string, approved: boolean) => {
    setApprovals(prev => prev.filter(a => a.id !== id));
    setToast(`${name}'s request ${approved ? 'approved' : 'rejected'}`);
  };

  const handleExport = () => {
    downloadCsv('bitstay-bookings.csv', [
      ['Booking ID', 'Guest', 'Email', 'Unit', 'Check-in', 'Check-out', 'Status', 'Amount'],
      ...filteredBookings.map(b => [b.id, b.guest.name, b.guest.email, `${b.unit} (${b.floor})`, b.checkIn, b.checkOut, b.status, b.amount]),
    ]);
    setToast(`Exported ${filteredBookings.length} bookings`);
  };


  // Filter bookings based on filters
  const filteredBookings = currentBookings.filter((booking) => {
    let matches = true;
    
    // Filter by floor
    if (selectedFloor !== 'all' && !booking.floor.includes(selectedFloor)) {
      matches = false;
    }
    
    // Filter by unit
    if (selectedUnit !== 'all' && booking.unit !== selectedUnit) {
      matches = false;
    }
    
    return matches;
  });

  const handleResetFilters = () => {
    setPropertyType('residential');
    setSelectedFloor('all');
    setSelectedUnit('all');
  };

  const getDaysInMonth = () => {
    return Array.from({ length: 31 }, (_, i) => i + 1);
  };

  const getDateStatus = (day: number) => {
    if (selectedDates.includes(day)) return 'selected';
    if (bookedDates.includes(day)) return 'booked';
    if (blockedDates.includes(day)) return 'blocked';
    return 'available';
  };

  const getDateColor = (status: string) => {
    switch (status) {
      case 'selected':
        return { bgcolor: c.blue200, border: `2px solid ${c.blue500}` };
      case 'booked':
        return { bgcolor: c.red200, border: `1px solid ${c.red300}` };
      case 'blocked':
        return { bgcolor: c.gray200, border: `1px solid ${c.gray300}` };
      default:
        return { bgcolor: 'white', border: `1px solid ${c.gray200}` };
    }
  };

  return (
    <Layout>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 4 }}>
          <Box>
            <Typography variant="h1" gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage availability, approvals, and bookings
            </Typography>
          </Box>
          <Chip
            icon={<CheckCircleIcon />}
            label="Admin Access"
            sx={{
              bgcolor: c.green100,
              color: c.green700,
              fontWeight: 600,
              border: `1px solid ${c.green200}`,
            }}
          />
        </Box>

        <Grid container spacing={3}>
          {/* Filters Sidebar */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Card elevation={1}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <FilterAltIcon sx={{ color: c.coral700, fontSize: 20 }} />
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                    Filters
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Property Type */}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
                      Property Type
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button
                        variant={propertyType === 'residential' ? 'contained' : 'outlined'}
                        size="small"
                        startIcon={<HomeIcon sx={{ fontSize: 18 }} />}
                        onClick={() => setPropertyType('residential')}
                        sx={{
                          textTransform: 'none',
                          justifyContent: 'flex-start',
                          bgcolor: propertyType === 'residential' ? c.coral700 : 'white',
                          borderColor: c.gray200,
                          color: propertyType === 'residential' ? 'white' : c.stone600,
                          '&:hover': {
                            bgcolor: propertyType === 'residential' ? c.coral700 : c.stone50,
                            borderColor: c.gray200,
                          },
                        }}
                      >
                        Residential
                      </Button>
                      <Button
                        variant={propertyType === 'commercial' ? 'contained' : 'outlined'}
                        size="small"
                        startIcon={<BusinessIcon sx={{ fontSize: 18 }} />}
                        onClick={() => setPropertyType('commercial')}
                        sx={{
                          textTransform: 'none',
                          justifyContent: 'flex-start',
                          bgcolor: propertyType === 'commercial' ? c.coral700 : 'white',
                          borderColor: c.gray200,
                          color: propertyType === 'commercial' ? 'white' : c.stone600,
                          '&:hover': {
                            bgcolor: propertyType === 'commercial' ? c.coral700 : c.stone50,
                            borderColor: c.gray200,
                          },
                        }}
                      >
                        Commercial
                      </Button>
                    </Box>
                  </Box>

                  {/* Floor */}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
                      Floor
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button
                        variant="text"
                        size="small"
                        fullWidth
                        onClick={() => setSelectedFloor('all')}
                        sx={{
                          textTransform: 'none',
                          justifyContent: 'flex-start',
                          fontWeight: selectedFloor === 'all' ? 600 : 400,
                          color: selectedFloor === 'all' ? c.coral700 : c.stone600,
                          bgcolor: selectedFloor === 'all' ? c.coral50 : 'transparent',
                          '&:hover': {
                            bgcolor: selectedFloor === 'all' ? c.coral100 : c.stone100,
                          },
                        }}
                      >
                        All Floors
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        fullWidth
                        onClick={() => setSelectedFloor('2nd Floor')}
                        sx={{
                          textTransform: 'none',
                          justifyContent: 'flex-start',
                          fontWeight: selectedFloor === '2nd Floor' ? 600 : 400,
                          color: selectedFloor === '2nd Floor' ? c.coral700 : c.stone600,
                          bgcolor: selectedFloor === '2nd Floor' ? c.coral50 : 'transparent',
                          '&:hover': {
                            bgcolor: selectedFloor === '2nd Floor' ? c.coral100 : c.stone100,
                          },
                        }}
                      >
                        2nd Floor
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        fullWidth
                        onClick={() => setSelectedFloor('3rd Floor')}
                        sx={{
                          textTransform: 'none',
                          justifyContent: 'flex-start',
                          fontWeight: selectedFloor === '3rd Floor' ? 600 : 400,
                          color: selectedFloor === '3rd Floor' ? c.coral700 : c.stone600,
                          bgcolor: selectedFloor === '3rd Floor' ? c.coral50 : 'transparent',
                          '&:hover': {
                            bgcolor: selectedFloor === '3rd Floor' ? c.coral100 : c.stone100,
                          },
                        }}
                      >
                        3rd Floor
                      </Button>
                    </Box>
                  </Box>

                  {/* Unit */}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
                      Unit
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button
                        variant="text"
                        size="small"
                        fullWidth
                        onClick={() => setSelectedUnit('all')}
                        sx={{
                          textTransform: 'none',
                          justifyContent: 'flex-start',
                          fontWeight: selectedUnit === 'all' ? 600 : 400,
                          color: selectedUnit === 'all' ? c.coral700 : c.stone600,
                          bgcolor: selectedUnit === 'all' ? c.coral50 : 'transparent',
                          '&:hover': {
                            bgcolor: selectedUnit === 'all' ? c.coral100 : c.stone100,
                          },
                        }}
                      >
                        All Units
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        fullWidth
                        onClick={() => setSelectedUnit('Unit 201')}
                        sx={{
                          textTransform: 'none',
                          justifyContent: 'flex-start',
                          fontWeight: selectedUnit === 'Unit 201' ? 600 : 400,
                          color: selectedUnit === 'Unit 201' ? c.coral700 : c.stone600,
                          bgcolor: selectedUnit === 'Unit 201' ? c.coral50 : 'transparent',
                          '&:hover': {
                            bgcolor: selectedUnit === 'Unit 201' ? c.coral100 : c.stone100,
                          },
                        }}
                      >
                        Unit 201
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        fullWidth
                        onClick={() => setSelectedUnit('Unit 301')}
                        sx={{
                          textTransform: 'none',
                          justifyContent: 'flex-start',
                          fontWeight: selectedUnit === 'Unit 301' ? 600 : 400,
                          color: selectedUnit === 'Unit 301' ? c.coral700 : c.stone600,
                          bgcolor: selectedUnit === 'Unit 301' ? c.coral50 : 'transparent',
                          '&:hover': {
                            bgcolor: selectedUnit === 'Unit 301' ? c.coral100 : c.stone100,
                          },
                        }}
                      >
                        Unit 301
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        fullWidth
                        onClick={() => setSelectedUnit('Unit 202')}
                        sx={{
                          textTransform: 'none',
                          justifyContent: 'flex-start',
                          fontWeight: selectedUnit === 'Unit 202' ? 600 : 400,
                          color: selectedUnit === 'Unit 202' ? c.coral700 : c.stone600,
                          bgcolor: selectedUnit === 'Unit 202' ? c.coral50 : 'transparent',
                          '&:hover': {
                            bgcolor: selectedUnit === 'Unit 202' ? c.coral100 : c.stone100,
                          },
                        }}
                      >
                        Unit 202
                      </Button>
                    </Box>
                  </Box>

                  {/* Reset All */}
                  <Button
                    startIcon={<RefreshIcon />}
                    size="small"
                    fullWidth
                    sx={{
                      textTransform: 'none',
                      color: c.coral700,
                      '&:hover': {
                        bgcolor: c.coral50,
                      },
                    }}
                    variant="text"
                    onClick={handleResetFilters}
                  >
                    Reset All
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Main Content */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Grid container spacing={3}>
              {/* Availability Calendar */}
              <Grid size={{ xs: 12, lg: 7 }}>
                <Card elevation={1}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                      <CalendarMonthIcon color="primary" />
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                        Availability Calendar
                      </Typography>
                    </Box>

                    {/* Legend */}
                    <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 16, height: 16, bgcolor: 'white', border: `1px solid ${c.gray200}` }} />
                        <Typography variant="caption">Available</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 16, height: 16, bgcolor: c.red200, border: `1px solid ${c.red300}` }} />
                        <Typography variant="caption">Booked</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 16, height: 16, bgcolor: c.gray200, border: `1px solid ${c.gray300}` }} />
                        <Typography variant="caption">Blocked</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 16, height: 16, bgcolor: c.blue200, border: `2px solid ${c.blue500}` }} />
                        <Typography variant="caption">Selected</Typography>
                      </Box>
                    </Box>

                    {/* Month Navigation */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <IconButton size="small" aria-label="Previous month" onClick={() => setMonthOffset(m => m - 1)}>
                        <ChevronLeftIcon />
                      </IconButton>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {monthLabel}
                      </Typography>
                      <IconButton size="small" aria-label="Next month" onClick={() => setMonthOffset(m => m + 1)}>
                        <ChevronRightIcon />
                      </IconButton>
                    </Box>

                    {/* Calendar Grid */}
                    <Box sx={{ mb: 3 }}>
                      {/* Day Headers */}
                      <Grid container spacing={1} sx={{ mb: 1 }}>
                        {daysOfWeek.map((day) => (
                          <Grid key={day} size={{ xs: 12 / 7 }}>
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 600,
                                color: 'text.secondary',
                                display: 'block',
                                textAlign: 'center',
                              }}
                            >
                              {day}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>

                      {/* Calendar Days */}
                      <Grid container spacing={1}>
                        {getDaysInMonth().map((day) => {
                          const status = getDateStatus(day);
                          const colors = getDateColor(status);
                          return (
                            <Grid key={day} size={{ xs: 12 / 7 }}>
                              <Box
                                sx={{
                                  ...colors,
                                  aspectRatio: '1',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: 1,
                                  cursor: 'pointer',
                                  '&:hover': {
                                    opacity: 0.8,
                                  },
                                }}
                                onClick={() => {
                                  if (selectedDates.includes(day)) {
                                    setSelectedDates(selectedDates.filter((d) => d !== day));
                                  } else {
                                    setSelectedDates([...selectedDates, day]);
                                  }
                                }}
                              >
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {day}
                                </Typography>
                              </Box>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Box>

                    {/* Action Buttons */}
                    <Grid container spacing={2}>
                      <Grid size={6}>
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<BlockIcon />}
                          onClick={handleBlockDates}
                          sx={{
                            bgcolor: c.red300,
                            color: c.red900,
                            textTransform: 'none',
                            '&:hover': {
                              bgcolor: c.red400,
                            },
                          }}
                        >
                          Block Dates
                        </Button>
                      </Grid>
                      <Grid size={6}>
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<EventAvailableIcon />}
                          onClick={handleOpenDates}
                          sx={{
                            bgcolor: c.green300,
                            color: c.green900,
                            textTransform: 'none',
                            '&:hover': {
                              bgcolor: c.green400,
                            },
                          }}
                        >
                          Open Dates
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Pending Approvals */}
              <Grid size={{ xs: 12, lg: 5 }}>
                <Card elevation={1}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <PendingActionsIcon sx={{ color: c.amber500 }} />
                        <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                          Pending Approvals
                        </Typography>
                      </Box>
                      <Chip
                        label="3"
                        size="small"
                        sx={{
                          bgcolor: c.amber100,
                          color: c.amber800,
                          fontWeight: 700,
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {approvals.map((approval) => (
                        <Card key={approval.id} elevation={0} sx={{ bgcolor: 'grey.50', border: '1px solid', borderColor: 'divider' }}>
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                              <Avatar src={approval.avatar} alt={approval.name} />
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  {approval.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {approval.type}
                                </Typography>
                              </Box>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="caption">{approval.dates}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <MeetingRoomIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="caption">{approval.room}</Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PeopleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="caption">{approval.attendees} attendees</Typography>
                              </Box>
                            </Box>

                            <Grid container spacing={1}>
                              <Grid size={6}>
                                <Button
                                  variant="contained"
                                  fullWidth
                                  size="small"
                                  startIcon={<CheckCircleIcon />}
                                  onClick={() => handleApproval(approval.id, approval.name, true)}
                                  sx={{
                                    bgcolor: c.green700,
                                    textTransform: 'none',
                                    '&:hover': {
                                      bgcolor: c.green900,
                                    },
                                  }}
                                >
                                  Approve
                                </Button>
                              </Grid>
                              <Grid size={6}>
                                <Button
                                  variant="contained"
                                  fullWidth
                                  size="small"
                                  startIcon={<CloseIcon />}
                                  onClick={() => handleApproval(approval.id, approval.name, false)}
                                  sx={{
                                    bgcolor: c.red600,
                                    textTransform: 'none',
                                    '&:hover': {
                                      bgcolor: c.red600,
                                    },
                                  }}
                                >
                                  Reject
                                </Button>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Current Bookings Table - Full Width */}
        <Card elevation={1} sx={{ mt: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <BookOnlineIcon color="primary" />
                <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
                  Current Bookings
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                startIcon={<FileDownloadIcon />}
                onClick={handleExport}
                sx={{ textTransform: 'none' }}
              >
                Export
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>BOOKING ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>GUEST</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>UNIT</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>CHECK-IN</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>CHECK-OUT</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>STATUS</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>AMOUNT</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {booking.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar src={booking.guest.avatar} alt={booking.guest.name} sx={{ width: 32, height: 32 }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {booking.guest.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {booking.guest.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {booking.unit}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {booking.floor}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{booking.checkIn}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{booking.checkOut}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={booking.status}
                          size="small"
                          sx={{
                            bgcolor: booking.status === 'Checked In' ? c.blue100 : c.emerald100,
                            color: booking.status === 'Checked In' ? c.blue800 : c.emerald800,
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ${booking.amount.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => navigate(`/booking-details/${booking.id}`)}
                          sx={{ textTransform: 'none', color: 'primary.main' }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3000}
        onClose={() => setToast('')}
        message={toast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Layout>
  );
}