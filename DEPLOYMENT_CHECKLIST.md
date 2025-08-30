# Deployment Checklist

## Before You Deploy

1. **Replace the Sheet ID** in `Code.gs`:
   - Open your Google Sheet
   - Copy the ID from the URL (the long string between `/d/` and `/edit`)
   - Replace `REPLACE_WITH_YOUR_ACTUAL_SHEET_ID` in the code

## Deployment Steps

1. **Open Google Apps Script**
   - Go to script.google.com
   - Create a new project
   - Delete the default `Code.gs` content
   - Copy and paste your entire `Code.gs` file

2. **Deploy the Web App**
   - Click the "Deploy" button (top right)
   - Choose "New deployment"
   - Select type: "Web app"
   - Settings:
     - Execute as: "Me"
     - Who has access: "Anyone"
   - Click "Deploy"
   - Copy the web app URL

3. **Update Your HTML**
   - Replace `YOUR_SCRIPT_URL_HERE` in `index.html` with the copied URL

4. **Test Everything**
   - Open `index.html` in a browser
   - Check if menus load properly
   - Submit test data
   - Verify data appears in your Google Sheet

## Troubleshooting

If you get the `setHeaders` error:
1. Make sure you deployed the NEW version of the code
2. Try creating a completely new deployment (not updating existing one)
3. Clear your browser cache
4. Wait 5-10 minutes for Google's servers to update

## Important Notes

- Each time you change the code, you need to create a NEW deployment (don't update the existing one)
- The web app URL will change with each new deployment
- Make sure your Google Sheet has both "Responses" and "Menus" tabs
