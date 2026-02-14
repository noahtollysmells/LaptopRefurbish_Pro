// src/api/base44Client.js
//
// TOGGLE BACKEND:
// - Use localStorage (offline, per-device): uncomment localStorage export below
// - Use Google Sheets (shared, cloud): uncomment Sheets export below

// localStorage backend
export { default, base44 } from './base44Client-localStorage';

// Google Sheets backend (cloud storage) - DISABLED DUE TO CORS ISSUES
// import { SHEETS_CONFIG } from './sheetsConfig';
// if (!SHEETS_CONFIG.configured) {
//   console.error('Google Sheets not configured! See SHEETS_SETUP.md');
// }
// export { default, base44 } from './sheetsClient';

