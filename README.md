# El Burguer Shack Loyalty MVP

Mobile-first digital punch card for El Burguer Shack.

## Run

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000` for the customer card and `http://127.0.0.1:3000/staff` for cashier mode.

Staff mode is PIN-gated. The prototype default is `2019`; override it with `NEXT_PUBLIC_STAFF_PIN`.

Customers can recover a card by entering the same phone number during signup, and staff can recover it from cashier mode by phone number if the customer loses the page.

## Supabase

Copy `.env.local.example` to `.env.local` and add your Supabase project URL and anon key.

Run `src/app/schema.sql` in the Supabase SQL editor to create:

- `customers`
- `punch_events`

The prototype currently uses local browser storage as a demo fallback so the flow works immediately without Supabase credentials.
