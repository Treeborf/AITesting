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
    // Clear existing items using XPath
    const resetButton = await page.$x('//button[contains(text(), "Reset All")]');
    if (resetButton.length > 0) await resetButton[0].click();
    
    await page.type("#newItem", "Passport");
    // Use XPath for text matching
    const addButton = await page.$x('//button[contains(text(), "Add Item")]');
    await addButton[0].click();
    
    await page.waitForSelector('#checklist li');
    const items = await page.$$eval("#checklist li", items => items.length);
    expect(items).toBe(1);
  });

  test("Prevent adding empty items", async () => {
    const initialCount = await page.$$eval("#checklist li", items => items.length);
    
    // Clear input properly
    await page.focus('#newItem');
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    
    const addButton = await page.$x('//button[contains(text(), "Add Item")]');
    await addButton[0].click();
    
    await page.waitForTimeout(500); // More reliable than Promise.resolve
    const newCount = await page.$$eval("#checklist li", items => items.length);
    expect(newCount).toBe(initialCount);
  });

  test("Check item and verify strikethrough", async () => {
    // Add test item if needed using reliable selectors
    if ((await page.$$('#checklist li')).length === 0) {
      await page.type("#newItem", "Test Item");
      const addBtn = await page.$x('//button[contains(text(), "Add Item")]');
      await addBtn[0].click();
      await page.waitForSelector('#checklist li');
    }

    // Check the first checkbox
    await page.click('#checklist li:first-child input[type="checkbox"]');
    
    // Verify text input style (matches your HTML structure)
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
      const addBtn = await page.$x('//button[contains(text(), "Add Item")]');
      await addBtn[0].click();
      await page.waitForSelector('#checklist li');
    }

    const resetBtn = await page.$x('//button[contains(text(), "Reset All")]');
    await resetBtn[0].click();
    
    // Wait for list to clear
    await page.waitForFunction(() => {
      return document.querySelectorAll('#checklist li').length === 0;
    });
    
    const items = await page.$$eval("#checklist li", items => items.length);
    expect(items).toBe(0);
  });
});
