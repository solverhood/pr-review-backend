const STATUSES = ['new', 'triaged', 'in_progress', 'resolved', 'closed', 'cancelled'];

const ALLOWED_TRANSITIONS = {
  new: ['triaged', 'cancelled'],
  triaged: ['in_progress', 'cancelled'],
  in_progress: ['resolved', 'cancelled'],
  resolved: ['closed'],
  closed: [],
  cancelled: [],
};

function isValidStatus(status) {
  return STATUSES.includes(status);
}

function isAllowedTransition(fromStatus, toStatus) {
  const allowed = ALLOWED_TRANSITIONS[fromStatus] || [];
  return allowed.includes(toStatus);
}

module.exports = { STATUSES, ALLOWED_TRANSITIONS, isValidStatus, isAllowedTransition };
