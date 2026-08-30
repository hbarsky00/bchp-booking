#!/usr/bin/env python3
"""
Fail-loud source edits.

Every silent no-op in this repo came from the same mistake: a string replacement whose
`old` text did not match — usually because it was copied from truncated terminal output —
so the file was rewritten unchanged, the build still passed, and the change looked done.

Nothing here edits a file unless it actually matches, and every helper raises on a miss.

    from patch import replace, replace_lines, sub

    replace('src/app/pages/Shop.tsx', 'variant="contained"', 'variant="outlined"', count=2)
    replace_lines('src/x.tsx', 120, 134, new_lines, expect_first='<Card', expect_last='</Card>')
"""
from __future__ import annotations

import re
import sys
from pathlib import Path


class PatchError(RuntimeError):
    pass


def _read(path: str) -> str:
    p = Path(path)
    if not p.is_file():
        raise PatchError(f'{path}: no such file')
    return p.read_text()


def replace(path: str, old: str, new: str, count: int = 1) -> int:
    """Replace `old` exactly `count` times. Raises unless the count matches exactly."""
    src = _read(path)
    found = src.count(old)
    if found != count:
        head = old.strip().splitlines()[0][:70] if old.strip() else '(empty)'
        raise PatchError(
            f'{path}: expected {count} occurrence(s) of "{head}…", found {found}. '
            f'Nothing written.'
        )
    Path(path).write_text(src.replace(old, new, count))
    return found


def sub(path: str, pattern: str, repl: str, count: int = 1, flags: int = 0) -> int:
    """Regex variant of `replace`, with the same exact-count guarantee."""
    src = _read(path)
    out, n = re.subn(pattern, repl, src, count=count, flags=flags)
    if n != count:
        raise PatchError(f'{path}: pattern /{pattern}/ matched {n} time(s), expected {count}. Nothing written.')
    Path(path).write_text(out)
    return n


def replace_lines(path: str, start: int, end: int, new: list[str] | str,
                  expect_first: str | None = None, expect_last: str | None = None) -> None:
    """
    Replace the 1-indexed line range [start, end] inclusive.

    `expect_first` / `expect_last` are substrings that must appear on the boundary lines.
    Line numbers drift as a file is edited, so without those guards this is the most
    dangerous edit available — it will happily overwrite the wrong region.
    """
    lines = _read(path).split('\n')
    if not (1 <= start <= end <= len(lines)):
        raise PatchError(f'{path}: line range {start}-{end} outside file of {len(lines)} lines')
    if expect_first is not None and expect_first not in lines[start - 1]:
        raise PatchError(f'{path}:{start} expected to contain "{expect_first}", got: {lines[start - 1].strip()[:80]}')
    if expect_last is not None and expect_last not in lines[end - 1]:
        raise PatchError(f'{path}:{end} expected to contain "{expect_last}", got: {lines[end - 1].strip()[:80]}')
    block = new.split('\n') if isinstance(new, str) else list(new)
    lines[start - 1:end] = block
    Path(path).write_text('\n'.join(lines))


def must_contain(path: str, *needles: str) -> None:
    """Post-condition check: assert the edit actually left its mark."""
    src = _read(path)
    missing = [n for n in needles if n not in src]
    if missing:
        raise PatchError(f'{path}: expected to contain {missing!r} after editing, but it does not')


def must_not_contain(path: str, *needles: str) -> None:
    src = _read(path)
    present = [n for n in needles if n in src]
    if present:
        raise PatchError(f'{path}: still contains {present!r} after editing')


if __name__ == '__main__':
    print(__doc__, file=sys.stderr)
