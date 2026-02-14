// Google Sheets Configuration
// 
// SETUP INSTRUCTIONS:
// 1. Create a new Google Sheet: https://sheets.google.com
// 2. Create 4 sheets (tabs) named: Certificates, ProcessRuns, Templates, StepResults
// 3. For each sheet, add a header row with column names (will auto-populate on first write)
// 4. Go to Google Cloud Console: https://console.cloud.google.com
// 5. Create a new project or select existing
// 6. Enable Google Sheets API
// 7. Create credentials:
//    - API Key (simpler, read-only OR publicly writable sheet)
//    - OR Service Account (recommended for write access)
// 8. Copy your Spreadsheet ID from the URL:
//    https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
// 9. Share your sheet with "Anyone with the link can edit" OR share with service account email
// 10. Replace the values below

export const SHEETS_CONFIG = {
  // Your Google Sheets spreadsheet ID
  spreadsheetId: '1mhFrNTxTgRR9aD2DquXJIKMD5FIiKsSYhkMf5UV6w-M',
  
  // Your Google API key
  apiKey: 'AIzaSyC3IK3Rtik4a2O6mVJq6soDdIN-VVex6T4',
  
  // Set to true once you've configured the above
  configured: true,
};

// Example configuration:
// export const SHEETS_CONFIG = {
//   spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
//   apiKey: 'AIzaSyD1234567890abcdefghijklmnopqrstuv',
//   configured: true,
// };
