# RENSON FARM INVENTORY 🚜

**A modern, responsive web-based inventory and expense/receipt management system for Renson Farm**

## 📖 Overview

RENSON FARM INVENTORY is a complete web-based solution for tracking receipts, expenses, and purchases. Built with modern web technologies and powered by Supabase, it provides real-time data management with a responsive design that works on desktop, tablet, and mobile devices.

### ✨ Key Features

- 📷 **Photo Capture & Upload** - Take photos with camera or upload from device
- 💾 **Automatic Cloud Backup** - All data stored securely in Supabase PostgreSQL
- 📊 **Interactive Dashboard** - Real-time expense summaries and statistics
- 📋 **Receipt Management** - Add, edit, delete, and search receipts easily
- 🔍 **Smart Search & Filter** - Filter by date range, category, or search text
- 📈 **Detailed Reports** - Monthly, yearly, and category-based expense analysis
- 📱 **Fully Responsive** - Perfect on desktop, tablet, and mobile phones
- 💯 **Philippine Peso Format** - All amounts formatted in ₱ PHP
- 🔐 **Secure** - Uses Supabase with Row Level Security (RLS) policies
- 📥 **Data Export** - Export all receipts as CSV for backup or analysis

---

## 🚀 Quick Start (5 minutes)

### Step 1: Create Supabase Project
1. Go to https://supabase.com → Create free account
2. Create new project and get your **Project URL** and **anon key**

### Step 2: Configure Frontend
1. Open `supabase.js`
2. Replace these placeholders:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```

### Step 3: Setup Database
1. In Supabase dashboard → SQL Editor → New Query
2. Copy & paste entire `SUPABASE_SETUP.sql` file
3. Click **Run** ✅

### Step 4: Enable GitHub Pages
1. Repository Settings → Pages
2. Deploy from: **main** branch
3. Save and wait 1-2 minutes ✅

### Step 5: Visit Your Site
```
https://yourusername.github.io/renson-farm-inventory/
```

**📖 Detailed guide**: See [SETUP_GUIDE.md](SETUP_GUIDE.md)

---

## 📁 Project Files

```
renson-farm-inventory/
├── index.html              # 📊 Dashboard (stats, recent, summary)
├── add-receipt.html        # ➕ Add receipt form (photo, details, amount)
├── receipts.html           # 📋 Receipts list (table/card view, search/filter)
├── reports.html            # 📈 Reports & analytics (monthly, yearly, category)
├── settings.html           # ⚙️ Settings & help
├── style.css               # 🎨 Responsive styling (mobile-first)
├── app.js                  # 🔧 Application logic (28KB)
├── supabase.js             # 🗄️ Database functions (8KB)
├── SUPABASE_SETUP.sql      # 🗄️ Database schema & setup
├── SETUP_GUIDE.md          # 📖 Complete setup instructions
└── README.md               # This file
```

---

## 💻 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Database** | Supabase (PostgreSQL) |
| **Storage** | Supabase Cloud Storage |
| **Hosting** | GitHub Pages (Free) |
| **Security** | Row Level Security (RLS) |

---

## 🎯 Main Features

### 📊 Dashboard
- **Total Expenses** - Sum of all receipts ever added
- **Total Receipts** - Count of receipt records
- **This Month** - Current month total (auto-calculated)
- **This Year** - Current year total (auto-calculated)
- **Recent Transactions** - Latest 6 receipts with details
- **Category Summary** - Expense breakdown by category
- **Search & Filter** - Find receipts by text, date, or category

### ➕ Add Receipt
- 📷 Capture photo from phone camera
- 📁 Upload existing photo from device
- 👁️ Preview image before saving
- 📝 Enter description/details
- 💰 Enter amount in Philippine Peso
- 📅 Set date (defaults to today)
- 📦 Choose category (9 options)

### 📋 Receipts Page
- 📋 Desktop: Full-featured sortable table
- 📱 Mobile: Card-based responsive layout
- 🖼️ Click photos to view full size
- 🔍 Full-text search by details
- 🗓️ Filter by date range
- 📦 Filter by category
- ✏️ Edit any receipt
- 🗑️ Delete with confirmation
- 📊 Live totals updated

### 📈 Reports
- 📊 Overall statistics (total, count, average)
- 📈 Monthly breakdown table
- 📅 Yearly breakdown table
- 📦 Category breakdown with percentages
- 📥 Export to CSV file
- 🖨️ Print-friendly format
- 🗓️ Date range filter

### ⚙️ Settings
- ℹ️ System information & version
- 🔌 Supabase configuration status
- 💾 Backup/Export all data to CSV
- 🗑️ Delete all receipts (with confirmation)
- 🧹 Clear browser cache
- ❓ Help section with features
- 📋 Supported categories list

---

## 💾 Receipt Categories

Choose from 9 predefined categories:

1. **Feeds** - Animal feed, chicken feed, etc.
2. **Fuel** - Diesel, gasoline, oil, petroleum
3. **Farm Supplies** - Seeds, fertilizer, tools, equipment
4. **Equipment** - Machinery, large equipment purchases
5. **Maintenance** - Repairs, servicing, upkeep
6. **Construction** - Building materials, construction work
7. **Transportation** - Transport costs, delivery fees
8. **Utilities** - Electricity, water, internet, phone
9. **Other** - Everything else not covered above

---

## 🔐 Security & Privacy

### Safe to Share (Public)
- ✅ Supabase Project URL
- ✅ Supabase anon/public key
- ✅ GitHub repository code
- ✅ Deployed site URL

### NEVER Share (Secret)
- ❌ Supabase service_role_key
- ❌ Supabase database password
- ❌ Database connection string

---

## 📱 Responsive Design

| Device | Width | Layout |
|--------|-------|--------|
| Desktop | 1200px+ | Sidebar + Full table |
| Tablet | 768-1199px | Sidebar + Optimized layout |
| Mobile | 480-767px | Top nav + Card view |
| Small | <480px | Compact layout |

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Supabase not configured" | Update supabase.js with your URL & anon key |
| Photos don't upload | Run SUPABASE_SETUP.sql or create "receipts" bucket |
| Receipts don't appear | Run SUPABASE_SETUP.sql in SQL Editor |
| Filters don't work | Click the "Apply Filter" button |
| Site shows 404 | Enable GitHub Pages: Settings → Pages → main branch |
| Styling broken | Clear browser cache (Ctrl+Shift+Delete) |

**More help**: See [SETUP_GUIDE.md](SETUP_GUIDE.md)

---

## 📊 Dashboard Auto-Calculations

All totals are **automatically calculated** from database:

```
Total Expenses = SUM(all receipt amounts)
Total Receipts = COUNT(all records)
This Month = SUM(receipts in current month)
This Year = SUM(receipts in current year)
```

---

## 🚀 Deployment Checklist

- [ ] Created Supabase account and project
- [ ] Copied Project URL and anon key
- [ ] Updated supabase.js with credentials
- [ ] Ran SUPABASE_SETUP.sql successfully
- [ ] Enabled GitHub Pages in Settings
- [ ] Site is live and accessible
- [ ] Tested adding a receipt
- [ ] Tested edit and delete functions
- [ ] Generated a test report
- [ ] Exported to CSV

---

## 📈 Next Steps

1. **Add receipts** - Start tracking expenses
2. **Generate reports** - Monitor spending patterns
3. **Export data** - Backup or analyze in Excel
4. **Share URL** - Give access to team members

---

## 🎓 Resources

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup instructions
- **[Supabase Docs](https://supabase.com/docs)** - Database & Storage
- **[GitHub Pages](https://pages.github.com/)** - Hosting guide

---

## 📝 Version

- **System**: RENSON FARM INVENTORY v1.0.0
- **Stack**: HTML5, CSS3, Vanilla JavaScript
- **Database**: Supabase PostgreSQL
- **Hosting**: GitHub Pages
- **Updated**: September 9, 2026

---

**Start tracking your farm expenses now! 🌾**