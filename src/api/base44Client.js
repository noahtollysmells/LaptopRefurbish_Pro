// src/api/base44Client.js
//
// TOGGLE BACKEND:
// - Use localStorage (offline, per-device): uncomment localStorage export below
// - Use Google Sheets (shared, cloud): uncomment Sheets export below

// localStorage backend (current - has sorting bug)
// export { default } from './base44Client-localStorage';

// Google Sheets backend (cloud storage)
import { SHEETS_CONFIG } from './sheetsConfig';
if (!SHEETS_CONFIG.configured) {
  console.error('Google Sheets not configured! See SHEETS_SETUP.md');
}
export { default } from './sheetsClient';
