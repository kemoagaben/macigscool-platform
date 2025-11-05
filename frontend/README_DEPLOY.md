# MagicScool Frontend Deployment Guide

This frontend is a React single page application built with Vite and
Tailwind CSS. It is designed to consume the MagicScool backend API
through the helper in `src/services/api.js`.

## Development

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` if your
backend is not running on the default `http://localhost:5000/api`.

3. Start the development server:

```bash
npm run dev
```

The app will be served at the address shown by Vite (usually
`http://localhost:5173`). API requests will be proxied to the URL
configured in your `.env` file.

## Production

When deploying to a static host such as Cloudflare Pages or Netlify
you should build the application and then serve the files in
`frontend/dist`.

```bash
npm run build
```

The `_redirects` file in `public/` ensures client side routing works
correctly on hosts that support it (e.g. Netlify, Cloudflare Pages). The
`_headers` file instructs the CDN to cache static assets aggressively
while always fetching the latest `index.html`.

If you deploy on Cloudflare Pages and wish to proxy `/api/*` requests
to your backend, you can implement a Pages Function in
`functions/api/[[path]].js` and set `BACKEND_ORIGIN` in your
project’s environment variables. The development server configuration
still applies as described above.