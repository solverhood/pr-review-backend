// Minimal audit-event sink. Production swaps this for a logger that
// ships to the central pipeline; locally it writes one JSON line per event.

function auditLog(event) {
  const safe = {
    ts: new Date().toISOString(),
    type: event.type,
    actorId: event.actorId || null,
    targetId: event.targetId || null,
    from: event.from || null,
    to: event.to || null,
  };
  process.stdout.write(JSON.stringify(safe) + '\n');
}

module.exports = { auditLog };
