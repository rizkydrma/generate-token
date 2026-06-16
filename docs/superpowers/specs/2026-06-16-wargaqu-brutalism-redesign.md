# Wargaqu Page — Brutalism Redesign

**Date**: 2026-06-16  
**Scope**: Redesign `src/wargaqu/index.tsx` with brutalist web design aesthetic  
**Status**: Approved

---

## Overview

Transform the existing Wargaqu Google Sign-In + token display page into a stunning brutalist web design that is raw, bold, high-contrast, and visually unforgettable.

## Design Tokens

### Colors
- `bg-primary`: `#0a0a0a` (near-black)
- `bg-secondary`: `#111111` (slightly lighter black for depth)
- `text-primary`: `#f0f0f0` (off-white)
- `accent`: `#00ff41` (matrix/hacker green)
- `accent-alt`: `#ffff00` (yellow, for hover states)
- `border`: `#f0f0f0` (white borders on dark bg)

### Typography
- Font family: `'Courier New', 'JetBrains Mono', 'Fira Code', monospace`
- All text monospace, uppercase for headings/buttons
- Large sizes, generous letter-spacing

### Spacing & Borders
- Border width: 4px-6px solid
- Border radius: 0 everywhere
- Generous padding (2rem-4rem)
- Box shadows: solid offset (no blur) — `6px 6px 0 #00ff41`

## Component Breakdown

### 1. Page Shell
- Full viewport dark background (`#0a0a0a`)
- Subtle decorative ASCII-art watermark (opacity 0.03) — large brackets `[ ]` or geometric pattern in background
- No scrollbars visible unless needed

### 2. Main Card Container
- White border (4px solid `#f0f0f0`) on dark bg
- Massive padding
- Max-width constrained, centered
- Decorative corner brackets or diagonal lines

### 3. Header / Title
- Large uppercase monospace text: `WARGAGU TOKEN GENERATOR`
- Accent color underline (4px solid `#00ff41`)
- Optional blinking cursor decoration

### 4. Google Sign-In Button
- Full-width block button
- Background: `#00ff41`, text: `#0a0a0a`
- Border: 4px solid `#f0f0f0`
- Shadow: `6px 6px 0 #f0f0f0` (solid offset shadow)
- Hover: invert colors (bg becomes white, text black, shadow green)
- Hover: translate(-2px, -2px) + shadow moves
- Text: `[ SIGN IN WITH GOOGLE ]` with bracket decorations
- Active: translate back, shadow shrinks

### 5. Token Output Section
- Visible only when token exists
- Label: `[ TOKEN OUTPUT ]` in accent green
- Textarea:
  - Dark background (`#111111`)
  - Green monospace text (`#00ff41`)
  - White border 4px
  - Read-only styled
  - Full width
  - Custom scrollbar (green on dark)
- "Copy" functionality via click-to-select or copy button (nice-to-have)

### 6. Footer / Status
- Small monospace text
- Shows auth state implicitly
- Decorative separator line

## State Handling

| State | Behavior |
|-------|----------|
| Initial | Button visible, no token section |
| Signing in | Button shows loading text, cursor wait |
| Success | Token textarea appears with expand animation |
| Error | Alert styled with brutalist red border/box |
| Token present | Token area visible, button remains for re-auth |

## Responsive Behavior

- Mobile: padding reduces, font sizes scale down
- Button remains full-width
- Textarea height adjusts
- Decorative elements simplify (bg watermark hidden on small screens)

## Technical Notes

- Pure CSS-in-JS via React `style` objects (no external CSS library)
- Keep existing Firebase logic untouched
- Add `copyToClipboard` handler for token
- No new dependencies
