# WOODLOOM User Guide

This guide explains how a normal customer uses the WOODLOOM website. It is
written in simple language so even a new user can understand what happens on
each page.

## 1. What Is WOODLOOM?

WOODLOOM is an online furniture store. A customer can visit the website, look at
furniture, save favorite items, add items to the cart, place an order, manage
addresses, check orders, request cancellation or return, and write product
reviews.

Think of it like a digital furniture showroom. Instead of walking inside a
physical shop, the customer opens the website and explores products on screen.

## 2. Main Customer Pages

### Home Page

The home page is the first page most people see. It introduces the brand and
shows important sections:

- Hero section with the main brand message.
- Furniture collections.
- Featured products.
- Room inspiration.
- Journal/blog articles.
- Newsletter form.
- Footer links.

What the customer can do here:

- Click a collection to browse furniture by room.
- Click a product to open its detail page.
- Use the navbar icons for search, account, wishlist, cart, and admin login.
- Switch between light and dark theme.

### Products Page

The products page shows all available products.

What the customer can do:

- Browse all furniture items.
- Click a product card.
- See product image, name, material, category, and price.

### Product Detail Page

This page explains one product in detail.

Important parts:

- Product gallery.
- Product title and price.
- Product description.
- Finish selector.
- Quantity selector.
- Add to cart button.
- Wishlist button.
- Product details, materials, care, shipping, and return information.
- Reviews section.

Customer flow:

1. Open a product.
2. Choose the finish, like Walnut or Natural Oak.
3. Choose quantity.
4. Click `Add To Cart`.
5. The website sends the customer to the cart.

Reviews:

- Logged-out users can read reviews.
- Logged-in users can submit a review.
- A user can write one review per product. If they submit again, the review is
  updated.

### Furniture Category Pages

These pages group furniture by room:

- Living Room
- Bedroom
- Dining Room
- Office
- Decor

Customers use these pages when they already know what room they are shopping
for.

### Inspiration Page

The inspiration page shows room styling ideas. It helps customers imagine how
furniture may look inside a real home.

Customers can click an inspiration card to browse matching furniture.

### Search Page

The search page helps customers find products or categories quickly.

Customer flow:

1. Click the search icon in the navbar.
2. Type a word, like `sofa`, `table`, or `bed`.
3. View matching results.
4. Click a result to open it.

### Wishlist Page

The wishlist is for saving items the customer likes but may not buy right now.

Customer flow:

1. Open a product.
2. Click the heart icon.
3. Product is saved to wishlist.
4. Open wishlist from the navbar.
5. Add wishlist item to cart or remove it.

Important note:

- Guests use browser storage.
- Logged-in users can sync wishlist with their account when the database is
  available.

### Cart Page

The cart holds items before checkout.

Customers can:

- See selected products.
- Increase quantity.
- Decrease quantity.
- Remove an item.
- See subtotal, delivery charge, and total.
- Continue to checkout.

Customer flow:

1. Add product to cart.
2. Open cart.
3. Check quantity and price.
4. Click `Proceed To Checkout`.

### Checkout Page

Checkout is protected. This means the user must be logged in before placing an
order.

If the user is not logged in:

1. User clicks checkout.
2. Website sends them to login.
3. After login, user can continue checkout.

Checkout parts:

- Delivery address.
- Saved address selector.
- New address form.
- Payment method.
- Order summary.
- Place order button.

Current payment:

- Cash on Delivery is active.
- Razorpay is visible as a future option but disabled for now.

Address behavior:

- A user can save an address once.
- Saved addresses can be reused in future checkout.
- New checkout addresses can be saved for next time.

### Order Success Page

After placing an order, the success page confirms the request.

It shows:

- Order number.
- Items ordered.
- Address snapshot.
- Payment method.
- Total amount.

### Account Pages

The account area is for logged-in customers.

Pages include:

- Account overview.
- Profile.
- Addresses.
- Orders.
- Wishlist.

#### Profile

The user can view or update personal details.

#### Addresses

The user can:

- Add address.
- Edit address.
- Delete address.
- Mark an address as default.

#### Orders

The user can:

- See order history.
- See order status.
- See payment status.
- See items inside an order.
- Cancel eligible orders.
- Request return for delivered orders.

Order cancellation:

- Allowed for early order statuses like pending, confirmed, processing, or
  packed.
- Not allowed after delivery, cancellation, or return flow.

Return request:

- Allowed only after the order is delivered.
- User must give a reason.

### Login Page

Customers can login using email and password.

Flow:

1. Enter email.
2. Enter password.
3. Click login.
4. Website checks the database.
5. If correct, user enters account area.

### Register Page

New customers can create an account.

Flow:

1. Enter name, email, phone, and password.
2. Submit the form.
3. Website creates customer account.
4. Customer can login and shop.

### OTP Login And Forgot Password

OTP means one-time password.

Flow:

1. User enters email.
2. Website creates a 6-digit OTP.
3. In local mode, OTP is shown for development.
4. In SMTP mode, OTP is sent by email.
5. User enters OTP.
6. Website verifies it.

Forgot password works similarly:

1. User asks for reset OTP.
2. User verifies OTP.
3. User sets a new password.

### Contact Page

Customers can send a message to WOODLOOM.

Form fields:

- Name.
- Email.
- Phone.
- Subject.
- Message.

When submitted:

- If database is available, message is saved.
- If database is unavailable, development email logging is used.
- Admin can later view messages in the admin panel.

### Newsletter

Customers can subscribe from the footer.

Flow:

1. Enter email.
2. Click subscribe.
3. Email is saved as a subscriber when database is available.

## 3. Theme: Light And Dark Mode

The website supports light and dark theme.

How it works:

- User clicks the theme button.
- Website changes colors.
- The selected mode is saved.
- Next time the user opens the site, the theme can remain selected.

## 4. Simple Shopping Flow

This is the main customer journey:

1. User opens home page.
2. User browses products.
3. User opens a product detail page.
4. User selects finish and quantity.
5. User clicks add to cart.
6. User opens cart.
7. User clicks checkout.
8. Website asks user to login if needed.
9. User selects or adds address.
10. User selects Cash on Delivery.
11. User places order.
12. User sees order success page.
13. User can later view order in account orders.

## 5. Common Customer Questions And Answers

### "Why can I not checkout?"

Most likely the user is not logged in. Checkout needs login so the website knows
who is placing the order.

What to do:

- Ask the user to login.
- Then return to checkout.

### "Why is Razorpay disabled?"

Online payment is not active yet. Cash on Delivery works. Razorpay will work
after payment keys and backend verification are added.

### "Why did my cart disappear?"

Possible reasons:

- User changed browser or device while not logged in.
- Browser local storage was cleared.
- Account sync needs database connection.

What to do:

- Ask user to login before shopping.
- Check if account cart sync is working.

### "Why can I not upload or see product images?"

Customers do not upload product images. Admin uploads images. If product images
are not showing, it may be an image provider or network issue.

### "Why did I not receive OTP email?"

Possible reasons:

- Email delivery is still in console/local mode.
- SMTP is not configured.
- Email went to spam.
- Email address was typed wrong.

What to do:

- In development, check server console.
- In production, check SMTP setup.

### "How do I return an item?"

The user must wait until the order is delivered. Then:

1. Open account orders.
2. Find the delivered order.
3. Click request return.
4. Enter reason.
5. Submit.

### "How do I cancel an order?"

If order is not too far in shipping:

1. Open account orders.
2. Find the order.
3. Click cancel order.

If the order is already delivered or returned, cancellation is not allowed.

## 6. Important Customer Safety Rules

- Never share password with anyone.
- Do not share OTP except inside the official WOODLOOM website.
- Check product quantity and address before placing order.
- Use correct email and phone number.
- Contact support for order issues.

## 7. What Still Needs Production Setup

Some features need production environment variables:

- Hosted database for Vercel.
- Auth secret.
- Cloudinary for image uploads.
- SMTP for real email.
- Razorpay if online payment is enabled later.

