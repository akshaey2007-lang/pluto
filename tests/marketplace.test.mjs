import test from 'node:test';
import assert from 'node:assert/strict';
import { handleApi, validateProject, validateProposal } from '../render-api.mjs';

const future = new Date(Date.now() + 20 * 86400000).toISOString().slice(0, 10);
const project = { title: 'Customer portal refresh', description: 'Redesign our customer portal to make billing and account tasks easier for customers.', category: 'Design', deliverables: 'Responsive page designs and a documented component system.', budget_paise: 2500000, deadline: future, skills: ['Figma', 'UI/UX design'] };
const proposal = { cover_letter: 'I will map the current customer journeys, design responsive layouts, and deliver a documented component library.', quote_paise: 2200000, delivery_days: 21 };
const origin = 'https://pluto.test';
const unauthenticatedDb = { async query() { return { rows: [], rowCount: 0 }; } };

test('project validation requires a real future date, known skills and a complete brief', () => {
  assert.deepEqual(validateProject(project), project);
  for (const change of [
    { title: 'Tiny' }, { description: 'Too short' }, { budget_paise: 99 },
    { deadline: '2026-02-30' }, { deadline: 'not-a-date' }, { deadline: '2020-01-01' },
    { skills: [] }, { skills: ['Unknown skill'] }, { skills: ['Figma', 'Figma'] }
  ]) assert.throws(() => validateProject({ ...project, ...change }));
});

test('proposal validation preserves INR paise and rejects invalid quote or timeframe', () => {
  assert.deepEqual(validateProposal(proposal), proposal);
  for (const change of [{ quote_paise: 99 }, { quote_paise: 12.5 }, { delivery_days: 0 }, { cover_letter: 'Brief' }]) assert.throws(() => validateProposal({ ...proposal, ...change }));
});

test('private routes require a session and mutations require same origin', async () => {
  const get = new Request(origin + '/api/me');
  assert.equal((await handleApi(get, unauthenticatedDb)).status, 401);
  const post = new Request(origin + '/api/reports', { method: 'POST', headers: { Origin: 'https://elsewhere.test', 'Content-Type': 'application/json' }, body: '{}' });
  assert.equal((await handleApi(post, unauthenticatedDb)).status, 403);
});
