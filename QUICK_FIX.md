# Quick Fix for Google Apps Script Errors

You're getting these errors because the Google Sheet ID is not configured properly. Here's how to fix it:

## 🚨 CRITICAL FIRST STEP:

### 1. **Replace the Sheet ID in Code.gs**

**Find this line (line 7):**
```javascript
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
```

**Replace it with your actual Google Sheet ID:**
```javascript
const SHEET_ID = '1ABC123xyz-your-actual-sheet-id';
```

### 2. **How to Find Your Google Sheet ID:**

1. Open your Google Sheet in a browser
2. Look at the URL: `https://docs.google.com/spreadsheets/d/1ABC123xyz/edit`
3. Copy the long string between `/d/` and `/edit` - that's your Sheet ID
4. It should look like: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## 🔧 TESTING STEPS:

### Step 1: Run Diagnostic
1. In Apps Script, select `diagnosticCheck` from the function dropdown
2. Click the play button (▶️)
3. Check the execution log - it will tell you exactly what's wrong

### Step 2: Initialize Sheets (if diagnostic passes)
1. Run `initializeSheet` function
2. This will create both "Responses" and "Menus" sheets

### Step 3: Deploy and Test
1. Deploy as web app (new version)
2. Test your HTML form

## 📝 EXPECTED RESULTS:

### After running `diagnosticCheck`:
- Should show your spreadsheet name
- Should list existing sheets
- Should confirm access is working

### After running `initializeSheet`:
- Creates "Responses" sheet with headers
- Creates "Menus" sheet with sample menu data
- Both sheets will be ready for your experiment

## 🆘 IF YOU'RE STILL STUCK:

1. **Make sure you have the right Sheet ID** - this is the #1 cause of errors
2. **Make sure you own the Google Sheet** - you need edit permissions
3. **Try creating a brand new Google Sheet** - sometimes permissions get mixed up

## 🎯 QUICK TEST:

Run this in Apps Script console to verify your Sheet ID:
```javascript
console.log('Sheet ID:', SHEET_ID);
console.log('Is configured:', SHEET_ID !== 'YOUR_GOOGLE_SHEET_ID_HERE');
```

Once you fix the Sheet ID, all the other errors will disappear!
