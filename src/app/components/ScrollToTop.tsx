import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router';

/**
 * Sends every forward navigation to the top of the page.
 *
 * Keyed on `location.key`, not `pathname`: the key changes on every navigation, so this
 * also fires when a link leads to the same route with different state (picking another
 * unit while already on /property-details, or tapping the section you are already in).
 *
 * Back and forward are left alone — the browser restores the previous position, which
 * is what a person expects when retracing their steps.
 */
export default function ScrollToTop() {
  const { key } = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    if (navigationType === 'POP') return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [key, navigationType]);

  return null;
}
