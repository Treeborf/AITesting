const puppeteer = require("puppeteer");

describe("Travel Checklist Tests", () => {
  let browser, page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    page = await browser.newPage();
    await page.goto("https://treeborf.github.io/AITesting/checklist.html");
    await page.waitForSelector('#checklist');
  }, 15000);

  afterAll(async () => {
    await browser.close();
  });

  test("Adding a valid item", async () => {
    // Clear any existing items
    await page.click('button:has-text("Reset All")');
    
    await page.type("#newItem", "Passport");
    await page.click('button:has-text("Add Item")');
    
    await page.waitForSelector('#checklist li');
    const items = await page.$$eval("#checklist li", items => items.length);
    expect(items).toBe(1);
  });

  test("Prevent adding empty items", async () => {
    const initialCount = await page.$$eval("#checklist li", items => items.length);
    
    // Ensure input is empty
    await page.$eval('#newItem', input => input.value = '');
    await page.click('button:has-text("Add Item")');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCount = await page.$$eval("#checklist li", items => items.length);
    expect(newCount).toBe(initialCount);
  });

  test("Check item and verify strikethrough", async () => {
    // Add test item if none exists
    if ((await page.$$('#checklist li')).length === 0) {
      await page.type("#newItem", "Test Item");
      await page.click('button:has-text("Add Item")');
      await page.waitForSelector('#checklist li');
    }

    // Check the first checkbox
    await page.click('#checklist li:first-child input[type="checkbox"]');
    
    // Verify text style
    const textStyle = await page.$eval(
      '#checklist li:first-child input[type="text"]',
      el => ({
        textDecoration: el.style.textDecoration,
        color: getComputedStyle(el).color
      })
    );
    
    expect(textStyle.textDecoration).toContain('line-through');
    expect(textStyle.color).toBe('rgb(136, 136, 136)');
  });

  test("Reset checklist", async () => {
    // Ensure there's at least one item
    if ((await page.$$('#checklist li')).length === 0) {
      await page.type("#newItem", "Test Item");
      await page.click('button:has-text("Add Item")');
      await page.waitForSelector('#checklist li');
    }

    await page.click('button:has-text("Reset All")');
    await page.waitForSelector('#checklist:empty');
    const items = await page.$$eval("#checklist li", items => items.length);
    expect(items).toBe(0);
  });
});
