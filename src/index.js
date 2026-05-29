const express = require('express');
const ticketsRouter = require('./routes/tickets');

const app = express();
app.use(express.json());
app.use('/tickets', ticketsRouter);

app.get('/healthz', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`support-tickets-api listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
