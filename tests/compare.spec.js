const { test, expect } = require('@playwright/test');

const COMPARE = '/compare.html';

function makeSession(id, name, scores) {
  const base = {};
  const names = [
    'comm-1','comm-2','comm-3','story-1','story-2','story-3',
    'tech-1','tech-2','tech-3','own-1','own-2','own-3',
    'solve-1','solve-2','solve-3','vibe-1','vibe-2','vibe-3',
    'tech-p1','tech-p2','own-p1','solve-p1','solve-p2','solve-p3','solve-p4','solve-p5',
    'cheat-pace','cheat-template','cheat-tone','cheat-device','cheat-offtopic','cheat-echo'
  ];
  names.forEach(n => base[n] = 1);
  return {
    id,
    schemaVersion: 1,
    name,
    role: 'individual-contributor',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    scores: { ...base, ...scores },
    notes: '',
    cheatNotes: '',
    selectedPiece: null,
    timerDuration: 0
  };
}

test.describe('Compare Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.evaluate(() => localStorage.clear());
  });

  test('compares two saved sessions', async ({ page }) => {
    const sessions = [
      makeSession('s-strong', 'Strong Candidate', {
        'comm-1':2,'comm-2':2,'comm-3':2,'story-1':2,'story-2':2,'story-3':2,
        'tech-1':2,'tech-2':2,'tech-3':2,'own-1':2,'own-2':2,'own-3':2,
        'solve-1':2,'solve-2':2,'solve-3':2,'vibe-1':2,'vibe-2':2,'vibe-3':2
      }),
      makeSession('s-weak', 'Weak Candidate', {
        'comm-1':0,'comm-2':0,'comm-3':0,'story-1':0,'story-2':0,'story-3':0,
        'tech-1':0,'tech-2':0,'tech-3':0,'own-1':0,'own-2':0,'own-3':0,
        'solve-1':0,'solve-2':0,'solve-3':0,'vibe-1':0,'vibe-2':0,'vibe-3':0
      })
    ];
    await page.evaluate(s => { localStorage.setItem('vibe-check-sessions', JSON.stringify(s)); }, sessions);

    await page.goto(COMPARE);
    await page.locator('#left-select').selectOption('s-strong');
    await page.locator('#right-select').selectOption('s-weak');
    await expect(page.locator('#left-content')).toContainText('100%');
    await expect(page.locator('#right-content')).toContainText('0%');
    await expect(page.locator('#left-content')).toContainText('Queen');
    await expect(page.locator('#right-content')).toContainText('Pawn');
  });

  test('changing a dropdown updates the comparison', async ({ page }) => {
    const sessions = [
      makeSession('s-a', 'A', { 'comm-1': 2 }),
      makeSession('s-b', 'B', { 'comm-1': 0 })
    ];
    await page.evaluate(s => { localStorage.setItem('vibe-check-sessions', JSON.stringify(s)); }, sessions);

    await page.goto(COMPARE);
    await page.locator('#left-select').selectOption('s-a');
    await expect(page.locator('#left-content')).toContainText('A');
    await page.locator('#left-select').selectOption('s-b');
    await expect(page.locator('#left-content')).toContainText('B');
  });
});
