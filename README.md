# WOODLOOM

WOODLOOM is a Next.js furniture storefront with customer auth, cart,
wishlist, checkout, account addresses, admin product/order/inventory tools,
blog management, reviews, contact messages, and newsletter capture.

## Local Development

```powershell
npm install
npm run dev
```

The app expects SQL Server for full backend behavior. Copy `.env.example` to
`.env` and set `DATABASE_URL`.

Useful commands:

```powershell
npm run lint
npm run build
npm run env:check
npm run auth:secret
npm run cloudinary:check
npm run admin:promote -- admin@example.com
```

Health check routes:

```text
/api/health
/admin/system
```

## Database

Prisma models cover users, addresses, products, variants, cart, wishlist,
orders, payments, returns, reviews, blogs, contact messages, and newsletter
subscribers.

Normally schema updates are applied with:

```powershell
npx prisma db push
```

If Prisma CLI hits a local SQL Server TLS issue, verify the app can still
connect with the configured `DATABASE_URL`, then apply the missing tables from
SQL Server tools.

## Production Checklist

Before relying on the Vercel deployment for real users, configure these Vercel
environment variables:

```text
DATABASE_URL
AUTH_SECRET
NEXT_PUBLIC_APP_URL
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
CLOUDINARY_UPLOAD_MODE
EMAIL_DELIVERY_MODE
SMTP_HOST
SMTP_PORT
SMTP_SECURE
SMTP_USER
SMTP_PASS
SMTP_FROM
```

Razorpay is still disabled in the UI. Add these only when enabling online
payments:

```text
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
NEXT_PUBLIC_RAZORPAY_KEY_ID
```

Important: Vercel cannot use a local SQL Server URL such as
`localhost:1433`. Production needs a hosted database endpoint that Vercel can
reach.

Generate `AUTH_SECRET` with:

```powershell
npm run auth:secret
```

Use the printed value in Vercel. Do not commit it to git.

## Image Uploads

Local development can use:

```text
CLOUDINARY_UPLOAD_MODE=local
```

Production should use Cloudinary:

```text
CLOUDINARY_UPLOAD_MODE=cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

The admin uploader accepts JPG, PNG, WebP, and GIF images up to 8 MB.

## Deployment

```powershell
npm run lint
npm run build
npm run env:check
npx --yes vercel@latest deploy --prod --yes
```
