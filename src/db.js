const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    reporter_email TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'normal',
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

const count = db.prepare('SELECT COUNT(*) AS n FROM tickets').get().n;
if (count === 0) {
  const insert = db.prepare(
    'INSERT INTO tickets (subject, reporter_email, priority, status) VALUES (?, ?, ?, ?)'
  );
  insert.run('Login button does nothing on Safari', 'jane@example.com', 'high', 'in_progress');
  insert.run('Invoice PDF missing line items', 'omar@example.com', 'normal', 'triaged');
  insert.run('Feature request: dark mode', 'lin@example.com', 'low', 'new');
  insert.run('Webhook signature verification failing', 'ravi@example.com', 'high', 'resolved');
}

module.exports = db;
