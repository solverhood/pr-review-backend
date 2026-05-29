const test = require('node:test');
const assert = require('node:assert');
const http = require('http');

process.env.DB_PATH = ':memory:';
const app = require('../src/index');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const port = server.address().port;
      const data = JSON.stringify(body);
      const req = http.request(
        {
          hostname: 'localhost',
          port,
          path,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
          },
        },
        (res) => {
          let buf = '';
          res.on('data', (d) => (buf += d));
          res.on('end', () => {
            server.close();
            resolve({ status: res.statusCode, body: buf });
          });
        }
      );
      req.on('error', reject);
      req.write(data);
      req.end();
    });
  });
}

test('POST /tickets/:id/transitions moves the ticket to the new status', async () => {
  const { status, body } = await post('/tickets/1/transitions', {
    newStatus: 'in_progress',
  });
  assert.strictEqual(status, 200);
  const parsed = JSON.parse(body);
  assert.strictEqual(parsed.status, 'in_progress');
});
