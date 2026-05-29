const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const rows = db
    .prepare('SELECT id, subject, reporter_email, priority, status, created_at FROM tickets ORDER BY created_at DESC')
    .all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'invalid id' });
  }
  const row = db
    .prepare('SELECT id, subject, reporter_email, priority, status, created_at FROM tickets WHERE id = ?')
    .get(id);
  if (!row) return res.status(404).json({ error: 'not found' });
  res.json(row);
});

module.exports = router;
