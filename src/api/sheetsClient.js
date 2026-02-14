// Google Sheets API Client
// Configure your spreadsheet ID and API key in sheetsConfig.js

import { SHEETS_CONFIG } from './sheetsConfig';

const API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

// Entity to sheet mapping
const SHEET_NAMES = {
  RefurbCertificate: 'Certificates',
  RefurbProcessRun: 'ProcessRuns',
  RefurbProcessTemplate: 'Templates',
  RefurbStepResult: 'StepResults',
};

const fetchSheet = async (entity) => {
  const sheetName = SHEET_NAMES[entity];
  const url = `${API_BASE}/${SHEETS_CONFIG.spreadsheetId}/values/${sheetName}?key=${SHEETS_CONFIG.apiKey}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch ${entity}:`, response.status);
      return [];
    }
    
    const data = await response.json();
    const rows = data.values || [];
    
    if (rows.length === 0) return [];
    
    // First row is headers
    const headers = rows[0];
    const items = rows.slice(1).map(row => {
      const item = {};
      headers.forEach((header, i) => {
        const value = row[i];
        // Try to parse JSON fields
        if (value && (value.startsWith('[') || value.startsWith('{'))) {
          try {
            item[header] = JSON.parse(value);
          } catch {
            item[header] = value;
          }
        } else {
          item[header] = value || '';
        }
      });
      return item;
    });
    
    return items;
  } catch (error) {
    console.error(`Error fetching ${entity}:`, error);
    return [];
  }
};

const appendToSheet = async (entity, item) => {
  const sheetName = SHEET_NAMES[entity];
  const url = `${API_BASE}/${SHEETS_CONFIG.spreadsheetId}/values/${sheetName}:append?valueInputOption=RAW&key=${SHEETS_CONFIG.apiKey}`;
  
  // Get headers to ensure correct column order
  const allItems = await fetchSheet(entity);
  const headers = allItems.length > 0 ? Object.keys(allItems[0]) : Object.keys(item);
  
  const values = headers.map(h => {
    const val = item[h];
    if (typeof val === 'object') return JSON.stringify(val);
    return val !== undefined ? String(val) : '';
  });
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [values] }),
    });
    
    return response.ok;
  } catch (error) {
    console.error(`Error appending to ${entity}:`, error);
    return false;
  }
};

const updateInSheet = async (entity, id, updates) => {
  // Read all, find row, update, write back
  const items = await fetchSheet(entity);
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) {
    console.error(`Item ${id} not found in ${entity}`);
    return false;
  }
  
  const updated = { ...items[index], ...updates };
  const sheetName = SHEET_NAMES[entity];
  const rowNumber = index + 2; // +1 for header, +1 for 1-indexed
  
  const headers = Object.keys(items[0]);
  const values = headers.map(h => {
    const val = updated[h];
    if (typeof val === 'object') return JSON.stringify(val);
    return val !== undefined ? String(val) : '';
  });
  
  const url = `${API_BASE}/${SHEETS_CONFIG.spreadsheetId}/values/${sheetName}!A${rowNumber}?valueInputOption=RAW&key=${SHEETS_CONFIG.apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [values] }),
    });
    
    return response.ok;
  } catch (error) {
    console.error(`Error updating ${entity}:`, error);
    return false;
  }
};

const deleteFromSheet = async (entity, id) => {
  // For simplicity, mark as deleted rather than actually removing rows
  return updateInSheet(entity, id, { deleted: true });
};

// Query helpers
const applyQuery = (rows, query) => {
  if (!query) return rows;
  
  if (typeof query === 'function') return rows.filter(query);
  
  if (typeof query === 'string') {
    const str = query.trim();
    if (str.startsWith('-')) {
      const field = str.slice(1);
      return [...rows].sort((a, b) => {
        const av = a[field];
        const bv = b[field];
        if (av === bv) return 0;
        if (!av) return 1;
        if (!bv) return -1;
        return av < bv ? 1 : -1;
      });
    }
    return rows;
  }
  
  const where = query.where ?? query;
  let out = rows.filter(r => {
    for (const [k, v] of Object.entries(where)) {
      if (v !== undefined && r[k] !== v) return false;
    }
    return true;
  });
  
  if (query.orderBy?.field) {
    const field = query.orderBy.field;
    const desc = query.orderBy.direction === 'desc';
    out.sort((a, b) => {
      const av = a[field];
      const bv = b[field];
      if (av === bv) return 0;
      if (!av) return 1;
      if (!bv) return -1;
      return desc ? (av < bv ? 1 : -1) : (av < bv ? -1 : 1);
    });
  }
  
  if (typeof query.limit === 'number') out = out.slice(0, query.limit);
  
  return out;
};

const makeEntityApi = (entity) => ({
  async list(query) {
    const items = await fetchSheet(entity);
    return applyQuery(items.filter(i => !i.deleted), query);
  },
  
  async filter(query) {
    const items = await fetchSheet(entity);
    return applyQuery(items.filter(i => !i.deleted), query);
  },
  
  async first(query) {
    const items = await fetchSheet(entity);
    const filtered = applyQuery(items.filter(i => !i.deleted), query);
    return filtered[0] || null;
  },
  
  async count(query) {
    const items = await fetchSheet(entity);
    const filtered = applyQuery(items.filter(i => !i.deleted), query);
    return filtered.length;
  },
  
  async get(id) {
    const items = await fetchSheet(entity);
    return items.find(i => i.id === id && !i.deleted) || null;
  },
  
  async create(data) {
    const now = new Date().toISOString();
    const item = {
      id: crypto.randomUUID(),
      created_at: now,
      created_date: now,
      ...data,
    };
    
    const success = await appendToSheet(entity, item);
    return success ? item : null;
  },
  
  async update(id, patch) {
    const now = new Date().toISOString();
    const updates = { ...patch, updated_at: now, updated_date: now };
    const success = await updateInSheet(entity, id, updates);
    
    if (success) {
      const items = await fetchSheet(entity);
      return items.find(i => i.id === id) || null;
    }
    return null;
  },
  
  async remove(id) {
    return deleteFromSheet(entity, id);
  },
  
  async delete(id) {
    return deleteFromSheet(entity, id);
  },
});

export const sheets44 = {
  auth: {
    async me() {
      return { id: 'sheets-user', name: 'Sheets User' };
    },
  },
  entities: {
    RefurbCertificate: makeEntityApi('RefurbCertificate'),
    RefurbProcessRun: makeEntityApi('RefurbProcessRun'),
    RefurbProcessTemplate: makeEntityApi('RefurbProcessTemplate'),
    RefurbStepResult: makeEntityApi('RefurbStepResult'),
  },
};

export default sheets44;
