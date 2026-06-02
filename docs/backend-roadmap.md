# Backend Roadmap

The current storefront is frontend-first. The Prisma schema now defines the data contract for the SRS flow, and Prisma Client is installed/generated. Runtime database queries are ready to be added once a real SQL Server `DATABASE_URL` is configured.

## Next Backend Steps

1. Configure `.env` from `.env.example` with the SQL Server connection string.

2. Regenerate the Prisma client after schema changes:
   `npx prisma generate`

3. Create the first migration:
   `npx prisma migrate dev --name init`

4. Replace local/mock surfaces in this order:
   - Products and categories
   - Authentication and account profile
   - Cart and wishlist
   - Checkout, Razorpay payment, and order creation
   - Admin order/product/inventory management

## SRS Coverage

- Customer accounts: `User`, `Address`
- Product catalog: `Category`, `Collection`, `Product`, `ProductImage`, `ProductVariant`
- Cart and wishlist: `CartItem`, `WishlistItem`
- Checkout and orders: `Order`, `OrderItem`, `Payment`
- After-sales flow: `ReturnRequest`, `Review`
- Content: `BlogPost`
