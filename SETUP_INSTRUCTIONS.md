# Google Apps Script Setup Instructions

## Step 1: Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it something like "Menu Nudge Experiment Data"
4. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)
   - Example: If URL is `https://docs.google.com/spreadsheets/d/1ABC123xyz/edit`, the ID is `1ABC123xyz`

## Step 2: Create Google Apps Script Project
1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Delete the default `myFunction()` code
4. Copy and paste the entire contents of `Code.gs` into the editor
5. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual Google Sheet ID from Step 1

## Step 3: Configure the Script
1. In the Apps Script editor, change the project name to something meaningful
2. **IMPORTANT:** Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual Google Sheet ID from Step 1
3. Save the project (Ctrl/Cmd + S)
4. Run the `initializeSheet` function once to set up your Google Sheet headers:
   - Select `initializeSheet` from the function dropdown
   - Click the play button (▶️)
   - **If you get "An unknown error has occurred":**
     - Wait 30 seconds and try again
     - Make sure you replaced the Sheet ID correctly
     - Check that your Google Sheet exists and is accessible
     - Try refreshing the Apps Script page and running again
     - Grant necessary permissions when prompted (may take 2-3 attempts)

## Step 4: Deploy as Web App
1. Click "Deploy" > "New deployment"
2. Click the gear icon ⚙️ next to "Type" and select "Web app"
3. Set the following:
   - Description: "Menu Nudge Data Collector"
   - Execute as: "Me"
   - Who has access: "Anyone" (important for public access)
4. Click "Deploy"
5. Copy the Web App URL that's generated

## Step 5: Update HTML File
1. Open your `index.html` file
2. Find the line with `SCRIPT_URL = "..."`
3. Replace the placeholder URL with your actual Web App URL from Step 4

## Step 6: Test the Setup
1. After deploying, visit your Web App URL in a browser - you should see a "Menu Nudge Experiment - Data Collector" status page
2. Open your HTML file in a web browser
3. Complete the experiment form
4. Submit a test response
5. Check your Google Sheet to see if the data appears

## Step 7: Verify Everything Works
1. Use the `test-connection.html` file to test the connection
2. Or run the `testSetup()` function in Apps Script:
   - Select `testSetup` from the function dropdown
   - Click the play button (▶️)
   - Check the execution log for success/error messages

## Troubleshooting Tips

### "An unknown error has occurred" in Apps Script
This is a common Google Apps Script error. Try these solutions in order:

1. **Check your Sheet ID:**
   - Make sure you replaced `YOUR_GOOGLE_SHEET_ID_HERE` with your actual Google Sheet ID
   - The ID should be a long string like `1ABC123def456GHI789jkl`
   - Double-check there are no extra spaces or characters

2. **Wait and retry:**
   - Sometimes Google's servers are temporarily busy
   - Wait 1-2 minutes and try running the function again
   - Try refreshing the Apps Script page

3. **Check permissions:**
   - Make sure you can access your Google Sheet directly
   - The sheet should be in your Google Drive and accessible to you
   - Try opening the sheet URL to verify it works

4. **Alternative setup method:**
   - Instead of running `initializeSheet`, try running `testSetup` first
   - If that works, then try `initializeSheet`
   - You can also manually add headers to your sheet and skip `initializeSheet`

5. **Manual header setup (if functions keep failing):**
   - Open your Google Sheet
   - In row 1, add these column headers:
     `Timestamp | Participant ID | Experimental Arm | Diet Preference | Chosen Item | Chosen Item Index | Confidence Level | Perceived AI | Perceived Popular | Perceived Scarce | Reason | Raw Menu Data`
   - Make row 1 bold and freeze it

### "Script function not found: doGet" Error
- This error is normal if you see it during setup - it means the script is working
- After adding the `doGet` function, visiting the web app URL should show a status page

### Permission Issues
- Make sure the Web App is set to "Execute as: Me" and "Who has access: Anyone"
- You may need to re-authorize permissions when you update the script

### CORS Errors
- The Apps Script handles CORS headers automatically
- Make sure you're using the correct Web App URL (not the Apps Script editor URL)

### Data Not Appearing
- Check the Google Sheet ID is correct in the script
- Run the `initializeSheet()` function if headers are missing
- Check the Apps Script execution log for error messages
- Verify the sheet name matches (default is "Responses")

### Testing Functions
- You can run the `testSetup()` function in Apps Script to test the sheet connection
- Use `test-connection.html` to test from a web browser
- Check the execution logs in Apps Script for detailed error information

## Security Notes
- The Web App URL will be public, but only accepts POST requests with the expected data format
- Consider adding additional validation if needed for production use
- The Google Sheet will only be accessible to you (the owner) unless you explicitly share it

## Data Fields Collected
The script will collect the following data in your Google Sheet:
- Timestamp
- Participant ID
- Experimental Arm (control/default/social/scarcity)
- Diet Preference
- Chosen Item
- Chosen Item Index
- Confidence Level (1-7)
- Perceived AI (1-7)
- Perceived Popular (1-7)
- Perceived Scarce (1-7)
- Reason (text explanation)
- Raw Menu Data (JSON format)
