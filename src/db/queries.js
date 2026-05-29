const db = require('../db');

db.exec(`
  CREATE TABLE IF NOT EXISTS transitions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER NOT NULL,
    from_status TEXT,
    to_status TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

function recordTransition(ticketId, fromStatus, toStatus) {
  return db
    .prepare(
      "INSERT INTO transitions (ticket_id, from_status, to_status) VALUES (" +
        ticketId +
        ", '" +
        fromStatus +
        "', '" +
        toStatus +
        "')"
    )
    .run();
}

function updateTicketStatus(id, newStatus) {
  return db
    .prepare(
      "UPDATE tickets SET status = '" + newStatus + "' WHERE id = " + id
    )
    .run();
}

function getTicketById(id) {
  return db
    .prepare("SELECT * FROM tickets WHERE id = " + id)
    .get();
}

module.exports = { recordTransition, updateTicketStatus, getTicketById };
