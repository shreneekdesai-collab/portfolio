const fs = require('node:fs/promises');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const STATS_PATH = path.join(ROOT, 'data', 'stats.json');
const LEETCODE_USERNAME = 'shreneek9696';
const CODECHEF_URL = 'https://www.codechef.com/users/shreneek';
const LEETCODE_URL = 'https://leetcode.com/graphql';

const leetcodeQuery = `
  query userStats($username: String!) {
    matchedUser(username: $username) {
      submitStats {
        acSubmissionNum { difficulty count }
      }
    }
  }
`;

async function fetchLeetCode() {
  const response = await fetch(LEETCODE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com' },
    body: JSON.stringify({ query: leetcodeQuery, variables: { username: LEETCODE_USERNAME } })
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const payload = await response.json();
  const entries = payload.data?.matchedUser?.submitStats?.acSubmissionNum;
  if (!Array.isArray(entries)) throw new Error('missing submitStats data');

  const byDifficulty = Object.fromEntries(entries.map(entry => [entry.difficulty, Number(entry.count)]));
  const solved = byDifficulty.All;
  if (!Number.isFinite(solved) || solved <= 0) throw new Error('invalid All count');

  return {
    solved,
    easy: Number.isFinite(byDifficulty.Easy) && byDifficulty.Easy > 0 ? byDifficulty.Easy : 0,
    medium: Number.isFinite(byDifficulty.Medium) && byDifficulty.Medium > 0 ? byDifficulty.Medium : 0,
    hard: Number.isFinite(byDifficulty.Hard) && byDifficulty.Hard > 0 ? byDifficulty.Hard : 0
  };
}

async function fetchCodeChef() {
  const response = await fetch(CODECHEF_URL, { headers: { 'User-Agent': 'portfolio-stats-bot/1.0' } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const html = await response.text();
  const match = html.match(/Total\s+Problems\s+Solved\s*:\s*([\d,]+)/i);
  const solved = match ? Number(match[1].replaceAll(',', '')) : 0;
  if (!Number.isFinite(solved) || solved <= 0) throw new Error('missing or invalid solved count');
  return { solved };
}

async function main() {
  const oldStats = JSON.parse(await fs.readFile(STATS_PATH, 'utf8'));
  const updatedStats = {
    leetcode: { ...oldStats.leetcode },
    codechef: { ...oldStats.codechef },
    updatedAt: new Date().toISOString()
  };

  try {
    updatedStats.leetcode = await fetchLeetCode();
    console.log(`LeetCode: updated to ${updatedStats.leetcode.solved} solved (Easy ${updatedStats.leetcode.easy}, Medium ${updatedStats.leetcode.medium}, Hard ${updatedStats.leetcode.hard}).`);
  } catch (error) {
    console.log(`LeetCode: failed (${error.message}); keeping ${oldStats.leetcode.solved}.`);
  }

  try {
    updatedStats.codechef = await fetchCodeChef();
    console.log(`CodeChef: updated to ${updatedStats.codechef.solved} solved.`);
  } catch (error) {
    console.log(`CodeChef: failed (${error.message}); keeping ${oldStats.codechef.solved}.`);
  }

  await fs.writeFile(STATS_PATH, `${JSON.stringify(updatedStats, null, 2)}\n`);
  console.log(`Stats written to data/stats.json at ${updatedStats.updatedAt}.`);
}

main().catch(error => {
  console.error(`Stats update failed: ${error.message}`);
  process.exitCode = 1;
});
