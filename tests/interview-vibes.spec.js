const { test, expect } = require('@playwright/test');

const PAGE = '/index.html';

/** Click a radio by its id (clicks the visible label[for=id]) */
async function pickRadio(page, id) {
  await page.locator(`label[for="${id}"]`).click();
}

/** Set a question to a specific value (0, 1, or 2) by clicking the label.
 *  Radio ids follow the pattern: {name}-a (2), {name}-b (1), {name}-c (0) */
async function setQuestion(page, name, value) {
  const suffix = value === 2 ? 'a' : value === 1 ? 'b' : 'c';
  await pickRadio(page, `${name}-${suffix}`);
}

/** Set all 18 base questions to a value */
async function setAllBase(page, value) {
  const names = [
    'comm-1','comm-2','comm-3','story-1','story-2','story-3',
    'tech-1','tech-2','tech-3','own-1','own-2','own-3',
    'solve-1','solve-2','solve-3','vibe-1','vibe-2','vibe-3',
  ];
  for (const name of names) {
    await setQuestion(page, name, value);
  }
}

// ── Page Load & Structure ──

test.describe('Page Load', () => {
  test('loads with correct title', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page).toHaveTitle(/Behavioral Interview Aid/);
  });

  test('has SEO meta tags', async ({ page }) => {
    await page.goto(PAGE);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    expect(description.length).toBeGreaterThan(50);

    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toBeTruthy();

    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    expect(twitterCard).toBe('summary_large_image');

    const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content');
    expect(twitterImage).toBeTruthy();

    const jsonLdElements = await page.locator('script[type="application/ld+json"]').all();
    expect(jsonLdElements.length).toBeGreaterThanOrEqual(2);

    const appSchema = JSON.parse(await jsonLdElements[0].textContent());
    expect(appSchema['@type']).toBe('WebApplication');
    expect(appSchema.featureList).toBeTruthy();

    const faqSchema = JSON.parse(await jsonLdElements[1].textContent());
    expect(faqSchema['@type']).toBe('FAQPage');
  });

  test('has semantic HTML landmarks', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.locator('header.header-bar')).toBeVisible();
    await expect(page.locator('nav[aria-label="Main navigation"]')).toBeVisible();
    await expect(page.locator('main.content-area')).toBeVisible();
    await expect(page.locator('aside.score-sidebar')).toBeVisible();
  });

  test('has favicon links', async ({ page }) => {
    await page.goto(PAGE);
    const ico = await page.locator('link[rel="icon"][type="image/x-icon"]').getAttribute('href');
    expect(ico).toBe('favicon.ico');
  });
});

// ── Header Navigation ──

test.describe('Header', () => {
  test('shows Reset and Medium nav links', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.locator('nav a').filter({ hasText: 'Reset' })).toBeVisible();
    await expect(page.locator('nav a').filter({ hasText: 'Medium' })).toBeVisible();
  });

  test('Medium link points to correct URL', async ({ page }) => {
    await page.goto(PAGE);
    const href = await page.locator('nav a').filter({ hasText: 'Medium' }).getAttribute('href');
    expect(href).toBe('https://lucianoadonis.medium.com/list/tips-entrevistas-32c6eb8c1547');
  });

  test('Medium link opens in new tab', async ({ page }) => {
    await page.goto(PAGE);
    const target = await page.locator('nav a').filter({ hasText: 'Medium' }).getAttribute('target');
    expect(target).toBe('_blank');
  });
});

// ── Category Sections ──

test.describe('Categories', () => {
  const categories = [
    'Communication & Clarity',
    'Story Consistency',
    'Technical Credibility',
    'Ownership & Accountability',
    'Problem-Solving & Pressure',
    'The Vibe',
  ];

  for (const cat of categories) {
    test(`renders "${cat}" section`, async ({ page }) => {
      await page.goto(PAGE);
      await expect(page.locator('h2').filter({ hasText: cat })).toBeVisible();
    });
  }

  test('each category has 3 base questions', async ({ page }) => {
    await page.goto(PAGE);
    const cards = page.locator('.content-area > .card');
    const count = await cards.count();
    expect(count).toBe(9); // 6 categories + candidate + piece profile + notes

    for (let i = 1; i <= 6; i++) {
      const questions = cards.nth(i).locator(':scope > .control-group');
      const qCount = await questions.count();
      expect(qCount).toBe(3);
    }
  });

  test('all 18 base questions have help buttons', async ({ page }) => {
    await page.goto(PAGE);
    const helpButtons = page.locator('.content-area > .card > .control-group .help-trigger');
    await expect(helpButtons).toHaveCount(18);
  });
});

// ── Scoring ──

test.describe('Scoring', () => {
  test('initial state shows 50% Borderline', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.locator('#score-pct')).toContainText('50');
    await expect(page.locator('#verdict-label')).toHaveText('Borderline');
    await expect(page.locator('#score-total')).toHaveText('18');
  });

  test('selecting Good increases score', async ({ page }) => {
    await page.goto(PAGE);
    await setQuestion(page, 'comm-1', 2);
    await expect(page.locator('#score-total')).toHaveText('19');
    await expect(page.locator('#badge-comm')).toHaveText('4/6');
  });

  test('selecting Bad decreases score', async ({ page }) => {
    await page.goto(PAGE);
    await setQuestion(page, 'comm-1', 0);
    await expect(page.locator('#score-total')).toHaveText('17');
    await expect(page.locator('#badge-comm')).toHaveText('2/6');
  });

  test('all Good produces Strong Pass at 100%', async ({ page }) => {
    await page.goto(PAGE);
    await setAllBase(page, 2);
    await expect(page.locator('#score-pct')).toContainText('100');
    await expect(page.locator('#verdict-label')).toHaveText('Strong Pass');
    await expect(page.locator('#score-total')).toHaveText('36');
  });

  test('all Bad produces No Pass at 0%', async ({ page }) => {
    await page.goto(PAGE);
    await setAllBase(page, 0);
    await expect(page.locator('#score-pct')).toContainText('0');
    await expect(page.locator('#verdict-label')).toHaveText('No Pass');
    await expect(page.locator('#score-total')).toHaveText('0');
  });

  test('sidebar breakdown bars update', async ({ page }) => {
    await page.goto(PAGE);
    await setQuestion(page, 'comm-1', 2);
    await setQuestion(page, 'comm-2', 2);
    await setQuestion(page, 'comm-3', 2);
    await expect(page.locator('#val-comm')).toHaveText('6/6');
  });

  test('category badge gets color classes', async ({ page }) => {
    await page.goto(PAGE);
    await setQuestion(page, 'comm-1', 2);
    await setQuestion(page, 'comm-2', 2);
    await setQuestion(page, 'comm-3', 2);
    await expect(page.locator('#badge-comm')).toHaveClass(/score-high/);

    await setQuestion(page, 'tech-1', 0);
    await setQuestion(page, 'tech-2', 0);
    await setQuestion(page, 'tech-3', 0);
    await expect(page.locator('#badge-tech')).toHaveClass(/score-low/);
  });

  test('verdict card changes gradient class', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.locator('#score-card')).toHaveClass(/verdict-borderline/);
    await setAllBase(page, 2);
    await expect(page.locator('#score-card')).toHaveClass(/verdict-strong-pass/);
  });
});

// ── Probe Sections ──

test.describe('Probe Dropdowns', () => {
  test('all probes start closed', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.locator('#tech-probes')).not.toHaveAttribute('open', '');
    await expect(page.locator('#own-probes')).not.toHaveAttribute('open', '');
    await expect(page.locator('#solve-probes')).not.toHaveAttribute('open', '');
  });

  test('Technical probes open and show 2 questions', async ({ page }) => {
    await page.goto(PAGE);
    await page.locator('#tech-probes summary').click();
    await expect(page.locator('#tech-probes')).toHaveAttribute('open', '');
    await expect(page.locator('#tech-probes .probe-content .control-group')).toHaveCount(2);
  });

  test('Ownership probes open and show 1 question', async ({ page }) => {
    await page.goto(PAGE);
    await page.locator('#own-probes summary').click();
    await expect(page.locator('#own-probes')).toHaveAttribute('open', '');
    await expect(page.locator('#own-probes .probe-content .control-group')).toHaveCount(1);
  });

  test('Problem-Solving probes open and show 5 questions', async ({ page }) => {
    await page.goto(PAGE);
    await page.locator('#solve-probes summary').click();
    await expect(page.locator('#solve-probes')).toHaveAttribute('open', '');
    await expect(page.locator('#solve-probes .probe-content .control-group')).toHaveCount(5);
  });

  test('tech probe tag shows Recommended when category has a 0', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.locator('#tech-probe-tag')).toHaveText('(Optional)');
    await setQuestion(page, 'tech-1', 0);
    await expect(page.locator('#tech-probe-tag')).toHaveText('(Recommended)');
  });

  test('solve probe tag shows Recommended on 0', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.locator('#solve-probe-tag')).toHaveText('(Optional)');
    await setQuestion(page, 'solve-2', 0);
    await expect(page.locator('#solve-probe-tag')).toHaveText('(Recommended)');
  });

  test('probe scores do not affect main total', async ({ page }) => {
    await page.goto(PAGE);
    const before = await page.locator('#score-total').textContent();

    await page.locator('#tech-probes summary').click();
    await pickRadio(page, 'tp1-a'); // tech-p1 = 2
    await pickRadio(page, 'tp2-a'); // tech-p2 = 2

    const after = await page.locator('#score-total').textContent();
    expect(before).toBe(after);
  });
});

// ── Help Modal ──

test.describe('Help Modal', () => {
  test('opens when ? button is clicked', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.locator('#help-overlay')).not.toHaveClass(/visible/);
    await page.locator('.help-trigger').first().click();
    await expect(page.locator('#help-overlay')).toHaveClass(/visible/);
    await expect(page.locator('#help-title')).not.toBeEmpty();
  });

  test('shows objective, suggested questions, and look-for sections', async ({ page }) => {
    await page.goto(PAGE);
    await page.locator('.help-trigger').first().click();
    const texts = await page.locator('.help-section-label').allTextContents();
    expect(texts).toContain('Objective');
    expect(texts).toContain('Try Asking');
    expect(texts).toContain('Look For');
  });

  test('closes with X button', async ({ page }) => {
    await page.goto(PAGE);
    await page.locator('.help-trigger').first().click();
    await expect(page.locator('#help-overlay')).toHaveClass(/visible/);
    await page.locator('.help-modal-close').click();
    await expect(page.locator('#help-overlay')).not.toHaveClass(/visible/);
  });

  test('closes with Escape key', async ({ page }) => {
    await page.goto(PAGE);
    await page.locator('.help-trigger').first().click();
    await expect(page.locator('#help-overlay')).toHaveClass(/visible/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#help-overlay')).not.toHaveClass(/visible/);
  });

  test('closes when clicking overlay background', async ({ page }) => {
    await page.goto(PAGE);
    await page.locator('.help-trigger').first().click();
    await expect(page.locator('#help-overlay')).toHaveClass(/visible/);
    await page.locator('#help-overlay').click({ position: { x: 10, y: 10 } });
    await expect(page.locator('#help-overlay')).not.toHaveClass(/visible/);
  });
});

// ── Reset ──

test.describe('Reset', () => {
  test('Reset nav button clears everything', async ({ page }) => {
    await page.goto(PAGE);
    await page.locator('#candidate-name').fill('Test Person');
    await setQuestion(page, 'comm-1', 2);
    await setQuestion(page, 'comm-2', 2);
    await page.locator('#notes').fill('Some notes');
    await page.locator('#tech-probes summary').click();

    await expect(page.locator('#score-total')).toHaveText('20');
    await expect(page.locator('#tech-probes')).toHaveAttribute('open', '');

    await page.locator('nav a').filter({ hasText: 'Reset' }).click();

    await expect(page.locator('#candidate-name')).toHaveValue('');
    await expect(page.locator('#notes')).toHaveValue('');
    await expect(page.locator('#score-total')).toHaveText('18');
    await expect(page.locator('#score-pct')).toContainText('50');
    await expect(page.locator('#tech-probes')).not.toHaveAttribute('open', '');
  });

  test('sidebar Reset Assessment button works', async ({ page }) => {
    await page.goto(PAGE);
    await page.locator('#candidate-name').fill('Test');
    await setQuestion(page, 'vibe-1', 2);
    await page.locator('.reset-button').click();
    await expect(page.locator('#candidate-name')).toHaveValue('');
    await expect(page.locator('#score-total')).toHaveText('18');
  });

  test('reset closes all probe dropdowns', async ({ page }) => {
    await page.goto(PAGE);
    await page.locator('#solve-probes summary').click();
    await page.locator('#tech-probes summary').click();
    await expect(page.locator('#solve-probes')).toHaveAttribute('open', '');
    await expect(page.locator('#tech-probes')).toHaveAttribute('open', '');

    await page.locator('.reset-button').click();
    await expect(page.locator('#solve-probes')).not.toHaveAttribute('open', '');
    await expect(page.locator('#tech-probes')).not.toHaveAttribute('open', '');
    await expect(page.locator('#own-probes')).not.toHaveAttribute('open', '');
  });
});

// ── Downloads ──

test.describe('Downloads', () => {
  test('Download Internal Review triggers a file download', async ({ page }) => {
    await page.goto(PAGE);
    await page.locator('#candidate-name').fill('Jane Doe');
    const downloadPromise = page.waitForEvent('download');
    await page.locator('button').filter({ hasText: 'Download Internal Review' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/jane-doe.*internal-review\.md$/);
  });

  test('Download Candidate Feedback triggers a file download', async ({ page }) => {
    await page.goto(PAGE);
    await page.locator('#candidate-name').fill('Jane Doe');
    const downloadPromise = page.waitForEvent('download');
    await page.locator('button').filter({ hasText: 'Download Candidate Feedback' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/jane-doe.*feedback\.md$/);
  });

  test('internal report contains score data', async ({ page }) => {
    await page.goto(PAGE);
    await page.locator('#candidate-name').fill('Test Candidate');
    await setQuestion(page, 'comm-1', 2);

    const downloadPromise = page.waitForEvent('download');
    await page.locator('button').filter({ hasText: 'Download Internal Review' }).click();
    const download = await downloadPromise;
    const content = await (await download.createReadStream()).toArray();
    const text = Buffer.concat(content).toString();

    expect(text).toContain('Test Candidate');
    expect(text).toContain('Internal Review');
    expect(text).toContain('/36');
    expect(text).toContain('Verdict');
  });

  test('candidate feedback contains growth areas for weak scores', async ({ page }) => {
    await page.goto(PAGE);
    await page.locator('#candidate-name').fill('Low Scorer');
    await setQuestion(page, 'tech-1', 0);
    await setQuestion(page, 'tech-2', 0);
    await setQuestion(page, 'tech-3', 0);

    const downloadPromise = page.waitForEvent('download');
    await page.locator('button').filter({ hasText: 'Download Candidate Feedback' }).click();
    const download = await downloadPromise;
    const content = await (await download.createReadStream()).toArray();
    const text = Buffer.concat(content).toString();

    expect(text).toContain('Low Scorer');
    expect(text).toContain('Areas for Growth');
    expect(text).toContain('Technical');
  });

  test('internal report includes probe findings when probes are open', async ({ page }) => {
    await page.goto(PAGE);
    await page.locator('#candidate-name').fill('Probed');
    await page.locator('#tech-probes summary').click();
    await pickRadio(page, 'tp1-c'); // tech-p1 = 0

    const downloadPromise = page.waitForEvent('download');
    await page.locator('button').filter({ hasText: 'Download Internal Review' }).click();
    const download = await downloadPromise;
    const content = await (await download.createReadStream()).toArray();
    const text = Buffer.concat(content).toString();

    expect(text).toContain('Probe Findings');
    expect(text).toContain('Hands-on exposure');
  });

  test('internal report includes solve probe findings when open', async ({ page }) => {
    await page.goto(PAGE);
    await page.locator('#candidate-name').fill('SolveProbed');
    await page.locator('#solve-probes summary').click();
    await pickRadio(page, 'sp1-a'); // solve-p1 = 2

    const downloadPromise = page.waitForEvent('download');
    await page.locator('button').filter({ hasText: 'Download Internal Review' }).click();
    const download = await downloadPromise;
    const content = await (await download.createReadStream()).toArray();
    const text = Buffer.concat(content).toString();

    expect(text).toContain('Probe Findings');
    expect(text).toContain('Design trade-offs');
  });
});

// ── Auto-Advance ──

test.describe('Auto-Advance', () => {
  test('clicking a radio scrolls page toward next question', async ({ page }) => {
    await page.goto(PAGE);
    const scrollBefore = await page.evaluate(() => window.pageYOffset);
    await setQuestion(page, 'comm-1', 2);
    await page.waitForTimeout(1200);
    const scrollAfter = await page.evaluate(() => window.pageYOffset);
    expect(scrollAfter).toBeGreaterThanOrEqual(scrollBefore);
  });

  test('highlight animation class is applied and removed', async ({ page }) => {
    await page.goto(PAGE);
    await setQuestion(page, 'comm-1', 2);
    // Wait for delay + animation to complete
    await page.waitForTimeout(3000);
    const count = await page.locator('.control-group.highlight-next').count();
    expect(count).toBe(0);
  });
});

// ── Verdict Thresholds ──

test.describe('Verdict Thresholds', () => {
  test('Likely Pass at 67%', async ({ page }) => {
    await page.goto(PAGE);
    // 6 questions at 2 + 12 at 1 = 24/36 = 67%
    await setQuestion(page, 'comm-1', 2);
    await setQuestion(page, 'comm-2', 2);
    await setQuestion(page, 'comm-3', 2);
    await setQuestion(page, 'story-1', 2);
    await setQuestion(page, 'story-2', 2);
    await setQuestion(page, 'story-3', 2);
    await expect(page.locator('#verdict-label')).toHaveText('Likely Pass');
  });

  test('Unlikely at low score', async ({ page }) => {
    await page.goto(PAGE);
    await setAllBase(page, 0);
    // Add back 12 points: 6 questions to 2 = 12/36 = 33%
    await setQuestion(page, 'comm-1', 2);
    await setQuestion(page, 'comm-2', 2);
    await setQuestion(page, 'comm-3', 2);
    await setQuestion(page, 'story-1', 2);
    await setQuestion(page, 'story-2', 2);
    await setQuestion(page, 'story-3', 2);
    await expect(page.locator('#verdict-label')).toHaveText('Unlikely');
  });
});

// ── Piece Profile ──

test.describe('Piece Profile', () => {
  test('piece profile card is visible with all 5 pieces', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.locator('#piece-card')).toBeVisible();
    const tiles = page.locator('.piece-tile');
    await expect(tiles).toHaveCount(5);
  });

  test('default scores auto-detect Knight as best match', async ({ page }) => {
    await page.goto(PAGE);
    // At default (all 3/6), Knight has highest match due to medium profile
    await expect(page.locator('#piece-knight')).toHaveClass(/selected/);
    await expect(page.locator('#piece-detail-name')).toHaveText('Knight');
    await expect(page.locator('#piece-detail-tag')).toContainText('Best Match');
  });

  test('strong candidate matches Queen', async ({ page }) => {
    await page.goto(PAGE);
    await setAllBase(page, 2);
    await expect(page.locator('#piece-queen')).toHaveClass(/selected/);
    await expect(page.locator('#piece-detail-name')).toHaveText('Queen');
    await expect(page.locator('#pct-queen')).toHaveText('100%');
  });

  test('weak candidate matches Pawn', async ({ page }) => {
    await page.goto(PAGE);
    await setAllBase(page, 0);
    await expect(page.locator('#piece-pawn')).toHaveClass(/selected/);
    await expect(page.locator('#piece-detail-name')).toHaveText('Pawn');
    await expect(page.locator('#pct-pawn')).toHaveText('100%');
  });

  test('clicking a piece selects it manually', async ({ page }) => {
    await page.goto(PAGE);
    await page.locator('#piece-rook').click();
    await expect(page.locator('#piece-rook')).toHaveClass(/selected/);
    await expect(page.locator('#piece-detail-name')).toHaveText('Rook');
    await expect(page.locator('#piece-detail-tag')).toContainText('Manual');
    await expect(page.locator('#piece-auto-label a')).toHaveText('Reset to auto-detect');
  });

  test('clicking selected piece deselects back to auto', async ({ page }) => {
    await page.goto(PAGE);
    await page.locator('#piece-bishop').click();
    await expect(page.locator('#piece-detail-tag')).toContainText('Manual');
    await page.locator('#piece-bishop').click();
    await expect(page.locator('#piece-detail-tag')).toContainText('Best Match');
  });

  test('sidebar shows piece indicator', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.locator('#sidebar-piece-icon')).toBeVisible();
    await expect(page.locator('#sidebar-piece-name')).toContainText('%');
  });

  test('piece match percentages update with scores', async ({ page }) => {
    await page.goto(PAGE);
    const queenBefore = await page.locator('#pct-queen').textContent();
    await setAllBase(page, 2);
    const queenAfter = await page.locator('#pct-queen').textContent();
    expect(queenBefore).not.toBe(queenAfter);
  });

  test('piece detail shows dimension bars', async ({ page }) => {
    await page.goto(PAGE);
    const dims = page.locator('#piece-dims .piece-dim-row');
    await expect(dims).toHaveCount(6);
  });

  test('reset clears piece selection to auto', async ({ page }) => {
    await page.goto(PAGE);
    await page.locator('#piece-bishop').click();
    await expect(page.locator('#piece-detail-tag')).toContainText('Manual');
    await page.locator('.reset-button').click();
    await expect(page.locator('#piece-detail-tag')).toContainText('Best Match');
  });

  test('internal report includes piece profile section', async ({ page }) => {
    await page.goto(PAGE);
    const md = await page.evaluate(() => generateInternalReport());
    expect(md).toContain('## Piece Profile');
    expect(md).toContain('Identified Piece');
    expect(md).toContain('Dimension');
  });
});

// ── Responsive ──

test.describe('Responsive', () => {
  test('sidebar stacks on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(PAGE);
    await expect(page.locator('.score-sidebar')).toBeVisible();
  });
});
