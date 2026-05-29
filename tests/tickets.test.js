const test = require('node:test');
const assert = require('node:assert');
const http = require('http');

process.env.DB_PATH = ':memory:';
const app = require('../src/index');

function get(path) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const port = server.address().port;
      http.get(`http://localhost:${port}${path}`, (res) => {
        let body = '';
        res.on('data', (d) => (body += d));
        res.on('end', () => {
          server.close();
          resolve({ status: res.statusCode, body });
        });
      }).on('error', reject);
    });
  });
}

test('GET /tickets returns an array', async () => {
  const { status, body } = await get('/tickets');
  assert.strictEqual(status, 200);
  assert.ok(Array.isArray(JSON.parse(body)));
});
