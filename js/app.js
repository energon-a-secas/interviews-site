import { getPlaceholderName } from './utils.js';
import { calculate } from './scoring.js';
import { initEvents } from './events.js';
import { applyFormState } from './session.js';
import { getCurrentSession } from './storage.js';

document.getElementById('candidate-name').placeholder = getPlaceholderName();
initEvents();

const current = getCurrentSession();
if (current) {
  applyFormState(current);
}
calculate();
