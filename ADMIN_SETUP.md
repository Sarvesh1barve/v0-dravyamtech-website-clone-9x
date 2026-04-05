# Dravyam Technology - Complete Setup Guide

## Admin Access Instructions

### Step 1: Create Your Account
1. Navigate to `/login`
2. Click "Sign up"
3. Enter your email and password
4. Verify your email if needed

### Step 2: Make Yourself an Admin
Open your browser's developer console (F12 or Cmd+Option+I) and run:

```javascript
fetch('/api/make-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'your-email@example.com',
    secretKey: 'DRAVYAM_ADMIN_SECRET_2024'
  })
}).then(r => r.json()).then(console.log)
```

Replace `your-email@example.com` with your actual email.

### Step 3: Access Admin Panel
Navigate to `/admin` - you now have full admin access!

---

## Admin Panel Features

### 1. Settings Tab
Manage all website content and branding:

**Site Identity:**
- Site Name (display name)
- Site Tagline
- Site Description
- Logo Upload

**Hero Section:**
- Hero Title (main text)
- Hero Highlight (colored text - "Beyond Numbers")
- Hero Description

**Contact Information:**
- Email
- Phone Number
- Address

**Color Settings:**
- Primary Color (navy blue)
- Secondary Color
- Accent Color (golden)
- Text Color
- Heading Color

**Payment Settings:**
- UPI ID (for payments)
- QR Code Upload (payment QR)

**Social Links:**
- Twitter URL
- LinkedIn URL
- YouTube URL

### 2. Resources Tab
Manage educational content and videos:
- Upload videos with title and description
- Set video duration (e.g., "45 min")
- Add thumbnail images
- Mark resources as Free or Premium/Locked
- Set pricing for premium resources
- Categorize by: Training Videos, Market Insights, Research Sessions, etc.
- Enable/disable resources

### 3. Users Tab
Manage user accounts and subscriptions:
- View all users
- Toggle admin status
- View subscription status
- Update subscription expiration dates
- Manage user profiles

### 4. Payments Tab
Track and manage payments:
- View all payment requests
- Approve/reject payments
- See payment status (pending, completed, failed)
- View payment amounts and user info
- Payment summaries and analytics

---

## Pages Available

### Public Pages (No Login Required)
- **/** - Home page with hero, what we do, and how we work sections
- **/about** - About company
- **/products** - Product showcase
- **/how-we-work** - Detailed process workflow
- **/resources** - Learning resources (with locked content)

### Authenticated Pages
- **/login** - Login and registration
- **/dashboard** - User dashboard with subscription management
- **/admin** - Admin panel (admin only)

---

## Database Schema

### Profiles Table
- id (user ID)
- full_name
- email
- is_admin (boolean)
- is_subscribed (boolean)
- subscription_expires_at
- created_at

### Site Settings Table
- All branding and content settings
- Colors, contact info, logo
- UPI and QR code for payments
- Social media links

### Resources Table
- id, title, description
- video_url, thumbnail_url
- category, duration
- is_locked, price
- created_at, updated_at

### Payments Table
- id, user_id, resource_id
- amount, payment_type
- transaction_id, status
- created_at

### User Resources Table
- user_id, resource_id (for tracking purchases)
- purchased_at

---

## Color Scheme

**Current Navy Blue Theme:**
- Primary: #1e3a5f (Dark Navy Blue)
- Secondary: #f59e0b (Golden/Amber)
- Accent: #10b981 (Emerald Green)
- Text: #ffffff (White)
- Heading: #f59e0b (Golden)

---

## What Admins Can Do

✅ Change website logo and branding
✅ Update site name and tagline
✅ Modify hero section text ("Fintech That Thinks Beyond Numbers")
✅ Update contact information (email, phone, address)
✅ Change color scheme throughout the site
✅ Upload payment QR code and set UPI ID
✅ Add/edit/delete educational videos and resources
✅ Set resource pricing and access levels
✅ Manage user subscriptions
✅ View and approve payments
✅ Add social media links
✅ Customize "What We Do" and "How We Work" sections
✅ Manage all user accounts

---

## Getting Started

1. Deploy the app (push to GitHub, deploy to Vercel)
2. Set up Supabase bucket for file storage
3. Go to `/login` and create your account
4. Run the admin setup command in browser console
5. Navigate to `/admin` to manage everything

All changes are saved to the database immediately and reflected across the site!
