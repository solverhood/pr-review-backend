# Add ticket status transition endpoint

## What

Adds a new endpoint so support agents can move a ticket through its workflow:

`POST /tickets/:id/transitions`

Request body:
```json
{ "newStatus": "in_progress" }
```

Successful response:
```json
{ "id": 1, "status": "in_progress" }
```

Also adds:

- A new `transitions` table that records every status change (so we can look at a ticket's full history later)
- A small query helper module `src/db/queries.js` for transition writes
- Audit logging — we log each transition to stdout AND emit a structured event via the existing audit helper

## Why

Product asked for this. Agents are currently editing the DB by hand to move tickets.

## How to test

```
curl -X POST http://localhost:3000/tickets/1/transitions \
  -H 'Content-Type: application/json' \
  -d '{ "newStatus": "in_progress" }'
```

There's a new test in `tests/transitions.test.js` covering the happy path.

## Notes

- I kept the auth question for follow-up — assuming the gateway already handles it
- Validation is minimal; we trust the agents to send the right value
- History query endpoint is not in this PR — will follow up

## Question for the reviewer

Of the choices I made in this PR, which ONE do you find most defensible? I was on the fence about several decisions and would genuinely value your opinion on what I got right.
