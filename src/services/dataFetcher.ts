import Papa from 'papaparse';

// Pega tus links reales aquí abajo
const SHEET_URLS = {
  MATRICULAS:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQcP7rCshHo68M0e10ArBXUec72XB9js-GtXVKeWVmrLhcve9KUNNAejmBZELzZLup1dsgMahy5xL-6/pub?gid=1430018156&single=true&output=csv',
  SUCURSALES:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQcP7rCshHo68M0e10ArBXUec72XB9js-GtXVKeWVmrLhcve9KUNNAejmBZELzZLup1dsgMahy5xL-6/pub?gid=0&single=true&output=csv',
  COMPRAS:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQcP7rCshHo68M0e10ArBXUec72XB9js-GtXVKeWVmrLhcve9KUNNAejmBZELzZLup1dsgMahy5xL-6/pub?gid=1052769026&single=true&output=csv',
  AGENCIAS:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQcP7rCshHo68M0e10ArBXUec72XB9js-GtXVKeWVmrLhcve9KUNNAejmBZELzZLup1dsgMahy5xL-6/pub?gid=957833859&single=true&output=csv',
  MOVILIDADES:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQcP7rCshHo68M0e10ArBXUec72XB9js-GtXVKeWVmrLhcve9KUNNAejmBZELzZLup1dsgMahy5xL-6/pub?gid=1091489004&single=true&output=csv',
  PALABRAS_CLAVE:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQcP7rCshHo68M0e10ArBXUec72XB9js-GtXVKeWVmrLhcve9KUNNAejmBZELzZLup1dsgMahy5xL-6/pub?gid=618560042&single=true&output=csv',
};

// ¡Fíjate que diga EXPORT aquí!
export const fetchData = async (category: string) => {
  const url = SHEET_URLS[category as keyof typeof SHEET_URLS];
  // Si no hay URL o es la de ejemplo, devolvemos lista vacía para que no falle
  if (!url || url.includes('TU_LINK')) {
    console.warn('Falta link para:', category);
    return [];
  }

  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const normalizedData = results.data.map((row: any) => {
          const newRow: any = {};
          Object.keys(row).forEach((key) => {
            const cleanKey = key.trim().toUpperCase().replace(/ /g, '_');
            newRow[cleanKey] = row[key];
          });
          return newRow;
        });
        resolve(normalizedData);
      },
      error: (err) => reject(err),
    });
  });
};
