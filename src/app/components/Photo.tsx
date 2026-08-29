import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import type { SxProps, Theme } from '@mui/material/styles';
import BrokenImageOutlinedIcon from '@mui/icons-material/BrokenImageOutlined';
import { c, r } from '../tokens';

interface PhotoProps {
  src: string;
  alt: string;
  /** CSS aspect-ratio for fluid images, e.g. '20 / 19'. Omit when sizing via `sx`. */
  ratio?: string;
  radius?: number;
  /** Applied to the wrapper — use for width/height, grid placement, margins. */
  sx?: SxProps<Theme>;
  /** Marks the <img> so a parent can drive hover effects. */
  imgClassName?: string;
  imgSx?: SxProps<Theme>;
  eager?: boolean;
}

/**
 * Every image in the app goes through here so loading looks the same everywhere:
 * a shimmer occupying the exact final box, then a fade to the photo. The wrapper
 * always reserves space, so nothing reflows when the image lands.
 */
export default function Photo({
  src, alt, ratio, radius = r.md, sx, imgClassName, imgSx, eager = false,
}: PhotoProps) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');

  // A cached image can already be complete before React attaches onLoad, and that event
  // then never fires — leaving the photo at opacity 0 behind a permanent skeleton.
  // Settle the state from the element itself the moment we get a reference to it.
  const settleIfCached = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete) setState(node.naturalWidth > 0 ? 'loaded' : 'error');
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: `${radius}px`,
        bgcolor: c.stone100,
        ...(ratio ? { aspectRatio: ratio } : null),
        ...sx,
      }}
    >
      {state === 'loading' && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', bgcolor: c.stone100 }}
        />
      )}

      {state === 'error' ? (
        <Box
          role="img"
          aria-label={alt}
          sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: c.stone500 }}
        >
          <BrokenImageOutlinedIcon fontSize="small" />
        </Box>
      ) : (
        <Box
          component="img"
          ref={settleIfCached}
          src={src}
          alt={alt}
          className={imgClassName}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
          sx={{
            // Never opacity:0 at rest. The skeleton sits BEHIND the image, so an
            // unloaded image is simply unpainted and the shimmer shows through. If the
            // load state never settles, the photo still appears the moment it decodes
            // instead of being stranded invisible.
            position: 'relative',
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            // No opacity animation on the image, deliberately. Any keyframe that starts
            // transparent pins the photo invisible while animations are throttled (a
            // background tab), and a loaded image must never depend on an animation
            // running to be seen. The skeleton behind it already covers the wait.
            transition: 'transform .45s cubic-bezier(.22,1,.36,1)',
            '@media (prefers-reduced-motion: reduce)': { animation: 'none', transition: 'none' },
            ...imgSx,
          }}
        />
      )}
    </Box>
  );
}
