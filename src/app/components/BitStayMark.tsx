import Box from '@mui/material/Box';
import { c, r } from '../tokens';

/**
 * BitStay mark: a roofline over two uprights — shelter, and the two stems of ₿.
 * Inline SVG so it stays crisp at any size and can invert on a dark surface.
 */
export default function BitStayMark({ size = 32, tile = true, fg, bg }: {
  size?: number; tile?: boolean; fg?: string; bg?: string;
}) {
  const stroke = fg ?? (tile ? c.white : c.coral600);
  return (
    <Box
      component="svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      sx={{ display: 'block', flexShrink: 0 }}
    >
      {tile && <rect width="32" height="32" rx={r.sm} fill={bg ?? c.coral600} />}
      <g
        fill="none"
        stroke={stroke}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5.6 15.2 16 6.6l10.4 8.6" />
        <path d="M12.6 19.6v6.2" />
        <path d="M19.4 19.6v6.2" />
      </g>
    </Box>
  );
}
