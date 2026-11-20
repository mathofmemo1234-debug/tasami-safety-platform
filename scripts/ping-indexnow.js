// IndexNow Instant Search Engine Notification Script
// Submits updated URLs directly to Microsoft Bing, Yandex, Seznam, and IndexNow network

import https from 'node:https';

const INDEXNOW_HOST = 'tasaami.com';
const INDEXNOW_KEY = '9f3d5e2a1b4c6d8e0f2a4b6c8d0e1f3a';
const KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;

const URLS_TO_INDEX = [
  `https://${INDEXNOW_HOST}/`,
  `https://${INDEXNOW_HOST}/services`,
  `https://${INDEXNOW_HOST}/products`,
  `https://${INDEXNOW_HOST}/about`,
  `https://${INDEXNOW_HOST}/contact`,
  `https://${INDEXNOW_HOST}/civil-defense-requirements`,
  `https://${INDEXNOW_HOST}/fire-suppression-systems`,
  `https://${INDEXNOW_HOST}/safety-equipment-supply`
];

const payload = JSON.stringify({
  host: INDEXNOW_HOST,
  key: INDEXNOW_KEY,
  keyLocation: KEY_LOCATION,
  urlList: URLS_TO_INDEX
});

const endpoints = [
  { hostname: 'api.indexnow.org', path: '/indexnow' },
  { hostname: 'www.bing.com', path: '/indexnow' }
];

console.log('🚀 Triggering IndexNow Search Engine Instant Submission for Tasami Business...');
console.log(`📦 URLs (${URLS_TO_INDEX.length}):`, URLS_TO_INDEX);

endpoints.forEach(({ hostname, path }) => {
  const req = https.request(
    {
      hostname,
      port: 443,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
      }
    },
    (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 202) {
          console.log(`✅ [${hostname}] IndexNow Ping Successful! (HTTP ${res.statusCode})`);
        } else {
          console.log(`ℹ️ [${hostname}] HTTP ${res.statusCode}: ${data || 'Queued/Processed'}`);
        }
      });
    }
  );

  req.on('error', (err) => {
    console.warn(`⚠️ [${hostname}] Request warning:`, err.message);
  });

  req.write(payload);
  req.end();
});
