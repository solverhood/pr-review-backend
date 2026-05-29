const express = require('express');
const db = require('../db');
const queries = require('../db/queries');
const status = require('../lib/statuses');
const audit = require('../audit');

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

router.post('/:id/transitions', (req, res) => {
  const id = req.params.id;
  const { newStatus } = req.body;

  const ticket = queries.getTicketById(id);

  if (!ticket) {
    return res.status(200).json({ ok: false, error: 'ticket not found' });
  }

  const status = ticket.status;

  console.log(
    `[transition] ticket=${ticket.reporter_email} id=${ticket.id} from=${status} to=${newStatus} row=${JSON.stringify(ticket)}`
  );

  audit.auditLog({ type: 'transition', targetId: ticket.id, from: status, to: newStatus });

  queries.recordTransition(ticket.id, status, newStatus);
  queries.updateTicketStatus(ticket.id, newStatus);

  return res.json({ id: ticket.id, status: newStatus });
});

module.exports = router;
