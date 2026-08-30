# DataHub — Landing Site

Marketing landing page for **DataHub** — data analytics, dashboards, automation,
and custom software. Built to be self-hosted on your own server (alongside the
PCL system), with a secure contact pipeline that stores leads in PostgreSQL and
emails you on every submission.

## Stack

| Layer            | Technology                                            |
| ---------------- | ----------------------------------------------------- |
| Frontend/Backend | Next.js 16 (App Router) · React 19 · TypeScript       |
| Styling          | Tailwind CSS v4 · pure-CSS entrance animations        |
| Database         | PostgreSQL 16 · Prisma 6 ORM                           |
| Email            | Nodemailer over SMTP (e.g. Gmail SMTP)                |
| Rate limiting    | Redis (optional) with in-memory fallback              |
| Delivery         | Docker + docker-compose, behind your existing Nginx   |

## Security features

Security is the priority. The contact endpoint and app are hardened with:

- **Strict input validation** (Zod) — every field length-bounded and sanitized.
- **Honeypot** field — bot submissions are silently dropped (no DB write, no
  disclosure that the trap exists).
- **Rate limiting** — per-IP fixed window (default 5 / 10 min), Redis-backed with
  an in-memory fallback so the limit holds even if Redis is down.
- **No raw IP storage** — only a salted SHA-256 hash of the IP is recorded.
- **HTML-escaped emails** — user input is escaped before being placed in the
  notification email (no header/HTML injection).
- **Security headers / CSP** — a strict **nonce-based** Content-Security-Policy
  (`'strict-dynamic'`, no `'unsafe-inline'` for scripts) is set per-request in
  `src/proxy.ts`; static headers (HSTS, X-Frame-Options: DENY, nosniff,
  Referrer-Policy, Permissions-Policy) are in `next.config.ts`. The home page is
  rendered dynamically so the nonce is stamped onto framework scripts.
- **Secrets only in env** — nothing sensitive is bundled to the browser.
- **Runs as a non-root user** inside the container; database port is not exposed
  to the host.

---

## Local development

```bash
npm install
cp .env.example .env          # fill in values (at minimum DATABASE_URL)
npm run db:deploy             # apply migrations to your local/dev Postgres
npm run dev                   # http://localhost:3000
```

> The site renders fully without a database. The **contact form** only persists
> once `DATABASE_URL` points at a reachable Postgres and migrations are applied.

### Useful scripts

| Script               | What it does                               |
| -------------------- | ------------------------------------------ |
| `npm run dev`        | Start dev server                           |
| `npm run build`      | `prisma generate` + production build       |
| `npm run start`      | Run the production build                   |
| `npm run db:deploy`  | Apply migrations (`prisma migrate deploy`) |
| `npm run db:migrate` | Create a new migration in dev              |
| `npm run db:studio`  | Browse/manage leads in Prisma Studio       |

---

## Deploying on your server (Docker)

The whole stack — web app, PostgreSQL, Redis, and the migration step — is defined
in `docker-compose.yml`.

1. **Copy the project to the server** (same box as PCL is fine).

2. **Create the env file** next to `docker-compose.yml`:

   ```bash
   cp .env.example .env
   ```

   Fill in real values. Generate a strong `IP_HASH_SALT` with any of these
   (all produce a 32-byte hex string — no extra tools to install):

   ```bash
   # Node (cross-platform — works on Windows, macOS, Linux)
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

   # Linux / macOS (or Windows with Git Bash)
   openssl rand -hex 32
   ```

   ```powershell
   # Windows PowerShell (no install needed)
   $b = New-Object byte[] 32; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b); ($b | ForEach-Object { $_.ToString('x2') }) -join ''
   ```

   Also set a strong `POSTGRES_PASSWORD` and use the same password in
   `DATABASE_URL`.

   For Gmail SMTP, create an **App Password** (not your login password) and set
   `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`. Leads are delivered to
   `CONTACT_NOTIFY_EMAIL`.

3. **Build and start:**

   ```bash
   docker compose up -d --build
   ```

   The `migrate` service applies the database schema automatically before `web`
   starts. The app listens on `127.0.0.1:3000` (localhost only — Nginx fronts it).

4. **Check health:**

   ```bash
   curl http://127.0.0.1:3000/api/health    # {"ok":true,...}
   docker compose logs -f web
   ```

### Nginx + subdomain

An example server block is in [`nginx/datahub.conf`](nginx/datahub.conf).

1. Point a DNS record at your server in **Wazohost**:
   - `www.datahub.co.tz` → A record → your server IP (and/or `datahub.co.tz`).
2. Add the rate-limit zone to the `http { }` block of `/etc/nginx/nginx.conf`:
   ```nginx
   limit_req_zone $binary_remote_addr zone=datahub_api:10m rate=10r/m;
   ```
3. Install the config and get a TLS cert:
   ```bash
   sudo cp nginx/datahub.conf /etc/nginx/sites-available/datahub.conf
   sudo ln -s /etc/nginx/sites-available/datahub.conf /etc/nginx/sites-enabled/
   sudo certbot --nginx -d datahub.co.tz -d www.datahub.co.tz
   sudo nginx -t && sudo systemctl reload nginx
   ```

### Viewing leads

```bash
# Quick look via psql inside the db container:
docker compose exec db psql -U datahub -d datahub -c \
  "select created_at, name, email, phone, company, service, source from leads order by created_at desc limit 20;"

# Which marketing channel is actually producing leads:
docker compose exec db psql -U datahub -d datahub -c \
  "select coalesce(source, 'direct') as source, count(*) from leads group by 1 order by 2 desc;"

# Or browse with Prisma Studio (run from a machine with DATABASE_URL set):
npm run db:studio
```

---

## Updating content

All copy and sections live in `src/components/site/` (`Hero`, `Services`,
`Process`, `WhyUs`, `Founder`, `Contact`, `Footer`). Brand colors and theme
tokens are in `src/app/globals.css`. Site metadata/SEO is in
`src/app/layout.tsx`, and the social link-preview card is generated by
`src/app/opengraph-image.tsx`.

Public contact details (email, WhatsApp) are **not** hardcoded in components —
they come from `src/lib/contact-info.ts`, which reads the `NEXT_PUBLIC_*` env
vars below.

---

## Contact & WhatsApp configuration

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Email address shown on the page |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Digits only, with country code, no `+` or spaces (e.g. `255712345678`). **Leave empty to hide every WhatsApp button.** |
| `NEXT_PUBLIC_WHATSAPP_DISPLAY` | How the number is shown to visitors (optional) |
| `NEXT_PUBLIC_WHATSAPP_MESSAGE` | First message pre-filled in the visitor's WhatsApp (optional) |

> `NEXT_PUBLIC_*` values are **inlined at build time**, not read at runtime.
> Changing them requires a rebuild:
> `docker compose up -d --build web`
> They must also be listed as build `args` in `docker-compose.yml` and as
> `ARG`/`ENV` pairs in the `Dockerfile` — both are already wired up.

---

## Campaign attribution (`?ref=`)

Any link to the site can carry a `?ref=` or `?utm_source=` tag:

```
https://www.datahub.co.tz/?ref=instagram
```

The contact form reads it on load, submits it with the lead, and it is stored in
`leads.source` and shown as a **"Came from"** line in the notification email —
so you can see which channel each enquiry came from.

Tags are sanitised on the client and re-validated on the server: lowercase
letters, digits, `_` and `-` only, max 40 characters. Anything else is rejected.

The tags in use are listed in [`marketing/README.md`](marketing/README.md).

---

## Marketing

`marketing/` holds the social campaign: the playbook, a dated posting schedule,
the brand sheet for making posters, and ready-to-post bilingual captions
(English + Kiswahili) for both feed posts and WhatsApp Status.

```
marketing/
├── README.md              # playbook: cadence, ref tags, what to do with a lead
├── posting-schedule.md    # dated 30-day calendar
├── brand/                 # colours, type, poster rules
├── posts/                 # feed posts (every 3 days) — caption.md + poster.png
└── status/                # Status / Story (near-daily) — caption.md + poster.png
```

Posters are **not** committed as site assets — they live beside their captions
in `marketing/`. Nothing in `marketing/` is served by the app.
