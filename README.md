This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Run locally

1. **Install dependencies** (Node 18+):

   ```bash
   npm install
   ```

2. **Start the dev server**:

   ```bash
   npm run dev
   ```

   (Or use `yarn dev`, `pnpm dev`, or `bun dev`.)

3. **Open the app**: [http://localhost:3000](http://localhost:3000)

   The app and API run on the same origin, so all `/api/*` routes are served by this server. To point the frontend at a different backend (e.g. production), set:

   ```bash
   NEXT_PUBLIC_API_URL=https://call-pal.vercel.app npm run dev
   ```

## End-to-end flows

### Calm mode (step-by-step, themed)

1. Open **http://localhost:3000**. You see: “How would you like CallPal to feel?” with two cards.
2. Tap **“Calm & Guided”** (left card). You go to **Calm onboarding** (first time only).
3. Enter a favourite thing (e.g. “Barbie”, “cats”, “space”) and tap **“Make CallPal mine 💜”**. Theme is applied and you’re taken to **Calm Home**.
4. On **Calm Home**, tap a door tile (e.g. 🩺 Doctor). You go to **Calm Input**.
5. Type what you need (e.g. “My back has been hurting”) and tap the theme button (e.g. “Let’s do this! 💗”). You go to **Calm Confirm**.
6. On **Calm Confirm**, tap the primary button to start the call. You go to **Calm Calling** (waiting screen with transcript polling).
7. When transcript appears, you’re taken to **Calm Done**. From there use **“Back to home”** or **“Share summary”**, or use the bottom nav (Home / History / Settings).

### Power mode (quick, dark UI)

1. Open **http://localhost:3000**. Tap **“Quick & Simple”** (right card). You go to **Power Home**.
2. Optionally tap a pill (Doctor, Bank, etc.) to set context. Type in the input (e.g. “Book an appointment”) and tap **“Go →”**. You go straight to **Power Calling** (no confirm step).
3. On **Power Calling**, watch status (Calling… → Connected → Done) and the live transcript. Tap **“New call”** to return to **Power Home**.

### Settings (both modes)

- **Calm:** Bottom nav → **Settings**.
- **Power:** Bottom nav → **Settings**.

On Settings you can: edit **Name**; switch **Mode** (Calm 🌿 / Power ⚡); in Calm, change **theme** (favourite thing) and see **Caregiver**; view **About**.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

1. **Push your code to GitHub** (if you haven’t already):
   ```bash
   git add -A && git commit -m "Prepare for Vercel" && git push origin main
   ```

2. **Import the project on Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Sign in with GitHub and select the **call-pal** repo
   - Leave **Framework Preset** as Next.js (auto-detected)
   - Click **Deploy** (you can add env vars before or after the first deploy)

3. **Add environment variables**  
   In the Vercel project: **Settings → Environment Variables**. Add these (use the same values as in your local `.env.local`):

   | Name | Description |
   |------|-------------|
   | `VAPI_API_KEY` | VAPI API key |
   | `VAPI_PHONE_NUMBER_ID` | VAPI phone number ID |
   | `VAPI_CALL_TO_NUMBER` | Destination number for outbound calls (e.g. 4128440389) |
   | `MINIMAX_API_KEY` | MiniMax API key (intent extraction) |
   | `SPEECHMATICS_API_KEY` | Speechmatics API key (transcript) |
   | `DEMO_MODE` | Set to `false` for real calls |

   Then trigger a **Redeploy** (Deployments → ⋮ → Redeploy) so the new variables are used.

4. **Optional: custom domain**  
   In **Settings → Domains** you can add your own domain.

Your app and API will run at `https://your-project.vercel.app`. The frontend uses the same origin for `/api/*`, so no extra config is needed.
