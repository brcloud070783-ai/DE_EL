/**
 * Google Drive & Google Sheets REST API Services
 * Direct, client-side REST calls using OAuth Access Token.
 */

interface GoogleFile {
  id: string;
  name: string;
  webViewLink?: string;
}

/**
 * Create a folder in Google Drive
 */
export const createFolder = async (
  accessToken: string,
  name: string,
  parentId?: string
): Promise<GoogleFile> => {
  const body: any = {
    name: name,
    mimeType: 'application/vnd.google-apps.folder',
  };
  if (parentId) {
    body.parents = [parentId];
  }

  const response = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal membuat folder di Google Drive');
  }

  return response.json();
};

/**
 * Find a file or folder by name and mimeType
 */
export const findFileByName = async (
  accessToken: string,
  name: string,
  mimeType: string
): Promise<GoogleFile | null> => {
  const query = `name = '${name.replace(/'/g, "\\'")}' and mimeType = '${mimeType}' and trashed = false`;
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,webViewLink)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    return null;
  }

  const result = await response.json();
  if (result.files && result.files.length > 0) {
    return result.files[0];
  }
  return null;
};

/**
 * Create a new spreadsheet in Google Drive
 */
export const createSpreadsheet = async (
  accessToken: string,
  title: string
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: title,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal membuat Google Sheets');
  }

  const data = await response.json();
  return {
    spreadsheetId: data.spreadsheetId,
    spreadsheetUrl: data.spreadsheetUrl,
  };
};

/**
 * Append row values to a spreadsheet
 */
export const appendRowToSpreadsheet = async (
  accessToken: string,
  spreadsheetId: string,
  sheetName: string,
  values: any[][]
): Promise<void> => {
  const range = `${sheetName}!A1`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: values,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal menulis baris log ke Google Sheets');
  }
};

/**
 * Check and setup spreadsheet database for travel logs
 */
export const setupTravelLogSheet = async (
  accessToken: string,
  spreadsheetId: string,
  sheetName: string
): Promise<void> => {
  // First, verify/add sheet with sheetName. We can do an append first.
  // Standard header rows
  const headers = [
    [
      'Timestamp',
      'ID Dokumen',
      'Nomor Surat',
      'Hal / Perihal',
      'Tempat Tujuan',
      'Tanggal Perjalanan',
      'Jumlah Personil',
      'Nama Personil',
      'Drive Folder URL',
    ],
  ];

  try {
    // Attempt to append to sheet. If it fails (e.g. sheet doesn't exist), we try to write it.
    await appendRowToSpreadsheet(accessToken, spreadsheetId, sheetName, headers);
  } catch (error) {
    // If append failed, let's create a batch update to add the sheet, then append.
    const addSheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
    await fetch(addSheetUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetName,
              },
            },
          },
        ],
      }),
    });

    // Write header again
    await appendRowToSpreadsheet(accessToken, spreadsheetId, sheetName, headers);
  }
};

/**
 * Upload a file/photo to Google Drive folder
 */
export const uploadFileToDrive = async (
  accessToken: string,
  folderId: string,
  fileName: string,
  file: File
): Promise<GoogleFile> => {
  // We use multipart upload for simplicity and efficiency
  const metadata = {
    name: fileName,
    parents: [folderId],
  };

  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append('file', file);

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal mengunggah foto ke Google Drive');
  }

  return response.json();
};
