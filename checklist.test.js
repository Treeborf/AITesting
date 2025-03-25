npm install jest puppeteer jest-puppeteer --save-dev

const { setup, teardown } = require('jest-environment-puppeteer');
const puppeteer = require('puppeteer');

describe('Travel Checklist Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('https://your-username.github.io/travel-checklist/'); // Your GH Pages URL
  });

  afterAll(async () => {
    await browser.close();
  });

  // --- Boundary Cases ---
  test('Max Items Limit (Boundary)', async () => {
    // Test adding exactly 10 items (if max is 10)
    for (let i = 1; i <= 10; i++) {
      await page.type('#item-input', `Item ${i}`);
      await page.click('#add-button');
      await page.waitForTimeout(100);
    }
    const items = await page.$$eval('.checklist-item', els => els.length);
    expect(items).toBe(10);

    // Attempt to add 11th item (should fail)
    await page.type('#item-input', 'Item 11');
    await page.click('#add-button');
    const errorText = await page.$eval('.error-message', el => el.textContent);
    expect(errorText).toContain('Maximum 10 items allowed');
  });

  // --- Edge Cases ---
  test('Empty Input (Edge)', async () => {
    await page.click('#add-button');
    const errorText = await page.$eval('.error-message', el => el.textContent);
    expect(errorText).toContain('Item cannot be empty');
  });

  test('Special Characters (Edge)', async () => {
    await page.type('#item-input', 'Passport!@#$%^&*()_+');
    await page.click('#add-button');
    const itemText = await page.$eval('.checklist-item:last-child', el => el.textContent);
    expect(itemText).toContain('Passport!@#$%^&*()_+');
  });

  test('Long Text (Edge)', async () => {
    const longText = 'A'.repeat(500); // 500-character item
    await page.type('#item-input', longText);
    await page.click('#add-button');
    const itemText = await page.$eval('.checklist-item:last-child', el => el.textContent);
    expect(itemText).toContain('A'.repeat(500));
  });

  // --- Core Functionality ---
  test('Add/Remove Item', async () => {
    await page.type('#item-input', 'Test Item');
    await page.click('#add-button');
    const initialItems = await page.$$eval('.checklist-item', els => els.length);
    
    await page.click('.checklist-item:last-child .delete-button');
    const finalItems = await page.$$eval('.checklist-item', els => els.length);
    expect(finalItems).toBe(initialItems - 1);
  });
});
