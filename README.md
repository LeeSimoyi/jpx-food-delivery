# JPX Food v4 — Online Food Ordering Platform

A complete food ordering website for Mutare, Zimbabwe, with live order tracking, functional payment processing, and a fully interactive admin dashboard.

## Project Structure

```
jpx-food-v2/
├── index.html                Homepage
├── README.md                 This file
├── DEPLOY.md                 Deployment guide
├── package.json, vercel.json, netlify.toml, site.webmanifest, .gitignore
│
├── assets/
│   ├── css/
│   │   └── main.css          Shared stylesheet (customer pages)
│   ├── js/
│   │   └── app.js            Shared logic: menu data, cart, search, navbar
│   └── icons/                Favicons and app icons
│
├── pages/                    Customer-facing pages
│   ├── menu.html             Our Menu — browse & filter all dishes
│   ├── deals.html            Flash Deals
│   ├── food-detail.html      Single dish detail + reviews
│   ├── cart.html             Shopping cart
│   ├── checkout.html         Checkout — payment processing
│   ├── tracking.html         Live order tracking
│   ├── login.html            Customer sign in
│   ├── register.html         Customer sign up
│   ├── dashboard.html        Customer account / order history
│   ├── about.html            About JPX Food
│   ├── contact.html          Contact form
│   ├── faq.html              Frequently asked questions
│   └── 404.html               Not-found page
│
└── admin/                    Staff-only admin dashboard
    ├── login.html             Admin sign in
    ├── dashboard.html          Admin dashboard UI
    └── admin.js                Admin logic: orders, menu CRUD, analytics
```

## Key Features

### Functional Payment Processing
At checkout, choosing **Card** reveals a real card-details form (number with live Visa/Mastercard brand detection, expiry, CVV) that is validated before the order is placed. Choosing **EcoCash** reveals an EcoCash number field and explains the USSD PIN confirmation step. Both payment methods (plus Cash on Delivery) run through a simulated processing overlay with step-by-step status, then show a payment-confirmed notification once complete.

### Live Order Tracking
Visit `pages/tracking.html` and enter any order ID to see a real-time progress timeline: **Order Received → Confirmed → Preparing → Out for Delivery → Delivered.** The page auto-refreshes every few seconds and the stage advances naturally based on elapsed time, or instantly when an admin manually confirms/advances the order from the admin dashboard. Once the order reaches "Out for Delivery," a named Zimbabwean courier (with phone number and a call button) appears.

### Admin Dashboard (Staff Only)
Login: `jpxfood@gmail.com` / `Admin@123`

- **Overview** — live stats: total orders, revenue, pending orders, menu item count
- **Orders** — approve, reject, or advance the status of any pending order; filter by status; search by order ID or customer name. Approving here is instantly reflected on the customer's tracking page.
- **Menu Items** — add new dishes (image upload or URL), edit, hide/show, delete
- **Customers**, **Analytics**, **Settings**
- Fully responsive with a collapsible sidebar for tablets/phones

### Functional Navbar Search
The search box on every page filters the live menu by name, category, and description, showing a dropdown with images and prices.

## Color Palette (Food Ordering)

```
--primary:  #E8470A   deep food orange-red
--primary2: #F05A1A
--accent:   #F5A623   warm amber
--dark:     #1C1101   rich espresso
--bg:       #FAF7F4   warm cream
--green:    #2E7D52   in-stock / success
```

## Tech Stack

HTML5, CSS3, Vanilla JavaScript — no frameworks or build step required. LocalStorage is used to persist the cart, customer accounts, orders, addresses, and admin data, simulating a real backend for demo purposes.

## Test Accounts

**Customer:**
- `tatenda@jpxfood.com` / `Pass@1234`
- `chipo@jpxfood.com` / `Pass@1234`

**Admin:**
- `jpxfood@gmail.com` / `Admin@123`

## Contact

Email: jpxfood@gmail.com
Phone: +263 77 123 4567
Address: 12 Herbert Chitepo St, Mutare, Zimbabwe

## Responsive Coverage

Tested and tuned for: iPhone SE, iPhone XR, iPhone 12 Pro, iPhone 14 Pro Max, Pixel 7, Galaxy S8+, Galaxy S10 Ultra, iPad Mini, iPad Air, iPad Pro, Surface Pro 7, Surface Duo, Galaxy Z Fold 5, Asus ZenBook Fold, Galaxy A51/71, Nest Hub, Nest Hub Max.

## Deploy

See `DEPLOY.md` for GitHub + Vercel/Netlify instructions.

---
© 2025 JPX Food. All rights reserved.
