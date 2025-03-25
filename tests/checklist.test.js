const puppeteer = require('puppeteer');

describe('Travel Checklist Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: 'new' });
    page = await browser.newPage();
    await page.goto('https://treeborf.github.io/AITesting/checklist.html');
    await page.waitForSelector('#checklist');
  }, 15000);

  beforeEach(async () => {
    // Reset state before each test
    await page.click('button:has-text("Reset All")');
    await page.waitForSelector('#checklist:empty');
  });

  afterAll(async () => {
    await browser.close();
  });

  // Helper function to click buttons by visible text
  const clickButton = async (text) => {
    const [button] = await page.$x(`//button[contains(., '${text}')]`);
    if (button) await button.click();
  };

  test('Add valid item to checklist', async () => {
    // Test data
    const testItem = 'Passport';
    
    // Add item
    await page.type('#newItem', testItem);
    await clickButton('Add Item');
    
    // Verify addition
    await page.waitForSelector('#checklist li');
    const items = await page.$$eval('#checklist li', items => 
      items.map(item => item.querySelector('input[type="text"]').value)
    );
    
    expect(items).toContain(testItem);
  });

  test('Prevent adding empty items', async () => {
    // Attempt to add empty item
    await clickButton('Add Item');
    
    // Verify no items added
    const items = await page.$$('#checklist li');
    expect(items.length).toBe(0);
  });

  test('Toggle item and verify styling', async () => {
    // Add test item
    await page.type('#newItem', 'Test Item');
    await clickButton('Add Item');
    await page.waitForSelector('#checklist li');
    
    // Toggle checkbox
    const checkbox = await page.$('#checklist input[type="checkbox"]');
    await checkbox.click();
    
    // Verify styling
    const textInput = await page.$('#checklist input[type="text"]');
    const style = await textInput.evaluate(el => ({
      textDecoration: el.style.textDecoration,
      color: getComputedStyle(el).color
    }));
    
    expect(style.textDecoration).toContain('line-through');
    expect(style.color).toBe('rgb(136, 136, 136)');
  });

  test('Reset checklist removes all items', async () => {
    // Add some items
    await page.type('#newItem', 'Item 1');
    await clickButton('Add Item');
    await page.type('#newItem', 'Item 2');
    await clickButton('Add Item');
    
    // Reset
    await clickButton('Reset All');
    
    // Verify empty list
    await page.waitForSelector('#checklist:empty');
    const items = await page.$$('#checklist li');
    expect(items.length).toBe(0);
  });
});
