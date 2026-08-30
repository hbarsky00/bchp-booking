/**
 * Small browser actions shared by the booking screens: receipts, calendar files and
 * sharing. Kept in one place so every "Download" and "Share" button behaves the same.
 */

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke on the next tick; revoking synchronously can cancel the download in Safari.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function downloadText(filename: string, contents: string) {
  saveBlob(new Blob([contents], { type: 'text/plain;charset=utf-8' }), filename);
}

export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const escape = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = rows.map(r => r.map(escape).join(',')).join('\n');
  saveBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), filename);
}

/** Minimal RFC 5545 event. Dates are YYYY-MM-DD; all-day so timezones can't drift it. */
export function downloadIcs(opts: {
  filename: string; title: string; start: string; end: string; location?: string; description?: string;
}) {
  const stamp = (d: string) => d.replace(/-/g, '');
  const fold = (line: string) => line.match(/.{1,74}/g)?.join('\r\n ') ?? line;
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//BitStay//Booking//EN', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${stamp(opts.start)}-${Math.abs(hash(opts.title))}@bitstay`,
    `DTSTART;VALUE=DATE:${stamp(opts.start)}`,
    `DTEND;VALUE=DATE:${stamp(opts.end)}`,
    fold(`SUMMARY:${escapeIcs(opts.title)}`),
    opts.location ? fold(`LOCATION:${escapeIcs(opts.location)}`) : '',
    opts.description ? fold(`DESCRIPTION:${escapeIcs(opts.description)}`) : '',
    'END:VEVENT', 'END:VCALENDAR',
  ].filter(Boolean);
  saveBlob(new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' }), opts.filename);
}

const escapeIcs = (s: string) => s.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
const hash = (s: string) => [...s].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) | 0, 7);

/**
 * Native share sheet where available, clipboard otherwise. Resolves to what happened so
 * the caller can show the right confirmation instead of guessing.
 */
export async function shareOrCopy(data: { title: string; text: string; url?: string }):
  Promise<'shared' | 'dismissed' | 'copied' | 'failed'> {
  const url = data.url ?? window.location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title: data.title, text: data.text, url });
      return 'shared';
    } catch (err) {
      // Dismissing the sheet is a decision, not a failure — but it is also not a share,
      // and reporting it as one left the button looking dead.
      if ((err as DOMException)?.name === 'AbortError') return 'dismissed';
    }
  }
  try {
    await navigator.clipboard.writeText(`${data.text}\n${url}`);
    return 'copied';
  } catch {
    return 'failed';
  }
}
