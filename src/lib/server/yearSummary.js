import { PRIVATE_STORAGE_BUCKET } from '$env/static/private';
import { getStorage } from 'firebase-admin/storage';

/**
 * Read TSV from storage and compute per-user year summary
 * @param {string} organizationId
 * @param {number} year
 * @param {string} uid - target user id
 */
export async function getYearSummary(organizationId, year, uid) {
  const storage = getStorage();
  const bucket = storage.bucket(PRIVATE_STORAGE_BUCKET);
  const filePath = `organizations/${organizationId}/exports/${year}.tsv`;
  const file = bucket.file(filePath);

  const [exists] = await file.exists();
  if (!exists) {
    throw new Error('not_found');
  }

  const [buffer] = await file.download();
  const tsv = buffer.toString('utf8');
  const lines = tsv.split('\n').filter(Boolean);
  if (lines.length === 0) return {};

  const header = lines[0].split('\t');
  const idx = {};
  header.forEach((h, i) => (idx[h] = i));

  const monthlySent = Array(12).fill(0);
  const monthlyReceived = Array(12).fill(0);
  let totalSent = 0;
  let totalReceived = 0;

  const partnerSentCounts = {};
  const partnerReceivedCounts = {};

  const sentMsgs = [];
  const receivedMsgs = [];

  const emojiCountsSent = {};
  const emojiCountsReceived = {};

  // parse rows
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split('\t');
    const id = cols[idx['id']];
    const createdAtStr = cols[idx['createdAt']];
    const createdAt = new Date(createdAtStr);
    const from = cols[idx['from']];
    const fromName = cols[idx['fromName']];
    const to = cols[idx['to']];
    const toName = cols[idx['toName']];
    const message = cols[idx['message']] || '';
    const reactionsJson = cols[idx['reactions']] || '[]';
    const emojiRankingJson = cols[idx['emoji_ranking']] || '{}';

    let reactions = [];
    try {
      reactions = JSON.parse(reactionsJson);
    } catch (e) {
      reactions = [];
    }

    let emojiRanking = {};
    try {
      emojiRanking = JSON.parse(emojiRankingJson);
    } catch (e) {
      emojiRanking = {};
    }

    const month = createdAt.getMonth();

    if (from === uid) {
      monthlySent[month] += 1;
      totalSent += 1;
      partnerSentCounts[toName] = (partnerSentCounts[toName] || 0) + 1;
      sentMsgs.push({ id, createdAt, from, fromName, to, toName, message, reactions });
      Object.keys(emojiRanking).forEach((emoji) => {
        const c = Number(emojiRanking[emoji]) || 0;
        if (c > 0) emojiCountsSent[emoji] = (emojiCountsSent[emoji] || 0) + c;
      });
    }

    if (to === uid) {
      monthlyReceived[month] += 1;
      totalReceived += 1;
      partnerReceivedCounts[fromName] = (partnerReceivedCounts[fromName] || 0) + 1;
      receivedMsgs.push({ id, createdAt, from, fromName, to, toName, message, reactions });

      // sum emoji counts from emoji_ranking for received cards
      Object.keys(emojiRanking).forEach((emoji) => {
        const c = Number(emojiRanking[emoji]) || 0;
        if (c > 0) emojiCountsReceived[emoji] = (emojiCountsReceived[emoji] || 0) + c;
      });
    }
  }

  function topKeyCount(map) {
    let bestKey = null;
    let bestCount = 0;
    Object.keys(map).forEach((k) => {
      if (map[k] > bestCount) {
        bestCount = map[k];
        bestKey = k;
      }
    });
    return bestKey ? { name: bestKey, count: bestCount } : null;
  }

  function pickExtreme(arr, mode) {
    if (!arr || arr.length === 0) return null;
    // mode: 'longest' or 'shortest'
    const sorted = arr.slice().sort((a, b) => {
      const la = (a.message || '').length;
      const lb = (b.message || '').length;
      if (la === lb) return a.createdAt - b.createdAt; // older first
      return mode === 'longest' ? lb - la : la - lb;
    });
    const top = sorted[0];
    return {
      id: top.id,
      createdAt: top.createdAt.toISOString(),
      from: top.from,
      fromName: top.fromName,
      to: top.to,
      toName: top.toName,
      message: top.message,
      reactions: top.reactions || [],
      length: (top.message || '').length,
    };
  }

  // top 3 emojis sent
  const emojiArraySent = Object.keys(emojiCountsSent).map((e) => ({
    emoji: e,
    count: emojiCountsSent[e],
  }));
  emojiArraySent.sort((a, b) => b.count - a.count);
  const topSentEmojis = emojiArraySent.slice(0, 3);

  // top 3 emojis received
  const emojiArrayReceived = Object.keys(emojiCountsReceived).map((e) => ({
    emoji: e,
    count: emojiCountsReceived[e],
  }));
  emojiArrayReceived.sort((a, b) => b.count - a.count);
  const topReceivedEmojis = emojiArrayReceived.slice(0, 3);

  return {
    year,
    monthlySent,
    monthlyReceived,
    totalSent,
    totalReceived,
    mostSentTo: topKeyCount(partnerSentCounts),
    mostReceivedFrom: topKeyCount(partnerReceivedCounts),
    topSentEmojis,
    topReceivedEmojis,
    sentLongest: pickExtreme(sentMsgs, 'longest'),
    sentShortest: pickExtreme(sentMsgs, 'shortest'),
    receivedLongest: pickExtreme(receivedMsgs, 'longest'),
    receivedShortest: pickExtreme(receivedMsgs, 'shortest'),
    // include counts for client display if needed
    rawCounts: { partnerSentCounts, partnerReceivedCounts, emojiCountsReceived },
  };
}

export default getYearSummary;
