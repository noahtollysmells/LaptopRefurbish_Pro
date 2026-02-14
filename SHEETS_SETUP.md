# Google Sheets Backend Setup

## Quick Start

### 1. Create Google Sheet
1. Go to https://sheets.google.com and create a new spreadsheet
2. Name it **Laptop Refurb Data**
3. Create 4 sheets (tabs) with these EXACT names:
   - `Certificates`
   - `ProcessRuns`
   - `Templates`
   - `StepResults`

### 2. Get Spreadsheet ID
Copy the ID from your sheet URL:
```
https://docs.google.com/spreadsheets/d/COPY_THIS_PART/edit
```

### 3. Enable API & Get API Key
1. Go to https://console.cloud.google.com
2. Create a new project (or use existing)
3. Go to **APIs & Services** → **Enable APIs and Services**
4. Search for **Google Sheets API** and enable it
5. Go to **Credentials** → **Create Credentials** → **API Key**
6. Copy your API key

### 4. Share Your Sheet
**Option A (Easiest):**
- Click **Share** button in top right
- Change to **Anyone with the link can edit**

**Option B (More Secure - Service Account):**
1. In Google Cloud Console → **Credentials** → **Create Credentials** → **Service Account**
2. Copy service account email (looks like: `xyz@project.iam.gserviceaccount.com`)
3. Share your sheet with this email address (Editor access)

### 5. Configure App
1. Open `src/api/sheetsConfig.js`
2. Replace `YOUR_SPREADSHEET_ID_HERE` with your ID
3. Replace `YOUR_API_KEY_HERE` with your API key
4. Set `configured: true`

### 6. Switch to Sheets Backend
In `src/api/base44Client.js`, at the top:
```javascript
// Comment out localStorage version:
// export { default } from './base44Client-localStorage';

// Use Sheets version:
export { default } from './sheetsClient';
```

### 7. Initial Sheet Setup
The app will auto-create headers on first write. Or manually add headers:

**Certificates sheet:**
```
id | created_at | created_date | manufacturer | model | serial_number | technician_name | date | certificate_number | status | ...
```

**ProcessRuns sheet:**
```
id | created_at | created_date | certificate_id | template_id | started_at | status | current_step | ...
```

**Templates sheet:**
```
id | created_at | name | active | ordered_steps | ...
```

**StepResults sheet:**
```
id | created_at | created_date | process_run_id | step_number | completed | notes | completed_at | ...
```

## Test It
1. Push and deploy
2. Create a new refurb job
3. Check your Google Sheet - data should appear!

## Troubleshooting

### "Failed to fetch" errors
- Check API key is correct
- Verify Sheets API is enabled in Google Cloud Console
- Make sure sheet is shared (publicly or with service account)

### Data not saving
- Open browser console (F12)
- Look for error messages
- Verify spreadsheet ID is correct
- Check sheet tab names match exactly

### CORS errors
- This shouldn't happen with Sheets API v4
- If it does, you may need to set up a backend proxy

## Alternative: Make It Work Offline
If you want BOTH localStorage backup and Sheets sync:
1. Save to localStorage immediately (fast)
2. Sync to Sheets in background
3. On load, fetch from Sheets if available, fallback to localStorage

Let me know if you want this hybrid approach!
