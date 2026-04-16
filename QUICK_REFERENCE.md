# Dravyam Technology - Quick Reference Guide

## 🎯 QUICK START

### For Users
```
1. Go to https://your-domain.com/login
2. Click "Sign Up"
3. Enter email + password
4. Check email for confirmation link
5. Click link to verify
6. Login with your credentials
7. Access dashboard at /dashboard
```

### For Admins
```
1. Login at /login
2. Look for "Admin" button in top-right
3. Click "Admin" to go to /admin panel
4. Choose: Settings, Resources, Users, or Payments
5. Make changes and save
```

### Forgot Password?
```
1. Go to /login
2. Click "Forgot Password?" link
3. Enter your email
4. Check email for reset link
5. Click link
6. Set new password
7. Login with new password
```

---

## 🔑 ADMIN SECRET KEY

**Secret Key:** `DRAVYAM_ADMIN_SECRET_2024`

**Where to use:**
- `/admin-setup` page (if you need to become admin without direct database access)

**Never share** this key publicly

---

## 📍 IMPORTANT URLs

| Page | URL | Who Can Access |
|------|-----|---|
| Login/Signup | `/login` | Everyone |
| Dashboard | `/dashboard` | Logged in users |
| Admin Panel | `/admin` | Admins only |
| Admin Guide | `/admin/guide` | Admins (reference) |
| Admin Setup | `/admin-setup` | Everyone (with secret key) |
| Reset Password | `/reset-password` | From email link |
| Auth Callback | `/auth/callback` | From email confirmation |

---

## 🛠️ ADMIN PANEL FEATURES

### Settings Tab
- Change site colors (primary, accent, text)
- Update company branding
- Set UPI ID & QR code
- Add social media links
- Edit hero section text

### Resources Tab
- Add new videos/courses
- Edit existing resources
- Lock/unlock content
- Set pricing
- Delete resources

### Users Tab
- View all registered users
- Toggle admin status (shield icon)
- Toggle subscription status (crown icon)
- Search by email

### Payments Tab
- View payment requests
- Approve pending payments
- Reject payments
- See payment history

---

## 📱 MOBILE APP

### Install on Home Screen
1. Open app on mobile
2. Tap share/menu (three dots)
3. Tap "Add to Home Screen"
4. App installs like a native app

### Offline Mode
- Static content loads without internet
- API calls will fail but don't break app
- Works as progressive web app (PWA)

---

## 🔒 SECURITY INFO

### Passwords
- Never shared with anyone (including admins)
- Stored securely hashed by Supabase
- You control your password

### Sessions
- Login creates secure session cookie
- Session persists across page reloads
- Logout clears session
- Auto-refreshes if still active

### Admin Access
- Determined by JWT token
- Set when making user admin
- Verified on every admin action
- Can be revoked from Users tab

---

## ⚠️ COMMON ISSUES

### "Admin button not showing"
**Solution:** Logout → Login again (refresh session)

### "Email confirmation link goes to localhost"
**Status:** Fixed! ✅ Links now work on any domain

### "Can't access /admin"
**Check:**
1. Are you logged in? (go to `/login` first)
2. Are you an admin? (check `/admin` panel Users tab)
3. Try logging out and back in

### "Forgot password email not arriving"
**Check:**
1. Check spam/junk folder
2. Wait a few minutes (emails can take time)
3. Verify email address is correct

---

## 📊 DATABASE INFO

**Tables:**
- `profiles` - User account information
- `resources` - Videos and learning materials
- `user_resources` - User access to resources
- `payments` - Payment transactions
- `site_settings` - Global site configuration

**No Direct Access Needed** - Use the admin panel instead!

---

## 🚨 EMERGENCY CONTACTS

### If Something is Broken
1. Check `/SECURITY_AUDIT.md` for detailed info
2. Check `/IMPLEMENTATION_COMPLETE.md` for status
3. Look at error messages in browser console
4. Check `/admin/guide` for help

### If Database Issues
- Contact Supabase support
- Check Supabase dashboard for error logs
- Verify all environment variables are set

---

## 📚 FILE LOCATIONS

### Documentation
```
/SECURITY_AUDIT.md              - Complete security documentation
/IMPLEMENTATION_COMPLETE.md     - Full implementation summary
/EMAIL_CONFIRMATION_FIX.md      - Email flow details
/admin/guide/                   - Admin user guide
/README.md                      - Project overview
```

### Important Code
```
/app/login/page.tsx             - Login & signup
/app/admin/page.tsx             - Admin panel
/app/api/make-admin/route.ts    - Make admin API
/lib/supabase/                  - Database clients
```

---

## ✨ FEATURES

✅ User Authentication (email/password)  
✅ Email Confirmation  
✅ Password Reset  
✅ Admin Management System  
✅ Resource/Video Management  
✅ Payment Processing  
✅ User Subscriptions  
✅ Site Customization  
✅ Mobile App (PWA)  
✅ Offline Support  
✅ Security Audit  

---

## 🎓 LEARNING NEXT STEPS

1. **Explore Admin Panel**
   - Add a test resource
   - Change site colors
   - View user list

2. **Mobile Experience**
   - Install app on mobile
   - Test offline functionality
   - Check home screen

3. **User Experience**
   - Signup as new user
   - Complete email verification
   - Explore dashboard

4. **Read Documentation**
   - `/SECURITY_AUDIT.md` - Deep dive
   - `/admin/guide/` - How-to guide
   - `/EMAIL_CONFIRMATION_FIX.md` - Technical details

---

## 🔗 USEFUL LINKS

**Internal:**
- Dashboard: `/dashboard`
- Admin Panel: `/admin`
- Admin Guide: `/admin/guide`
- Reset Password: `/reset-password`

**External (after deployment):**
- GitHub: (your repo)
- Supabase Console: https://app.supabase.com
- Analytics: (configured if Vercel)

---

## 📞 SUPPORT RESOURCES

**Emergency:**
- Check debug logs: browser console (F12)
- Read error message carefully
- Try logout/login refresh
- Clear browser cache (Ctrl+Shift+Delete)

**Documentation:**
- Full guide: `/SECURITY_AUDIT.md`
- Setup help: `/admin/guide/`
- Technical: `/EMAIL_CONFIRMATION_FIX.md`

**Still Stuck?**
- Review implementation status: `/IMPLEMENTATION_COMPLETE.md`
- Check if issue is documented
- Contact development team

---

**Version:** Quick Reference 1.0  
**Last Updated:** April 16, 2026  
**Keep this handy for daily reference!** 📝
