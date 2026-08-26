# Smart Squad Travels Website

Production-ready marketing website for **Smart Squad Travels** — group transportation and Traveller rental services across Delhi NCR and North India.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, React Hook Form, Zod, Resend, and optional Supabase.

> **Business rule:** This site does **not** sell fixed tour packages. Destinations are locations served. Every primary CTA invites a **custom quotation**.

---

## Requirements

- Node.js **20.9+** (recommended: Node 22 via `nvm use 22`)
- npm 10+

## Quick start

```bash
# Use a supported Node version
nvm use 22

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Generate placeholder images (already included; re-run if needed)
npm run generate:images

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Before go-live checklist

### 1. Admin dashboard (edit the website without code)

Open `/sstadmin` after setting these in `.env.local`:

| Variable | Purpose |
|---|---|
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD` | Admin login password |
| `ADMIN_SESSION_SECRET` | Long random string used to sign the login cookie |

From the admin you can update business details, home hero slides, destinations, fleet, services, FAQs, reviews, blog, gallery and about/legal copy.

**Local / VPS:** content is saved under `data/cms/`.

**Vercel:** run [`supabase/production.sql`](supabase/production.sql) once, then set the Supabase env vars. After that, Destinations, Blog, photo uploads and form submissions are managed from `/sstadmin` with **no new deploy**.

### 2. Update business configuration

Edit [`content/site-config.ts`](content/site-config.ts) and replace every `REPLACE_*` value:

- Phone (display + E.164)
- WhatsApp number
- Public email
- Full business address
- Facebook / Instagram / YouTube URLs
- Google Business Profile + review URLs
- Map embed URL
- Fleet ownership / availability flags
- Trust statistics (leave `null` until verified)

You can also override phone/WhatsApp/email via `.env.local` (see `.env.example`).

### 3. Configure environment variables

Create `.env.local` from `.env.example`:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `NEXT_PUBLIC_BUSINESS_PHONE` | Dialable phone |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number (country code, no `+` preferred for `wa.me`) |
| `NEXT_PUBLIC_BUSINESS_EMAIL` | Public contact email |
| `BUSINESS_ENQUIRY_EMAIL` | Inbox for enquiry notifications (server-only) |
| `RESEND_API_KEY` | Resend API key (server-only) |
| `RESEND_FROM_EMAIL` | Verified sender, e.g. `Smart Squad Travels <hello@yourdomain.com>` |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional service role (server-only, never expose) |

**Never commit `.env.local`.** API keys stay server-side.

### 4. Enable enquiry emails (Resend)

1. Create a [Resend](https://resend.com) account
2. Verify your sending domain
3. Set `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `BUSINESS_ENQUIRY_EMAIL`
4. Submit a test enquiry from the homepage form

Without Resend configured, enquiries still validate and return a reference in development; emails are skipped with a server log warning.

### 5. Enquiry inbox (admin)

Website form submissions are saved automatically and appear under **Admin → Enquiries** (`/sstadmin/enquiries`). From there you can search, change status, add notes, archive, delete, and contact the customer.

On this machine they are stored in `data/enquiries.json`. For production hosting:

1. Create a Supabase project
2. Run [`supabase/production.sql`](supabase/production.sql) in the SQL editor (CMS + enquiries + photo bucket)
3. Add Supabase env vars to `.env.local` (and Vercel)

Email notifications still need Resend (step 4) and are independent of the admin inbox.

### 6. Replace placeholder images

Sample photos are included for development clarity:

- **Force Traveller** exteriors from Wikimedia Commons (real Traveller on Leh–Manali highway and related)
- **Destinations** from Wikimedia Commons (Jaipur Amber Fort, Kedarnath, Haridwar, Nainital, etc.)
- Supporting detail shots from Pexels / Unsplash

Re-download samples anytime:

```bash
npm run download:samples
```

Before launch, replace files under `public/images/` with **your own** fleet and destination photos. Keep filenames (or update paths in content files):

| Folder | Content file |
|---|---|
| `public/images/hero/` | `content/home.ts` |
| `public/images/fleet/traveller/` | `content/fleet.ts` |
| `public/images/fleet/urbania/` | `content/fleet.ts` |
| `public/images/destinations/` | `content/destinations.ts` |
| `public/images/gallery/` (shared with fleet/destinations) | `content/gallery.ts` |
| `public/images/blog/` | `content/blog.ts` |
| `public/images/og-default.jpg` | SEO / Open Graph |
| `public/images/logo.png` | Schema / branding |

Recommended export sizes:

- Hero: 1920×1080 (or similar 16:9)
- Fleet / destination cards: 1400×900
- Blog covers: 1200×700
- OG image: 1200×630

Use AVIF/WebP where possible; Next.js Image will optimize further.

### 7. Replace demo reviews

Edit [`content/reviews.ts`](content/reviews.ts). Remove `isDemo: true` only for verified customer feedback. Link Google reviews via `googleReviewUrl` in site config.

### 8. Fleet seating / ownership

Urbania seating and all vehicle claims come from [`content/fleet.ts`](content/fleet.ts). Set `owned` / `available` accurately — the UI will not claim ownership unless marked.

---

## Project structure

```text
app/                  # App Router pages + API
components/           # UI, layout, home, forms, fleet, gallery…
content/              # Editable business + marketing content
lib/                  # validation, email, rate-limit, seo, supabase
public/images/        # Replaceable media
supabase/             # Optional SQL schema
scripts/              # Placeholder image generator
```

## Scripts

```bash
npm run dev              # Development server (Turbopack)
npm run build            # Production build
npm run start            # Start production server
npm run lint             # ESLint
npm run format           # Prettier write
npm run generate:images  # Regenerate placeholder JPEGs
```

## Pages included

- Home (hero slider, enquiry form, trust bar, fleet, destinations, services, why us, reviews)
- About, Fleet (+ detail), Destinations (+ detail), Gallery, Reviews, Blog (+ posts)
- Contact, Privacy Policy, Terms & Conditions
- `robots.txt`, `sitemap.xml`, web manifest

## Enquiry flow

1. Client validates with Zod via React Hook Form
2. `POST /api/enquiry` re-validates server-side
3. Honeypot + basic IP rate limiting
4. Generates reference `SST-ENQ-YYYYMMDD-XXXX`
5. Sends business notification email (Resend)
6. Sends customer acknowledgement if email provided
7. Stores the enquiry for the admin inbox (local file, and Supabase when configured)
8. Returns reference for on-screen confirmation

## Deploy to Vercel

Vercel does not keep local files. **Supabase is required** so form submissions, photo uploads, destinations and blog posts survive deploys. After this one-time setup, you manage that data from `/sstadmin` — you do not ship a new build for those changes.

### 1. Push the repo to GitHub

Create a private GitHub repository, commit the project, and **do not commit `.env.local`**.

### 2. Create a Supabase project

1. New project at [supabase.com](https://supabase.com)
2. **SQL Editor** → paste and run [`supabase/production.sql`](supabase/production.sql)
3. Copy from **Project Settings → API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server only)

### 3. Import the project in Vercel

1. [vercel.com](https://vercel.com) → Add New → Project → this repo
2. Framework: **Next.js**
3. Add environment variables (Production). Change any `NEXT_PUBLIC_*` value later only with a **Redeploy**.

**Required**

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Live URL, no trailing slash |
| `NEXT_PUBLIC_BUSINESS_PHONE_DISPLAY` | Header phone text |
| `NEXT_PUBLIC_BUSINESS_PHONE` | `tel:` link |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp (`91…`, no `+`) |
| `NEXT_PUBLIC_BUSINESS_EMAIL` | Public email |
| `ADMIN_USERNAME` | `/sstadmin` login |
| `ADMIN_PASSWORD` | Strong unique password |
| `ADMIN_SESSION_SECRET` | Long random string (`openssl rand -hex 32`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role |
| `CMS_UPLOAD_BUCKET` | `cms-uploads` |

**Recommended (enquiry emails)**

| Variable | Purpose |
|---|---|
| `BUSINESS_ENQUIRY_EMAIL` | Inbox that receives form alerts |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Verified sender on your domain |

### 4. Domain

Project → Settings → Domains. Point DNS at Vercel, then set `NEXT_PUBLIC_SITE_URL` to `https://www.yourdomain.com` and Redeploy.

### 5. First login after deploy

1. Open `/sstadmin` and sign in
2. Confirm **Storage: Supabase** (not Local files)
3. Open Site, Home, Destinations, Fleet, Gallery (and other sections you use) → **Publish live**
4. Submit a test enquiry — it must appear under **Enquiries** after a refresh
5. Upload one test photo — the URL should contain `supabase.co/storage/`

After that, Destinations, Blog, photos and leads are edited in admin only. Redeploy only for code or `NEXT_PUBLIC_*` env changes.

Custom domain: Project → Settings → Domains.

## Testing checklist

- [ ] Homepage matches navy/teal premium layout on desktop and mobile
- [ ] Sticky header + mobile drawer work; active nav underline shows
- [ ] Hero autoplays (~7s), pauses on hover, supports arrows/dots/keyboard/swipe
- [ ] Quick Enquiry validates required fields and blocks double submit
- [ ] Successful enquiry returns `SST-ENQ-…` reference
- [ ] Resend delivers business + customer emails (when configured)
- [ ] Fleet “View Gallery” opens accessible fullscreen modal (Esc, focus trap, arrows)
- [ ] Popular Destinations sits directly below Our Fleet; no prices/packages
- [ ] Destination detail pages prefill enquiry destination
- [ ] Gallery tabs + lightbox work on mobile
- [ ] Contact page shows only configured details (no `REPLACE_` leakage)
- [ ] Floating WhatsApp + mobile Call/WhatsApp/Quote bar appear when configured
- [ ] Privacy / Terms / Blog / Reviews routes load
- [ ] `npm run lint` and `npm run build` pass
- [ ] Lighthouse / keyboard pass for forms and modals
- [ ] No invented stats or package prices visible

## Accessibility & SEO notes

- Semantic landmarks, focus styles, reduced-motion support, skip-to-content link
- Unique metadata, canonical URLs, Open Graph, Twitter cards, `en-IN` locale
- Organization, LocalBusiness/TravelAgency, WebSite and Service JSON-LD
- FAQPage schema matched to visible homepage FAQ content
- Destination TouristAttraction + fleet Service + blog Article schema
- Breadcrumb JSON-LD on internal detail pages
- `robots.txt`, `sitemap.xml`, web manifest, favicons / PWA icons
- Descriptive image `alt` text in content files
- Optional GA4 / GTM / Meta Pixel via environment variables
- Enquiry form fires `generate_lead` for analytics when configured

### Marketing setup (after deploy)

1. Set `NEXT_PUBLIC_SITE_URL` to your live domain
2. Add Google Search Console verification: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
3. Submit `https://your-domain/sitemap.xml` in Search Console
4. Add `NEXT_PUBLIC_GTM_ID` or `NEXT_PUBLIC_GA_MEASUREMENT_ID`
5. Optionally add `NEXT_PUBLIC_META_PIXEL_ID` for ads remarketing
6. Fill real NAP details in `content/site-config.ts` (name, address, phone)
7. Connect Google Business Profile URL and review link
8. Replace sample images with owned fleet/destination photos

## Support

After go-live, update everyday copy from `/sstadmin`. Seed/default copy still lives in the `content/` folder.
