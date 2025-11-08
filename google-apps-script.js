function doPost(e) {
  try {
    // Replace 'YOUR_SPREADSHEET_ID' with your actual Google Sheet ID
    // You can find this in your Google Sheet URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
    const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
    
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return ContentService.createTextOutput(JSON.stringify({
        'result': 'error',
        'message': 'Missing required fields'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Append new row with form data
    sheet.appendRow([
      new Date(),
      data.name,
      data.email,
      data.message
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Form submitted successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    'result': 'success',
    'message': 'Google Apps Script is working'
  })).setMimeType(ContentService.MimeType.JSON);
}