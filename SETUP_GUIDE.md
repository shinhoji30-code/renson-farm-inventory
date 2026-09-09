# RENSON FARM INVENTORY - COMPLETE SETUP GUIDE

A modern, responsive web-based inventory and expense/receipt management system for Renson Farm.

## 🚀 Quick Start

### Prerequisites
- GitHub account
- Supabase account (free tier available at https://supabase.com)
- Modern web browser (Chrome, Firefox, Safari, Edge)

---

## 📋 Step 1: SUPABASE CONFIGURATION

### Create a Supabase Project

1. Go to https://supabase.com
2. Click **"New Project"** or **"Start your project"**
3. Sign in or create a free account
4. Fill in the project details:
   - **Name**: `renson-farm-inventory` (or any name you prefer)
   - **Database Password**: Create a strong password (save it safely)
   - **Region**: Choose closest to your location
5. Click **"Create new project"** and wait for it to initialize (2-3 minutes)

### Get Your API Keys

1. In your Supabase dashboard, click **"Settings"** (bottom-left gear icon)
2. Click **"API"** in the left menu
3. You'll see:
   - **Project URL** (looks like `https://xxxxxxxxxxxxx.supabase.co`)
   - **Project API keys** section with:
     - **public / anon key** (safe to use in frontend)
     - **service_role key** (NEVER expose in frontend!)

4. Copy your **Project URL** and **anon key**

### Configure the Frontend

1. Open `supabase.js` in your repository
2. Find these lines at the top:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```
3. Replace with your actual values:
   ```javascript
   const SUPABASE_URL = 'https://xxxxxxxxxxxxx.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5...';
   ```
4. Save the file and commit to GitHub

---

## 📦 Step 2: CREATE DATABASE TABLES

### Run SQL Setup Script

1. Go back to your Supabase dashboard
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New Query"**
4. Open `SUPABASE_SETUP.sql` from your repository
5. Copy the ENTIRE contents
6. Paste into the SQL Editor
7. Click **"Run"** button (top-right)
8. You should see a success message

### What This Creates:

✅ **receipts** table with columns:
- `id` - Auto-incrementing primary key
- `receipt_date` - Date of the receipt
- `details` - Description of the purchase
- `category` - Category (Feeds, Fuel, Farm Supplies, etc.)
- `amount` - Amount in PHP (numeric)
- `image_url` - Public URL to the receipt image
- `image_path` - Internal storage path
- `created_at` - Timestamp when created
- `updated_at` - Timestamp when last updated

✅ **Indexes** for fast queries on:
- receipt_date
- category
- created_at
- Full-text search on details

✅ **Row Level Security (RLS)** policies:
- Public read access (anyone can view)
- Public insert access (anyone can add)
- Public update access (anyone can edit)
- Public delete access (anyone can delete)

✅ **Storage bucket** named "receipts":
- Public read access
- Allow uploads and deletions

---

## 🪣 Step 3: VERIFY STORAGE BUCKET

1. In Supabase dashboard, click **"Storage"** in the left sidebar
2. You should see a bucket named **"receipts"**
3. Click on it to verify
4. You can see the folder structure: `receipts/YEAR/MONTH/filename.jpg`

If the bucket doesn't exist, create it manually:
1. Click **"New bucket"**
2. Name: `receipts`
3. Check **"Public bucket"**
4. Click **"Create bucket"**

---

## 🌐 Step 4: GITHUB PAGES DEPLOYMENT

### Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"**
3. Click **"Pages"** in the left sidebar
4. Under "Build and deployment":
   - Source: Select **"Deploy from a branch"**
   - Branch: Select **"main"**
   - Folder: Select **"/ (root)"**
5. Click **"Save"**
6. Wait 1-2 minutes for deployment
7. Your site URL will appear at the top (looks like `https://shinhoji30-code.github.io/renson-farm-inventory/`)

---

## 📁 FILE STRUCTURE

```
renson-farm-inventory/
├── index.html              # Main dashboard page
├── add-receipt.html        # Form to add new receipt
├── receipts.html           # List of all receipts
├── reports.html            # Reports and analytics
├── settings.html           # Settings and help
├── style.css               # Main stylesheet (responsive design)
├── app.js                  # Main application logic
├── supabase.js             # Supabase configuration and functions
├── SUPABASE_SETUP.sql      # Database setup script
├── SETUP_GUIDE.md          # This file
└── README.md               # Project overview
```

---

## 🎯 FEATURES

### Dashboard
- **Total Expenses** - Sum of all receipts
- **Total Receipts** - Count of all records
- **This Month** - Total expenses for current month
- **This Year** - Total expenses for current year
- **Recent Transactions** - Latest 6 receipts
- **Category Summary** - Breakdown by category
- **Search & Filter** - Find receipts by date, category, or text

### Add Receipt / Expense
- 📷 **Capture Photo** - Use phone camera
- 📁 **Upload Photo** - Upload from device
- 👁️ **Preview** - See image before saving
- 📝 **Enter Details** - Description of purchase
- 💰 **Enter Amount** - Cost in Philippine Peso
- 📅 **Select Date** - Receipt date (default: today)
- 📦 **Select Category** - Choose from 9 categories

### Receipts List
- 📋 **Desktop Table View** - Full-featured table
- 📱 **Mobile Card View** - Responsive cards
- 🖼️ **Photo Preview** - Click to view full size
- ✏️ **Edit** - Modify any receipt
- 🗑️ **Delete** - Remove receipt with confirmation
- 🔍 **Search** - Find by details, category, amount
- 🗓️ **Filter** - By date range or category

### Reports
- 📊 **Total Expenses** - Overall spending
- 📈 **Monthly Breakdown** - Expenses per month
- 📅 **Yearly Breakdown** - Expenses per year
- 📦 **By Category** - Spending distribution
- 📥 **Export to CSV** - Download data
- 🖨️ **Print** - Print reports

### Settings
- ℹ️ **System Info** - Version and database details
- ⚙️ **Configuration** - Supabase status
- 💾 **Backup** - Export all data as CSV
- 🗑️ **Data Management** - Delete all receipts
- ❓ **Help** - Features and categories

---

## 🔐 SECURITY

### What's Safe to Share
- ✅ Supabase **Project URL** (public)
- ✅ Supabase **anon/public key** (public)
- ✅ GitHub repository code (public)

### What's NOT Safe to Share
- ❌ Supabase **service_role_key** (secret!)
- ❌ Supabase **database password** (secret!)
- ❌ Any API secrets or tokens

### Row Level Security (RLS)
The system uses Supabase RLS policies to control access:
- Everyone can read receipts
- Everyone can add receipts
- Everyone can edit receipts
- Everyone can delete receipts

**Note**: For production use with multiple users, you'd want to add user authentication and restrict access per user.

---

## 💾 CATEGORIES

Choose from these 9 categories when adding receipts:

1. **Feeds** - Animal feed, chicken feed, etc.
2. **Fuel** - Diesel, gasoline, oil
3. **Farm Supplies** - Seeds, fertilizer, tools
4. **Equipment** - Machinery, equipment purchases
5. **Maintenance** - Repairs, servicing
6. **Construction** - Building materials, construction
7. **Transportation** - Transport costs
8. **Utilities** - Electricity, water, internet
9. **Other** - Everything else

---

## 📱 RESPONSIVE DESIGN

The system works on:
- ✅ **Desktop** (1200px+) - Full table view
- ✅ **Tablet** (768px - 1199px) - Optimized layout
- ✅ **Mobile** (480px - 767px) - Card-based layout
- ✅ **Small Mobile** (<480px) - Compact layout

---

## 🔄 DATA WORKFLOW

### Adding a Receipt

1. Navigate to **"Add Receipt"** page
2. Take or upload receipt photo
3. Enter description (e.g., "Purchase of chicken feeds")
4. Select category (e.g., "Feeds")
5. Enter amount in PHP (e.g., 2500.00)
6. Confirm date (default: today)
7. Click **"Save Receipt"**

**Behind the scenes:**
- Photo is uploaded to Supabase Storage at: `receipts/2026/09/xxxxx.jpg`
- Receipt record is added to database with the image URL
- Dashboard updates automatically

### Editing a Receipt

1. Go to **"Receipts"** page
2. Click **"Edit"** button
3. Modify any field:
   - Details ✏️
   - Category 📦
   - Amount 💰
   - Date 📅
   - Photo 📷
4. Click **"Save Changes"**

**Behind the scenes:**
- If you upload new photo, old one is deleted
- Database record is updated
- List refreshes automatically

### Deleting a Receipt

1. Go to **"Receipts"** page
2. Click **"Delete"** button
3. Confirm deletion (2-step confirmation)

**Behind the scenes:**
- Database record is deleted
- Associated image is deleted from storage
- List refreshes automatically

---

## 🔍 SEARCH & FILTER

### Search
- Type in search box to find receipts by:
  - Details (e.g., "chicken", "diesel")
  - Category (e.g., "Feeds")
  - Amount (e.g., "2500")

### Filter Options
- **Date Range**: From date to To date
- **Category**: Choose specific category
- **Clear**: Remove all filters

### On Dashboard
- See filtered results in recent transactions
- Category summary updates based on filters

### On Reports
- Filter by date range
- All tables update accordingly

---

## 📊 DASHBOARD TOTALS

All amounts are **automatically calculated** from the database:

- **Total Expenses** = SUM of all receipt amounts
- **Total Receipts** = COUNT of all receipts
- **This Month** = SUM of receipts with date in current month
- **This Year** = SUM of receipts with date in current year

### Example:
```
Receipt 1: Sept 1  - ₱1,500 (Feeds)
Receipt 2: Sept 5  - ₱2,000 (Fuel)
Receipt 3: Aug 15  - ₱500   (Farm Supplies)

Total Expenses: ₱4,000
This Month (Sept): ₱3,500
This Year: ₱4,000
```

---

## 🐛 TROUBLESHOOTING

### Issue: "Supabase is not configured"

**Solution:**
1. Check if `supabase.js` has your actual URL and key
2. Verify you copied the **anon key**, not service_role key
3. Check for typos or extra spaces
4. Refresh the page
5. Check browser console (F12) for error messages

### Issue: Photos don't upload

**Solution:**
1. Check if "receipts" storage bucket exists in Supabase
2. Verify storage policies are set to allow uploads
3. Check file size (should be < 10MB)
4. Try a different image format (JPG, PNG)
5. Check browser console for error messages

### Issue: Receipts don't appear in the list

**Solution:**
1. Verify SQL setup script was run successfully
2. Check if `receipts` table exists in Supabase SQL Editor
3. Run: `SELECT COUNT(*) FROM public.receipts;`
4. Refresh the page
5. Check browser console for errors

### Issue: Filters not working

**Solution:**
1. Verify you clicked "Apply Filter" button
2. Make sure dates are in correct format (YYYY-MM-DD)
3. Clear filters and try again
4. Refresh the page

---

## 📞 SUPPORT

### Common Questions

**Q: Can multiple people use this system?**
A: Yes, but everyone shares the same data. For user-specific data, you'd need to add authentication.

**Q: Is my data safe?**
A: Yes, it's stored in Supabase which is a secure PostgreSQL database. Make sure you don't share your service_role key.

**Q: How much does Supabase cost?**
A: Free tier includes:
- 500MB database
- 1GB storage
- Great for small farms

**Q: Can I use this offline?**
A: No, it requires internet connection to access Supabase. But you can take photos offline and upload when online.

**Q: How do I backup my data?**
A: Go to Settings → "Export All Data (CSV)" to download all receipts.

---

## 🚀 DEPLOYMENT CHECKLIST

- [ ] Created Supabase account and project
- [ ] Got Project URL and anon key
- [ ] Updated `supabase.js` with your credentials
- [ ] Ran SUPABASE_SETUP.sql script
- [ ] Verified "receipts" table was created
- [ ] Verified "receipts" storage bucket was created
- [ ] Enabled GitHub Pages
- [ ] Tested on desktop, tablet, and mobile
- [ ] Added first receipt and verified it appears
- [ ] Tested edit and delete functions
- [ ] Generated first report

---

## 📈 NEXT STEPS

After setup is complete:

1. **Add receipts**: Start entering your expenses
2. **Generate reports**: Check the Reports page for insights
3. **Monitor trends**: See which categories cost the most
4. **Export data**: Download CSV for spreadsheet analysis
5. **Share access**: Give the link to team members

---

## 🎓 LEARNING RESOURCES

- **Supabase Docs**: https://supabase.com/docs
- **GitHub Pages**: https://pages.github.com/
- **PostgreSQL Basics**: https://www.postgresql.org/docs/

---

## 📝 VERSION INFO

- **System**: RENSON FARM INVENTORY v1.0.0
- **Stack**: HTML5, CSS3, JavaScript (Vanilla)
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **Hosting**: GitHub Pages
- **Last Updated**: September 9, 2026

---

**Happy farming! 🚜🌾**