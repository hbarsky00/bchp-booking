import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import { visuallyHidden } from '@mui/utils';
import { c, r } from '../tokens';

/**
 * The one header every checkout screen wears.
 *
 * Each step of the funnel used to invent its own chrome: Guest Details had a circular
 * back button, Payment Method buried its Back at the bottom of the form, Processing
 * Payment centred everything inside a narrower container, and Shop — a required stop
 * between details and payment — gave no sign it was part of a checkout at all. Nothing
 * told the guest how many steps were left, so the flow read as a series of unrelated
 * pages. This component is the fix: same back affordance, same title treatment, same
 * progress rail, same width, on all of them.
 */

export const CHECKOUT_STEPS = ['Guest details', 'Extras', 'Payment', 'Confirmed'] as const;

export interface CheckoutHeaderProps {
  /** Index into CHECKOUT_STEPS. */
  step: number;
  title: string;
  subtitle?: string;
  /** Where Back goes. Omit on steps the guest must not reverse out of (payment in flight). */
  backTo?: string | number;
  backLabel?: string;
}

export default function CheckoutHeader({
  step, title, subtitle, backTo, backLabel = 'Back',
}: CheckoutHeaderProps) {
  const navigate = useNavigate();

  return (
    <Box component="header" sx={{ mb: { xs: 3, md: 4 } }}>
      {backTo !== undefined && (
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => (typeof backTo === 'number' ? navigate(backTo) : navigate(backTo))}
          sx={{ color: c.stone600, px: 1, ml: -1, mb: 1.5, '&:hover': { color: c.stone900, bgcolor: c.stone100 } }}
        >
          {backLabel}
        </Button>
      )}

      {/* Progress rail. aria-current marks the live step for screen readers, and each
          step is labelled with its position so the count is never colour-only. */}
      <Box
        component="ol"
        aria-label="Checkout progress"
        sx={{
          display: 'flex', alignItems: 'center', gap: { xs: .75, sm: 1.5 },
          listStyle: 'none', m: 0, mb: 2.5, p: 0, flexWrap: 'wrap',
        }}
      >
        {CHECKOUT_STEPS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <Box
              component="li"
              key={label}
              aria-current={active ? 'step' : undefined}
              sx={{ display: 'flex', alignItems: 'center', gap: { xs: .75, sm: 1.5 } }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: .75 }}>
                <Box
                  aria-hidden
                  sx={{
                    width: 22, height: 22, borderRadius: `${r.pill}px`, flexShrink: 0,
                    display: 'grid', placeItems: 'center',
                    fontSize: 12, fontWeight: 700, lineHeight: 1,
                    bgcolor: done ? c.green500 : active ? c.coral600 : c.stone100,
                    color: done || active ? c.white : c.stone600,
                    border: done || active ? 'none' : `1px solid ${c.stone200}`,
                  }}
                >
                  {done ? <CheckIcon sx={{ fontSize: 14 }} /> : i + 1}
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: active ? 700 : 500,
                    color: active ? c.stone900 : c.stone600,
                    // The rail must not push the page sideways on a small screen; only the
                    // live step keeps its words there.
                    display: { xs: active ? 'block' : 'none', sm: 'block' },
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Box component="span" sx={visuallyHidden}>{`Step ${i + 1} of ${CHECKOUT_STEPS.length}: `}</Box>
                  {label}
                </Typography>
              </Box>
              {i < CHECKOUT_STEPS.length - 1 && (
                <Box
                  aria-hidden
                  sx={{
                    width: { xs: 16, sm: 28 }, height: 2, borderRadius: `${r.pill}px`,
                    bgcolor: done ? c.green300 : c.stone200,
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>

      <Typography variant="h1" sx={{ mb: subtitle ? 1 : 0 }}>{title}</Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary">{subtitle}</Typography>
      )}
    </Box>
  );
}
