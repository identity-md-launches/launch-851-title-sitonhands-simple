# SitOnHands design system

## Overview

SitOnHands is a focused mainnet utility for IMD holders making an irreversible time commitment. The implemented direction is a dark, restrained interface: warm green neutrals, one lime action, a large editorial heading, and a small locally drawn hourglass. The hierarchy is introduction → real vault statistics → lock form and explanation → wallet positions.

The form owns the strongest action emphasis. Supporting wallet, refresh, filter, and withdrawal controls use neutral outlines. Irreversible terms stay beside the form even after positions exist. There is one page, one theme, and no marketing yield or price displays.

Sources: `src/styles.css` is the canonical design system; `src/App.tsx` contains page patterns; `src/Icons.tsx` contains SVG assets; `src/WalletDialog.tsx` contains the native wallet modal.

## Colors

The source uses hex primitives and semantic custom properties in `:root`. Reuse semantic properties in components.

| Token | Value | Role |
| --- | --- | --- |
| `--bg-page`, `--bg-input` | `#101210` | Canvas and amount input |
| `--bg-surface` | `#151815` | Cards, stats, dialog |
| `--bg-raised` | `#191c19` | Empty-state icon and wallet option |
| `--bg-hover` | `#20251f` | Neutral interaction hover |
| `--border` | `#2d332a` | Structural borders and separators |
| `--border-control` | `#6e7866` | Identifiable form/control boundaries |
| `--text-primary` | `#f0f2e9` | Headings and prominent content |
| `--text-soft` | `#d4d9cf` | Secondary controls and values |
| `--text-secondary` | `#a2aa9c` | Descriptions, labels, helper text |
| `--text-display` | `#cbd8b8` | Italic hero word |
| `--accent` | `#c8f17c` | Primary action and selected duration |
| `--accent-hover`, `--focus` | `#d5fa94` | Primary hover and keyboard perimeter |
| `--on-accent` | `#19230d` | Primary action label |
| `--bg-selected` | `#252f1c` | Selected duration's subtle fill |
| `--warning` | `#dfbf87` | Irreversible terms and wrong network |
| `--bg-warning`, `--border-warning` | `#211f19`, `#3c372c` | Commitment notice |
| `--text-warning-body` | `#c4bcae` | Commitment explanation |
| `--error` | `#ffaba4` | Validation and unsuccessful transaction |
| `--success` | `#95d7bd` | Network dot and withdrawal-ready label |

State always also has text, an icon, a selected border, or a disabled property. The WalletConnect glyph uses its own pale blue `#9dc5fd` for connector identity. SVG hourglass colors are decorative and are not status colors.

Measured rendered contrast includes secondary text/page **7.85:1**, secondary text/surface **7.47:1**, primary label/fill **12.68:1**, selected duration text/fill **10.87:1**, and warning heading/background **9.37:1**. See the validation record for evidence and scope; these measurements do not establish every possible state.

## Typography

`--font-body` is **Inter**, followed by `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, and `sans-serif`. The local variable Latin face is `src/assets/inter-latin.woff2`, weights 100–900, normal style, loaded with `font-display: swap`. The implementation uses 400, 450, 500, 550, and 650. No remote font request is required. The italic hero word uses Georgia, Times New Roman, then system serif; its exact fallback is platform dependent.

| Role | Implemented size and treatment |
| --- | --- |
| Body/controls | `--text-body: .875rem` (14px); smaller controls `.8125rem` (13px) |
| Caption/helper | `--text-caption: .75rem` (12px); selected mobile micro labels are 11px |
| Section heading | `--text-title: 1.25rem` (20px), weight 550, line-height 1.3 |
| Hero | `clamp(3.7rem, 6.5vw, 5.4rem)`, weight 450, line-height 1.1, letter-spacing −.065em |
| Hero on narrow screens | `clamp(3.1rem, 9vw, 4.3rem)` |
| Explanation heading | 1.9rem desktop; 1.65rem intermediate; 1.75rem mobile |
| Amount input | 1.8rem (28.8px), tabular numbers |
| Stats | 1.85rem desktop; 1.5rem mobile; 1.35rem below 25rem |
| Standard inputs | 1rem (16px), including WalletConnect and custom seconds |

Body line-height is 1.5; explanations use 1.7–1.8. Headings use balanced wrapping and can break long words when text is enlarged. Paragraphs use `text-wrap: pretty`. Descriptions are constrained to approximately 32–50 characters where appropriate. Numeric amounts, dates, countdowns, and allowances use tabular figures. Position amounts offer an “Exact amount” disclosure; compact numeric displays truncate to at most four decimal places rather than altering the transaction input.

## Layout

The spacing vocabulary starts at `.25rem` and includes `.5`, `.75`, `1`, `1.25`, `1.5`, `2`, `2.5`, and `3rem` (`--space-1` through `--space-12`). Most rules use rem values directly; these properties are not a claim that every local measurement is tokenized.

The header is at most 1248px wide. `.page` and the footer are at most 1104px including their 2rem side padding. The hero has a 1.6:1 grid; the workspace has a 1.35:1 grid with a 3.5rem gap. Form groups have about twice the spacing of their internal labels. The source DOM order is also the mobile reading order.

Stats and duration choices use auto-fit grids with minimum track widths that can collapse further under text enlargement. Rows and control groups wrap instead of fixing text containers to a height. Cards, inputs, and long numeric values allow reflow.

| Breakpoint | Adaptation |
| --- | --- |
| 68rem / 1088px | Tighter header/workspace gaps; mainnet suffix hidden |
| 56rem / 896px | Navigation gets its own row; narrower card padding and explanation heading |
| 43rem / 688px | Single-column workspace; explanation follows the form; hidden network label; stacked day labels; larger touch targets; position actions span their row |
| 25rem / 400px | Decorative hourglass hidden; smaller brand; compact card margins; unlock estimate stacks; position details form one column |

The main content retains 1.25rem side margins on mobile. Buttons remain inset within cards. Header and footer are not sticky, and neither obscures content. The native wallet dialog is at most 440px wide and at most `100dvh - 2rem` tall with its own scrolling.

The production export was inspected at 1440, 800, 390, and 320 CSS pixels. Enlarged-text reflow was also checked; native browser zoom and physical-device rendering remain distinct, unperformed checks.

## Elevation & Depth

This is a mostly flat interface. Surface tones and 1px structural borders separate regions. Only the wallet dialog has a shadow (`0 20px 60px #0008`) and a dark backdrop (`#000b`). There are no animated glows, skeleton shimmers, parallax effects, or entrance sequences. The illustration has a localized SVG glass/sand gradient and carries no content meaning.

## Shapes

- Cards: 12px radius; statistics and transaction notices: 10px.
- Inputs and buttons: 7px; durations and filters: 6px.
- Native dialog: 16px; wallet options: 8px.
- Numeric step markers and status dots are circles; supporting badges use 4–5px corners.

Inputs use a stronger border than structural cards. The amount field's wrapper gets the focus ring so the input and Max action read as a group. Keyboard focus is a 2px perimeter, usually offset 4px (2px on the amount group). Forced colors use the system `Highlight` color and preserve control boundaries.

## Components

**Actions — `src/styles.css`**: `.primary` is lime filled; `.secondary` is neutral outlined; `.text-button` is an underlined supporting action; `.icon-button` always has an accessible name. Native disabled buttons show reduced opacity and reject interaction. Main action targets are at least 44px high; supporting desktop actions are 32–39px with spacing. Mobile form/helper/icon controls are enlarged to 44px. Hover rules only apply on hover-capable devices. Color/background/border transitions are 150ms with `cubic-bezier(.2, 0, 0, 1)` and only enabled under `prefers-reduced-motion: no-preference`.

**Lock form — `src/App.tsx`**: visible labels, decimal amount input, exact Max button, pressed duration buttons, custom-seconds disclosure, estimate, persistent commitment notice, and acknowledgement checkbox. Validation focuses the first failing field and connects its error via `aria-describedby`. The fieldset disables during a wallet/receipt operation. Approval and locking are separate steps; unavailable allowance/data/network states cannot submit a lock.

**Positions — `src/App.tsx`**: filters are ordinary buttons with `aria-pressed`, not ARIA tabs. Each article shows its ID, amount, exact-value disclosure, local unlock time, countdown or “Ready to withdraw,” and contract-gated withdrawal action. Empty, loading, read-error, and filtered-empty states explain the next action. Never put essential lock terms only inside an empty state.

**Transaction notice — `src/App.tsx`**: a persistent polite live region carries wallet, pending, confirmed, error, and unknown-receipt updates. It offers the transaction's Etherscan link and a receipt recheck when needed. Non-pending messages can be dismissed. An error remains visible until dismissed or another action occurs.

**WalletDialog — `src/WalletDialog.tsx`**: receives `open`, `onClose`, `wallet`, and `config`. Native `showModal()` provides background inertness, keyboard containment, Escape dismissal, and focus return. It offers discovered EIP-6963 providers, legacy injected wallets, and WalletConnect setup/QR/pairing controls. Connected state shows the complete address with an explorer link and disconnect action.

**Icon / Hourglass — `src/Icons.tsx`**: `Icon` takes a named glyph and optional size (20px default), uses `currentColor`, a 24px view box, and 1.7px outline strokes. All icons are decorative to assistive technology; their accompanying control supplies the name. `Hourglass` is a decorative local SVG. No image-generation or external icon runtime is needed.

## Do's and Don'ts

- Start additional sections with `.page`, `.panel`, and `.section-heading`; keep the reading order meaningful when stacked.
- Reserve the filled action for the current primary step. Use semantic state colors and a textual explanation together.
- Keep no-yield and no-early-exit terms near any lock action. Do not introduce APY, early-unlock controls, or administrator affordances.
- Preserve exact integer transaction amounts, contract-derived eligibility, focus return, field errors, and the complete mobile path when changing presentation.
- Use local assets and existing type roles. Do not introduce remote font dependencies, fixed-height prose, hidden horizontal overflow, or color-only status.
- For another page, reuse the header/footer and CSS tokens, use a single h1, and assemble existing card/action patterns. Add a hash route only if navigation expands, preserving compatibility with static hosting.
