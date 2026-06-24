# WOODLOOM Admin Guide

This guide explains how an admin or staff member uses and manages the WOODLOOM
website. It is written in simple language but includes enough detail for daily
operations.

## 1. What Is The Admin Panel?

The admin panel is the control room of the website.

Customers use the storefront to shop. Admins use the admin panel to manage:

- Dashboard overview.
- Products.
- Categories.
- Collections.
- Orders.
- Inventory.
- Customers.
- Blog articles.
- Product reviews.
- Contact messages.
- Newsletter subscribers.
- System health.

Admin route:

```text
/admin
```

Admin login route:

```text
/admin-login
```

## 2. Admin Roles

The system supports roles:

- `CUSTOMER`
- `ADMIN`
- `STAFF`

Only `ADMIN` and `STAFF` can access the admin panel.

If a customer tries to open admin pages, they are redirected away.

## 3. Admin Login Flow

1. Open `/admin-login`.
2. Enter admin email and password.
3. Website checks the database.
4. If the account has `ADMIN` or `STAFF` role, admin enters dashboard.
5. If the account is only `CUSTOMER`, access is denied.

To promote a user to admin locally:

```powershell
npm run admin:promote -- admin@example.com
```

## 4. Admin Sidebar

The admin sidebar contains links:

- Overview
- Orders
- Products
- Categories
- Collections
- Blogs
- Reviews
- Messages
- Inventory
- Customers
- System

Each link opens one management area.

## 5. Overview Dashboard

The overview dashboard gives a quick picture of the store.

It can show:

- Total revenue.
- Orders.
- Customers.
- Low-stock products.
- Recent orders.

Use this page to quickly understand store activity.

## 6. Product Management

Products are the main items sold on the website.

Admin can:

- View product list.
- Create product.
- Edit product.
- Archive product.
- Upload product images.
- Add variants/finishes.
- Set stock.
- Set price.
- Mark product as featured.

### Product Fields

Important product fields:

- Product name.
- URL slug.
- SKU.
- Category.
- Collection.
- Short description.
- Full description.
- Material.
- Dimensions.
- Care instructions.
- Warranty.
- Price.
- Compare-at price.
- Status.
- Featured flag.
- Badge.
- Images.
- Variants.

### Product Status

Common statuses:

- `DRAFT`: Product is being prepared.
- `ACTIVE`: Product is visible to customers.
- `ARCHIVED`: Product is not actively sold.

### Product Variant

A variant is a version of a product.

Example:

One chair can have finishes:

- Natural Oak.
- Walnut.
- Dark Ash.

Each variant can have:

- Finish name.
- Color.
- SKU.
- Stock.
- Reorder level.

## 7. Image Uploads

Admins can upload product images.

Allowed image types:

- JPG
- PNG
- WebP
- GIF

Maximum size:

```text
8 MB
```

Local development:

- Images can be stored in local uploads when `CLOUDINARY_UPLOAD_MODE=local`.

Production:

- Images should be uploaded to Cloudinary.
- Vercel cannot permanently store local uploaded files.

Required production variables:

```text
CLOUDINARY_UPLOAD_MODE=cloudinary
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

Check Cloudinary:

```powershell
npm run cloudinary:check
```

## 8. Category Management

Categories group products by type or room.

Examples:

- Living Room.
- Bedroom.
- Dining Room.
- Office.
- Decor.

Admin can:

- Create category.
- Edit category.
- Activate/deactivate category.
- Set image.
- Set sort order.

Categories help customers browse products easily.

## 9. Collection Management

Collections are curated product groups.

Examples:

- Scandinavian Lounge Collection.
- Modern Dining Collection.
- Accent Essentials.

Admin can:

- Create collection.
- Edit collection.
- Activate/deactivate collection.

Collections help with marketing and curated shopping.

## 10. Order Management

Orders are created when a logged-in customer checks out.

Order data includes:

- Order number.
- Customer.
- Shipping address.
- Items.
- Quantity.
- Product SKU.
- Payment method.
- Payment status.
- Order status.
- Total amount.

### Order Status Flow

A simple order journey:

1. Customer places order.
2. Order becomes confirmed.
3. Inventory is reserved.
4. Admin processes order.
5. Order moves through shipping stages.
6. Order is delivered.

If cancelled:

- Inventory reservation is released or adjusted.

If returned:

- Return request is created.
- Inventory flow is updated based on return status.

### Handling Order Questions

If a customer asks, "Where is my order?":

1. Open admin orders.
2. Search by order number or customer.
3. Check status.
4. Tell customer the current status.

If customer asks to cancel:

1. Check order status.
2. If order is not delivered/cancelled/returned, cancellation may be allowed.
3. Cancel from admin or guide user to account orders.

If customer asks for return:

1. Check if order is delivered.
2. If delivered, user can request return from account.
3. Admin can review returned order flow.

## 11. Inventory Management

Inventory means stock.

Admin uses inventory page to see:

- Product variants.
- Stock count.
- Reserved count.
- Available count.
- Reorder level.

Definitions:

- `Stock`: Total units available in warehouse.
- `Reserved`: Units held for confirmed orders.
- `Available`: Stock minus reserved.
- `Reorder at`: When stock is low and admin should restock.

Inventory warning:

If stock is low, admin should restock before customers place more orders.

Reconcile inventory:

```powershell
npm run inventory:reconcile
```

## 12. Customer Management

The customers page helps admin view customer accounts.

Admin can check:

- Name.
- Email.
- Phone.
- Account status.
- Order count.
- Created date.

Use this when handling support requests.

## 13. Blog Management

Blog articles appear on the public journal/blog page.

Admin can:

- Create article.
- Edit article.
- Publish article.
- Unpublish article.

Blog fields:

- Title.
- Slug.
- Excerpt.
- Content.
- Image URL.
- Author/category label.
- Published status.

If no database blog exists, the public blog can still show static fallback
articles.

## 14. Review Moderation

Customers can submit product reviews.

Admin reviews page shows:

- Product.
- Customer name.
- Customer email.
- Rating.
- Review content.
- Visible/hidden status.

Admin can:

- Hide review.
- Show review.
- Delete review.

When to hide a review:

- It contains spam.
- It contains bad language.
- It is not related to the product.
- It shares private information.

When to delete a review:

- It is clearly fake or abusive.
- It contains dangerous content.
- It was submitted by mistake and must be removed.

## 15. Contact Messages

Customers can submit contact messages from the contact page.

Admin messages page shows:

- Name.
- Email.
- Phone.
- Subject.
- Message.
- Status.
- Date.

Message statuses:

- `NEW`: Not handled yet.
- `READ`: Admin has seen it.
- `RESOLVED`: Issue is handled.

How to handle a query:

1. Open admin messages.
2. Read the subject and message.
3. Reply to the customer using email or phone.
4. Mark message as `READ`.
5. When completed, mark as `RESOLVED`.

## 16. Newsletter Subscribers

Newsletter subscribers are people who entered their email in the footer form.

Admin can:

- See subscriber email.
- See source.
- See status.
- Mark subscriber active or unsubscribed.

Use this list for marketing emails only when email rules and customer consent
are followed.

## 17. System Health Page

Admin route:

```text
/admin/system
```

Public health route:

```text
/api/health
```

System health checks:

- Database.
- Auth secret.
- Cloudinary.
- Email.
- App URL.

Statuses:

- `ok`: Working.
- `warning`: Works locally or partly configured.
- `error`: Needs fixing.

Example:

If Cloudinary is missing in production, image uploads may fail. The system page
will show Cloudinary as warning or error.

## 18. Environment Setup

Important production variables:

```text
DATABASE_URL
AUTH_SECRET
NEXT_PUBLIC_APP_URL
CLOUDINARY_UPLOAD_MODE
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
EMAIL_DELIVERY_MODE
SMTP_HOST
SMTP_PORT
SMTP_SECURE
SMTP_USER
SMTP_PASS
SMTP_FROM
```

Generate auth secret:

```powershell
npm run auth:secret
```

Check environment:

```powershell
npm run env:check
```

## 19. Production Database Warning

Vercel cannot use:

```text
localhost:1433
```

That is only your local computer.

For production, use a hosted database that Vercel can reach.

Until hosted database is configured:

- Public static pages can work.
- Admin database features may fail.
- Login/register may fail.
- Orders may fail.
- Reviews/messages/newsletter may fail.

## 20. Common Admin Problems And Fixes

### "Admin login does not work"

Check:

- Database is connected.
- User exists.
- User role is `ADMIN` or `STAFF`.
- Password is correct.
- `AUTH_SECRET` is configured in production.

### "Product image upload fails"

Check:

- File is JPG, PNG, WebP, or GIF.
- File is under 8 MB.
- Cloudinary keys are set in production.
- `CLOUDINARY_UPLOAD_MODE=cloudinary` in production.

### "Order cannot be placed"

Check:

- Customer is logged in.
- Cart has items.
- Product variants exist.
- Stock is available.
- Address exists.
- Database is connected.

### "OTP email is not received"

Check:

- `EMAIL_DELIVERY_MODE=smtp`.
- SMTP host/user/password/from are correct.
- Gmail app password is used if using Gmail.
- Customer checked spam folder.

### "Admin page shows empty data"

Possible reasons:

- No records exist yet.
- Database table is missing.
- Database connection is wrong.
- Production database is not configured.

### "Health endpoint returns 503"

This means one or more important systems are not ready.

Open:

```text
/admin/system
```

Then check which item is `error`.

## 21. Daily Admin Checklist

Every day, admin should check:

1. System health.
2. New orders.
3. Low inventory.
4. New contact messages.
5. New reviews.
6. Product stock.
7. Failed uploads or missing images.

## 22. Safe Admin Rules

- Do not share admin password.
- Do not share OTP.
- Do not commit `.env`.
- Do not expose API keys.
- Confirm before deleting important records.
- Keep product prices correct.
- Test checkout after major changes.
- Check health page after deployment.

## 23. Full Admin Work Flow Example

Example: A new product arrives.

1. Admin logs in.
2. Opens products.
3. Clicks new product.
4. Enters product details.
5. Adds category and collection.
6. Adds variants and stock.
7. Uploads images.
8. Sets status to `ACTIVE`.
9. Saves product.
10. Opens storefront product page.
11. Checks image, price, description, cart, and checkout flow.

Example: A customer asks about a delayed order.

1. Admin opens messages or orders.
2. Finds customer or order number.
3. Checks order status.
4. Replies to customer.
5. Marks message as resolved.
6. Updates order status if needed.

