# Pluto

Pluto is a two-sided fixed-price marketplace for digital projects. Clients can publish briefs, review proposals, shortlist talent, accept a proposal, and use a private workroom. Talent can complete a profile, search published projects, propose in INR, track decisions, and message the client after acceptance. Google sign-in is verified on the server. Profiles and marketplace records are stored in PostgreSQL.

## Commercial rule

The client pays **10% on top of the talent's quote**. For a ₹10,000 quote, the client total is ₹11,000 and the talent quote remains ₹10,000. Amounts are stored as integer paise; the server calculates the fee.

**Payments are not active.** Accepted proposals create a workroom and a milestone in `awaiting_funding`. No checkout, fund capture, payout, refund, or dispute settlement is implemented. Do not represent a milestone as funded or ask talent to start paid work until Razorpay onboarding and payment verification are completed.

## Local setup

1. Install Node.js 22+ and PostgreSQL.
2. Run `npm ci`.
3. Set `DATABASE_URL` to a PostgreSQL connection string and `GOOGLE_CLIENT_ID` to the Google Web OAuth client ID. Optionally set `ADMIN_EMAIL` to the Google account that should see the administration panel. See `.env.example` for names; the server does not load `.env` automatically.
4. Run `npm start` and open `http://localhost:3000/`.

The server applies SQL migrations in `db/postgres/` on startup. `GET /api/health` checks database connectivity. `npm test` runs security and validation tests; `npm run build` checks JavaScript syntax.

For local Google sign-in, add `http://localhost:3000` to the OAuth client's **Authorized JavaScript origins** in Google Cloud. For Render, also add the final `https://...onrender.com` origin (and any custom domain). The exact origin must match the browser URL. Do not put Google client secrets or database credentials in Git.

## Render deployment

The root `render.yaml` configures the Node web service. Connect this GitHub repository in Render as a Blueprint or create a Web Service with build command `npm ci && npm run build`, start command `npm start`, and health check `/api/health`. Add a persistent PostgreSQL database and set the web service's `DATABASE_URL` to its internal connection string. Use the final Render URL as an Authorized JavaScript origin in Google Cloud, then test both client and talent sign-in.

Render's free PostgreSQL option is temporary and not suitable for a production marketplace. Choose a durable database plan deliberately before inviting real users. The deployment should remain private or limited until legal pages, moderation process, payment flow, and end-to-end testing are complete. The existing GitHub Pages/static deployment cannot run the Node API.

## Design and responsive behavior

The Signal Desk interface uses separate client and talent navigation, phone-size menus, responsive forms/cards/workrooms, and locally stored background images in `assets/`. Images are decorative; text remains readable without them and motion is reduced when the user's device requests it.

## Launch checklist

- Provision durable PostgreSQL; set `DATABASE_URL` on Render.
- Add the Render origin to the Google OAuth Web client and test both roles.
- Migrate any real records from the earlier hosted prototype before directing existing users to Render. The new database starts empty; no old data is deleted by this repository.
- Add privacy policy, terms, contact/support, abuse handling, and appropriate marketplace/legal review.
- Complete Razorpay onboarding; then implement and test checkout, webhook verification, payouts, refunds/disputes, idempotency, and reconciliation before enabling funding states.
- Run real cross-role browser tests on the deployed URL and set up backups/monitoring.

## Generated visual assets

`assets/pluto-studio-hero.png` and `assets/pluto-workspace-background.png` were generated for Pluto's redesigned public and workspace surfaces. The original logo remains separate and is not baked into either background.
