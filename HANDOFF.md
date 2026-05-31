# Manus Handoff: El Burguer Shack Loyalty Punch Card MVP

## Goal

Polish a mobile-first web MVP for El Burguer Shack's digital loyalty punch card.

Core promise:

> Buy 9 combo meals, get the 10th combo free.

This is a customer-facing restaurant loyalty experience, not a corporate SaaS dashboard. Keep it playful, fast, warm, and operationally simple.

## Project

- Framework: Next.js App Router
- Styling: Tailwind CSS v4
- Backend target: Supabase
- Current prototype storage: local browser storage fallback
- Customer route: `/`
- Staff route: `/staff`

## Run Locally

```bash
npm install
npm run dev
```

Open:

- Customer card: `http://127.0.0.1:3000`
- Staff cashier mode: `http://127.0.0.1:3000/staff`

## Current Staff PIN

Default prototype PIN:

```txt
2019
```

Override with:

```txt
NEXT_PUBLIC_STAFF_PIN=your-pin
```

## What Works Now

- Customer splash screen.
- Customer loyalty card with real El Burguer Shack color logo.
- Real burger artwork used as punch stamp.
- QR code shown on customer card.
- Customer signup/recovery by first name and phone number.
- Staff PIN gate so customers cannot self-punch.
- Staff lookup by QR token or phone number.
- Staff actions:
  - Add Combo Punch
  - Redeem 10th Free
- Reward logic:
  - 0-8 punches: collecting
  - 9 punches: 10th combo free
  - redeem resets punches to 0 and increments redemption count
- Tests cover loyalty logic, phone recovery, and staff PIN helpers.

## Brand Assets

Use these cleaned assets:

- `public/brand/el-burguer-shack-logo-green-tight.png`
- `public/brand/el-burguer-shack-burger-tight.png`
- `public/brand/el-burguer-shack-logo-white.png`

Original/working image files are also in `public/brand`; keep them as references unless cleanup is complete.

## Visual Direction

Use the real restaurant vibe:

- Baja burger shack, beach patio, casual street-food energy.
- Dark green ink, ketchup red accent, cream/white sign paint.
- Red checker basket-paper texture.
- Sauce bottle / burger / fries visual language.
- Friendly and tactile, not enterprise software.

Avoid:

- Corporate dashboard styling.
- Analytics panels.
- Complicated menus.
- AI features or POS integrations.
- Over-polished generic gradients.

## Polish Priorities

1. Make the customer card feel beautiful and appetizing on mobile.
2. Improve splash screen composition with the real color logo and burger mark.
3. Refine logo and burger image crops if needed.
4. Improve visual hierarchy around:
   - "Buy 9 combo meals"
   - "Get your 10th FREE"
   - punch progress
   - QR scan area
5. Keep staff mode extremely fast and high-contrast.
6. Confirm all text and controls scale cleanly on small Android phones.

## Operational Priorities

The staff flow matters as much as the look.

Target counter flow:

1. Staff opens `/staff`.
2. Staff enters PIN once.
3. Staff scans customer QR or enters phone number.
4. Staff taps one big button to add a punch or redeem reward.

The scan/add flow should feel possible in under 3 seconds on a Motorola Android phone.

## Supabase Notes

Schema lives at:

```txt
src/app/schema.sql
```

Tables:

- `customers`
- `punch_events`

Current app has Supabase client setup in:

```txt
src/lib/supabase.ts
```

The app is not fully wired to Supabase yet; it currently uses `src/lib/demo-store.ts` as a local-storage prototype fallback.

## Verification Commands

Run before handoff back:

```bash
npm run lint
npm test
npm run build
```

## Files To Review First

- `src/app/page.tsx`
- `src/app/staff/page.tsx`
- `src/components/punch-card.tsx`
- `src/components/brand.tsx`
- `src/components/burger-icon.tsx`
- `src/lib/loyalty.ts`
- `src/lib/demo-store.ts`
- `src/app/globals.css`

## Known Caveats

- Browser QR scanning uses `BarcodeDetector` where supported; production Android testing is still needed.
- Staff PIN is a prototype gate, not a full auth system.
- Supabase database writes still need final integration.
- Some uploaded logo assets came from screenshots and were manually cropped; use the tight assets unless replacing with production originals.
