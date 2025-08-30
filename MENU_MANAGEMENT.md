# Menu Management Guide

Your experiment now loads menu items dynamically from Google Sheets instead of hardcoded data. This makes it easy to update menu items without changing code.

## Google Sheet Structure

### Menu Sheet Format
Your Google Sheet now has two tabs:
1. **"Responses"** - Stores experiment data (as before)
2. **"Menus"** - Stores menu items (new)

### Menu Sheet Columns
The "Menus" sheet must have these columns (in any order):

| Diet Type | Title | Description | Category |
|-----------|-------|-------------|----------|
| veg | Quinoa Veg Bowl (Healthy) | Quinoa, roasted veggies, light vinaigrette | H |
| veg | Lentil Soup | Hearty dal with herbs | H |
| nonveg | Grilled Chicken Salad (Healthy) | Grilled chicken, greens, lemon | H |

### Required Columns:
- **Diet Type**: Must be exactly `veg` or `nonveg`
- **Title**: The menu item name (will be displayed to users)
- **Description**: Short description of the item
- **Category**: Must be `H` (Healthy), `M` (Medium), or `I` (Indulgent)

## How It Works

1. **Automatic Sheet Creation**: When you first run the Apps Script, it will create the "Menus" sheet with sample data
2. **Dynamic Loading**: Each time a participant starts the experiment, menu items are loaded fresh from the sheet
3. **Fallback**: If the sheet can't be accessed, it falls back to hardcoded menus
4. **Nudge Logic**: The first item with category "H" (Healthy) becomes the target for nudges

## Managing Menu Items

### To Add New Items:
1. Open your Google Sheet
2. Go to the "Menus" tab
3. Add a new row with all required columns filled

### To Edit Existing Items:
1. Simply edit any cell in the "Menus" sheet
2. Changes take effect immediately for new experiment sessions

### To Remove Items:
1. Delete the entire row for unwanted items
2. Or change the Diet Type to something other than "veg"/"nonveg" to hide it

## Important Notes

### Nudge Target Selection:
- The **first** item with category "H" in each diet type becomes the nudge target
- If you want a different item to be nudged, either:
  - Move it to the top of the Healthy items, OR
  - Change the category of items above it

### Testing Changes:
- After updating menus, test with a new browser session
- The experiment caches menus briefly, so refresh if needed
- Check browser console for any loading errors

### Categories Explained:
- **H (Healthy)**: Low-calorie, nutritious options
- **M (Medium)**: Moderate calorie/healthiness options  
- **I (Indulgent)**: High-calorie, less healthy options

## Troubleshooting

### Error: "Cannot read properties of undefined (reading 'insertSheet')"
This error means the Google Sheet ID is not configured properly:
1. **Check your Sheet ID**: Make sure you replaced `YOUR_GOOGLE_SHEET_ID_HERE` in `Code.gs` with your actual Google Sheet ID
2. **Verify Sheet Access**: Ensure the Google Sheet exists and you have access to it
3. **Run Manual Setup**: Try running `createMenuSheetManually()` function in Apps Script first

### Menus Not Loading:
1. Check that your Google Sheet has a "Menus" tab
2. Verify column headers match exactly: "Diet Type", "Title", "Description", "Category"
3. Ensure Diet Type values are exactly "veg" or "nonveg"
4. Check Apps Script execution logs for errors

### Missing Items:
- Verify Diet Type is spelled correctly
- Check that all required columns have values
- Empty rows are skipped automatically

### Nudges Not Appearing:
- Make sure at least one item has category "H" for each diet type
- The first "H" item becomes the nudge target

## Sample Data Format

```
Diet Type | Title                      | Description                           | Category
----------|----------------------------|---------------------------------------|----------
veg       | Quinoa Veg Bowl (Healthy) | Quinoa, roasted veggies, light dressing| H
veg       | Lentil Soup               | Hearty dal with herbs                 | H  
veg       | Veg Wrap                  | Mixed veggies, light sauce            | M
veg       | Cheese Pizza              | Cheesy pizza slice                    | I
nonveg    | Grilled Chicken Salad     | Grilled chicken, greens, lemon        | H
nonveg    | Chicken Burger            | Patty, lettuce, sauce                 | M
nonveg    | Butter Chicken            | Rich tomato cream curry               | I
```

This system gives you complete control over menu items without needing to edit code!
