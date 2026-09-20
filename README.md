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

### Gmail verification email

Use a Google app password for `SMTP_PASS`; do not use your regular Gmail
password. First enable 2-Step Verification on the Google account, then create
an app password in the Google Account security settings. Keep the generated
password private and do not commit it.

For local development, add these values to `.env.local`:

```text
EMAIL_DELIVERY_MODE=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail-address@gmail.com
SMTP_PASS=your-16-character-google-app-password
SMTP_FROM=your-gmail-address@gmail.com
```

Restart the Next.js server after changing `.env.local`, then run
`npm run env:check`. The signup, login OTP, and password-reset verification
emails will use this Gmail account.

Razorpay is available when these keys are configured:

```text
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
NEXT_PUBLIC_RAZORPAY_KEY_ID
```

Until Razorpay is configured, selecting Razorpay at checkout opens the
temporary UPI payment page. Set these public variables to the store's real
payment details:

```text
NEXT_PUBLIC_TEMP_PAYMENT_UPI_ID
NEXT_PUBLIC_TEMP_PAYMENT_PHONE
NEXT_PUBLIC_TEMP_PAYMENT_EMAIL
NEXT_PUBLIC_TEMP_PAYMENT_BACKUP_EMAIL
NEXT_PUBLIC_TEMP_PAYMENT_QR_IMAGE
```

`NEXT_PUBLIC_TEMP_PAYMENT_QR_IMAGE` is optional. When omitted, the page
generates a QR image from `NEXT_PUBLIC_TEMP_PAYMENT_UPI_ID`.

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

### IIS/Plesk deployment

For the IIS/Plesk deployment configured by `web.config`, build on the server
after uploading the source and before restarting the Node application:

```powershell
cd C:\Inetpub\vhosts\shissoo.com\httpdocs
npm install
npm run build
```

The `.next` directory must be uploaded or generated in that same `httpdocs`
directory. In particular, `.next\prerender-manifest.json` must exist before
IIS/iisnode starts `app.js`; do not copy only `.next\static` or the source
files. Restart the domain's Node.js application after the build completes.
