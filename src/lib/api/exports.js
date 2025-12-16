/**
 * エクスポート関連のAPI呼び出しを管理するモジュール
 */

/**
 * ファイルの存在確認
 * @param {string} organizationId
 * @param {number} year
 * @param {string} basePath - $app/paths の base
 * @returns {Promise<{exists: boolean}>}
 */
export async function checkExportStatus(organizationId, year, basePath) {
  const response = await fetch(
    `${basePath}/api/organizations/${organizationId}/export-status?year=${year}`,
    { method: 'GET' }
  );

  if (!response.ok) {
    throw new Error(`Status check failed: ${response.status}`);
  }

  return response.json();
}

/**
 * 集計処理を実行
 * @param {string} organizationId
 * @param {number} year
 * @param {string} basePath - $app/paths の base
 * @returns {Promise<{signedUrl: string}>}
 */
export async function aggregateExport(organizationId, year, basePath) {
  const response = await fetch(
    `${basePath}/api/organizations/${organizationId}/export-cards?year=${year}`,
    { method: 'POST' }
  );

  if (!response.ok) {
    throw new Error(`Aggregate failed: ${response.status}`);
  }

  return response.json();
}

/**
 * ダウンロード用の署名付きURLを取得
 * @param {string} organizationId
 * @param {number} year
 * @param {string} basePath - $app/paths の base
 * @returns {Promise<{signedUrl: string}>}
 */
export async function getExportSignedUrl(organizationId, year, basePath) {
  const response = await fetch(
    `${basePath}/api/organizations/${organizationId}/export-get-signed-url?year=${year}`,
    { method: 'GET' }
  );

  if (!response.ok) {
    throw new Error(`Failed to get signed URL: ${response.status}`);
  }

  return response.json();
}

/**
 * 署名付きURLを使ってファイルをダウンロード
 * @param {string} signedUrl
 * @param {string} filename
 */
export function downloadFile(signedUrl, filename) {
  const link = document.createElement('a');
  link.href = signedUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
