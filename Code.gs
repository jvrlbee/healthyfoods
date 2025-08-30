/**
 * Google Apps Script for Healthy Menu Nudge Experiment
 * This script receives POST requests from the HTML form and saves data to Google Sheets
 */

// Configuration - IMPORTANT: Replace with your actual Google Sheet ID
// To find your Sheet ID: Open your Google Sheet and look at the URL
// https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit#gid=0
const SHEET_ID = 'REPLACE_WITH_YOUR_ACTUAL_SHEET_ID'; // ← Change this!
const SHEET_NAME = 'Responses'; // Name of the sheet tab for responses
const MENU_SHEET_NAME = 'Menus'; // Name of the sheet tab for menu items

/**
 * Handle GET requests (when someone visits the web app URL directly)
 */
function doGet(e) {
  // Check if this is a request for menu data
  if (e && e.parameter && e.parameter.action === 'getMenus') {
    try {
      const menus = getMenusFromSheet();
      const jsonResponse = JSON.stringify({
        status: 'success',
        menus: menus
      });
      
      return ContentService
        .createTextOutput(jsonResponse)
        .setMimeType(ContentService.MimeType.JSON);
        
    } catch (error) {
      const errorResponse = JSON.stringify({
        status: 'error',
        message: error.toString()
      });
      
      return ContentService
        .createTextOutput(errorResponse)
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // Default status page
  return HtmlService.createHtmlOutput(`
    <h2>Menu Nudge Experiment - Data Collector</h2>
    <p>This Google Apps Script is working correctly!</p>
    <p><strong>Status:</strong> Ready to receive data</p>
    <p><strong>Sheet ID:</strong> ${SHEET_ID}</p>
    <p><strong>Response Sheet:</strong> ${SHEET_NAME}</p>
    <p><strong>Menu Sheet:</strong> ${MENU_SHEET_NAME}</p>
    <p>This endpoint accepts POST requests with experiment data and GET requests for menu data.</p>
    <p>If you're seeing this page, your web app deployment is successful.</p>
    <hr>
    <p><strong>API Endpoints:</strong></p>
    <ul>
      <li>GET ?action=getMenus - Retrieve menu items</li>
      <li>POST - Submit experiment data</li>
    </ul>
    <p><small>Timestamp: ${new Date().toISOString()}</small></p>
  `);
}

/**
 * Handle POST requests (when data is submitted from the HTML form)
 */
function doPost(e) {
  try {
    // Try to parse the POST data
    let data;
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      data = e.parameter;
    } else {
      throw new Error('No data received');
    }
    
    // Save to sheet
    const result = saveToSheet(data);
    
    const successResponse = JSON.stringify({
      status: 'success',
      message: 'Data saved successfully',
      result: result
    });
    
    return ContentService
      .createTextOutput(successResponse)
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    
    const errorResponse = JSON.stringify({
      status: 'error',
      message: error.toString()
    });
    
    return ContentService
      .createTextOutput(errorResponse)
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle OPTIONS requests for CORS
 */
function doOptions() {
  return ContentService.createTextOutput('');
}

/**
 * Get menu items from the Google Sheet
 */
function getMenusFromSheet() {
  try {
    // Validate that SHEET_ID is configured
    if (!SHEET_ID || SHEET_ID === 'YOUR_GOOGLE_SHEET_ID_HERE') {
      throw new Error('Google Sheet ID not configured. Please update SHEET_ID in the script.');
    }
    
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    
    // Verify spreadsheet was opened successfully
    if (!spreadsheet) {
      throw new Error('Could not open spreadsheet with ID: ' + SHEET_ID);
    }
    
    let menuSheet = spreadsheet.getSheetByName(MENU_SHEET_NAME);
    
    // If menu sheet doesn't exist, create it with headers only
    if (!menuSheet) {
      console.log('Menu sheet not found, creating new one...');
      menuSheet = createMenuSheet();
    }
    
    const data = menuSheet.getDataRange().getValues();
    
    // Check if sheet has data
    if (!data || data.length < 2) {
      console.log('Menu sheet is empty - please add your menu data to the Google Sheet');
      // Return empty menus structure
      return { veg: [], nonveg: [] };
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    // Find required column indices
    const dietTypeIndex = headers.indexOf('Diet Type');
    const titleIndex = headers.indexOf('Title');
    const descIndex = headers.indexOf('Description');
    const categoryIndex = headers.indexOf('Category');
    
    if (dietTypeIndex === -1 || titleIndex === -1 || descIndex === -1 || categoryIndex === -1) {
      throw new Error('Menu sheet is missing required columns: Diet Type, Title, Description, Category');
    }
    
    // Group menu items by diet type
    const menus = {
      veg: [],
      nonveg: []
    };
    
    rows.forEach(row => {
      const dietType = row[dietTypeIndex];
      const title = row[titleIndex];
      const desc = row[descIndex];
      const category = row[categoryIndex];
      
      if (title && desc && category && (dietType === 'veg' || dietType === 'nonveg')) {
        menus[dietType].push({
          title: title,
          desc: desc,
          category: category
        });
      }
    });
    
    console.log('Successfully loaded menus:', menus);
    return menus;
    
  } catch (error) {
    console.error('Error reading menus from sheet:', error);
    throw error;
  }
}

/**
 * Create the menu sheet with sample data
 */
function createMenuSheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    if (!spreadsheet) {
      throw new Error('Spreadsheet object is null or undefined');
    }
    
    console.log('Creating new menu sheet...');
    const sheet = spreadsheet.insertSheet(MENU_SHEET_NAME);
    
    // Add headers
    const headers = ['Diet Type', 'Title', 'Description', 'Category'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
    
    console.log('Menu sheet created successfully - please add your menu data');
    return sheet;
    
  } catch (error) {
    console.error('Error creating menu sheet:', error);
    throw error;
  }
}

/**
 * Save data to Google Sheets
 */
function saveToSheet(data) {
  try {
    // Open the Google Sheet
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    // If sheet doesn't exist, create it
    if (!sheet) {
      const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
      const newSheet = spreadsheet.insertSheet(SHEET_NAME);
      
      // Add headers
      const headers = [
        'Timestamp',
        'Participant ID',
        'Experimental Arm',
        'Diet Preference',
        'Chosen Item',
        'Chosen Item Index',
        'Confidence Level',
        'Perceived AI',
        'Perceived Popular',
        'Perceived Scarce',
        'Reason'
      ];
      
      newSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      newSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      newSheet.setFrozenRows(1);
    }
    
    const targetSheet = sheet || SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    // Prepare the row data
    const rowData = [
      new Date(), // Timestamp
      data.participantId || '',
      data.arm || '',
      data.diet_pref || '',
      data.chosen_item || '',
      data.chosen_item_index || '',
      data.confidence || '',
      data.perceived_ai || '',
      data.perceived_popular || '',
      data.perceived_scarce || '',
      data.reason || ''
    ];
    
    // Add the row to the sheet
    const range = targetSheet.getRange(targetSheet.getLastRow() + 1, 1, 1, rowData.length);
    range.setValues([rowData]);
    
    // Auto-resize columns for better readability
    targetSheet.autoResizeColumns(1, rowData.length);
    
    return {
      success: true,
      rowNumber: targetSheet.getLastRow()
    };
    
  } catch (error) {
    console.error('Error saving to sheet:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Test function to verify the script setup
 */
function testSetup() {
  try {
    const testData = {
      participantId: 'test123',
      arm: 'control',
      diet_pref: 'veg',
      chosen_item: 'Test Item',
      chosen_item_index: 0,
      confidence: '5',
      perceived_ai: '3',
      perceived_popular: '4',
      perceived_scarce: '2',
      reason: 'Testing the setup'
    };
    
    const result = saveToSheet(testData);
    
    if (result.success) {
      console.log('Test successful! Data saved to row:', result.rowNumber);
    } else {
      console.error('Test failed:', result.error);
    }
    
    return result;
    
  } catch (error) {
    console.error('Test error:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Initialize the Google Sheet with proper headers
 * Run this once to set up your sheet
 */
function initializeSheet() {
  try {
    // Validate that SHEET_ID is configured
    if (!SHEET_ID || SHEET_ID === 'YOUR_GOOGLE_SHEET_ID_HERE') {
      throw new Error('Google Sheet ID not configured. Please update SHEET_ID in the script.');
    }
    
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    
    // Initialize Responses sheet
    let responseSheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!responseSheet) {
      // Create new sheet
      responseSheet = spreadsheet.insertSheet(SHEET_NAME);
    } else {
      // Clear existing content if you want a fresh start
      // responseSheet.clear();
    }
    
    // Add headers for responses
    const responseHeaders = [
      'Timestamp',
      'Participant ID',
      'Experimental Arm',
      'Diet Preference',
      'Chosen Item',
      'Chosen Item Index',
      'Confidence Level',
      'Perceived AI',
      'Perceived Popular',
      'Perceived Scarce',
      'Reason'
    ];
    
    responseSheet.getRange(1, 1, 1, responseHeaders.length).setValues([responseHeaders]);
    responseSheet.getRange(1, 1, 1, responseHeaders.length).setFontWeight('bold');
    responseSheet.setFrozenRows(1);
    responseSheet.autoResizeColumns(1, responseHeaders.length);
    
    // Initialize Menu sheet
    let menuSheet = spreadsheet.getSheetByName(MENU_SHEET_NAME);
    
    if (!menuSheet) {
      // Create new menu sheet
      menuSheet = createMenuSheet();
    }
    
    console.log('Both sheets initialized successfully!');
    return { 
      success: true, 
      message: 'Response and Menu sheets initialized',
      responseSheet: SHEET_NAME,
      menuSheet: MENU_SHEET_NAME
    };
    
  } catch (error) {
    console.error('Error initializing sheets:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Manual function to create just the menu sheet
 * Run this if you only need to create/recreate the menu sheet
 */
function createMenuSheetManually() {
  try {
    // Validate that SHEET_ID is configured
    if (!SHEET_ID || SHEET_ID === 'YOUR_GOOGLE_SHEET_ID_HERE') {
      throw new Error('Google Sheet ID not configured. Please update SHEET_ID in the script.');
    }
    
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    
    // Check if menu sheet already exists
    let menuSheet = spreadsheet.getSheetByName(MENU_SHEET_NAME);
    
    if (menuSheet) {
      console.log('Menu sheet already exists. Delete it first if you want to recreate it.');
      return { success: false, message: 'Menu sheet already exists' };
    }
    
    // Create new menu sheet
    menuSheet = createMenuSheet();
    
    console.log('Menu sheet created successfully!');
    return { 
      success: true, 
      message: 'Menu sheet created with sample data',
      sheetName: MENU_SHEET_NAME
    };
    
  } catch (error) {
    console.error('Error creating menu sheet manually:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Diagnostic function to check configuration and access
 * Run this first to identify issues
 */
function diagnosticCheck() {
  console.log('Starting diagnostic check...');
  
  try {
    // Check 1: Sheet ID configuration
    console.log('1. Checking Sheet ID configuration...');
    console.log('SHEET_ID:', SHEET_ID);
    
    if (!SHEET_ID || SHEET_ID === 'YOUR_GOOGLE_SHEET_ID_HERE') {
      return {
        success: false,
        error: 'SHEET_ID is not configured. Please replace YOUR_GOOGLE_SHEET_ID_HERE with your actual Google Sheet ID.',
        step: 'Configuration'
      };
    }
    
    // Check 2: Try to open spreadsheet
    console.log('2. Attempting to open spreadsheet...');
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    
    if (!spreadsheet) {
      return {
        success: false,
        error: 'Could not open spreadsheet. Check if the Sheet ID is correct and you have access.',
        step: 'Spreadsheet Access'
      };
    }
    
    console.log('Spreadsheet opened successfully:', spreadsheet.getName());
    
    // Check 3: List existing sheets
    console.log('3. Listing existing sheets...');
    const sheets = spreadsheet.getSheets();
    const sheetNames = sheets.map(sheet => sheet.getName());
    console.log('Existing sheets:', sheetNames);
    
    // Check 4: Check for required sheets
    const hasResponseSheet = sheetNames.includes(SHEET_NAME);
    const hasMenuSheet = sheetNames.includes(MENU_SHEET_NAME);
    
    console.log('Has Response sheet:', hasResponseSheet);
    console.log('Has Menu sheet:', hasMenuSheet);
    
    return {
      success: true,
      message: 'Diagnostic check completed successfully',
      spreadsheetName: spreadsheet.getName(),
      sheetId: SHEET_ID,
      existingSheets: sheetNames,
      hasResponseSheet: hasResponseSheet,
      hasMenuSheet: hasMenuSheet
    };
    
  } catch (error) {
    console.error('Diagnostic check failed:', error);
    return {
      success: false,
      error: error.toString(),
      step: 'Unknown'
    };
  }
}
