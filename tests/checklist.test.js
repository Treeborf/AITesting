const puppeteer = require('puppeteer');

describe('Travel Checklist Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    await page.goto('https://treeborf.github.io/AITesting/checklist.html');
    await page.waitForSelector('#checklist');
  }, 15000);

  beforeEach(async () => {
    // Reset state before each test
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const resetButton = buttons.find(btn => btn.textContent.includes('Reset All'));
      resetButton?.click();
    });
    await page.waitForSelector('#checklist:empty');
  });

  afterAll(async () => {
    await browser.close();
  });

  // Generic button click helper
  const clickButtonWithText = async (text) => {
    await page.evaluate((btnText) => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const targetButton = buttons.find(btn => btn.textContent.trim() === btnText);
      if (targetButton) targetButton.click();
    }, text);
  };

  test('Add valid item', async () => {
    await page.type('#newItem', 'Passport');
    await clickButtonWithText('Add Item');
    
    await page.waitForSelector('#checklist li');
    const items = await page.$$eval('#checklist li', items => 
      items.map(item => item.querySelector('input[type="text"]').value)
    );
    
    expect(items).toContain('Passport');
  });

  test('Prevent empty items', async () => {
    const initialCount = await page.$$eval('#checklist li', items => items.length);
    await clickButtonWithText('Add Item');
    await page.waitForTimeout(100); // Short delay
    const newCount = await page.$$eval('#checklist li', items => items.length);
    expect(newCount).toBe(initialCount);
  });

  test('Toggle item styling', async () => {
    // Add test item if needed
    if ((await page.$$('#checklist li')).length === 0) {
      await page.type('#newItem', 'Test Item');
      await clickButtonWithText('Add Item');
      await page.waitForSelector('#checklist li');
    }

    // Toggle checkbox
    await page.click('#checklist li:first-child input[type="checkbox"]');
    
    // Verify styling
    const style = await page.$eval(
      '#checklist li:first-child input[type="text"]',
      el => ({
        textDecoration: el.style.textDecoration,
        color: getComputedStyle(el).color
      })
    );
    
    expect(style.textDecoration).toContain('line-through');
    expect(style.color).toBe('rgb(136, 136, 136)');
  });

  test('Reset checklist', async () => {
    // Add test items
    await page.type('#newItem', 'Item 1');
    await clickButtonWithText('Add Item');
    await page.type('#newItem', 'Item 2');
    await clickButtonWithText('Add Item');
    
    // Reset and verify
    await clickButtonWithText('Reset All');
    await page.waitForSelector('#checklist:empty');
    const items = await page.$$('#checklist li');
    expect(items.length).toBe(0);
  });
});
