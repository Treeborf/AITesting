const puppeteer = require("puppeteer");

describe("Travel Checklist Tests", () => {
  let browser, page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: "new",
    });
    page = await browser.newPage();
    await page.goto("https://treeborf.github.io/AITesting/checklist.html");
    await page.waitForSelector('#checklist');
  }, 15000);

  afterAll(async () => {
    await browser.close();
  });

  test("Adding a valid item", async () => {
    await page.type("#newItem", "Passport");
    // Use CSS selector with waitForSelector instead of XPath
    const addButton = await page.waitForSelector('button:has-text("Add Item")');
    await addButton.click();
    await page.waitForSelector('#checklist > li');
    const items = await page.$$eval("#checklist li", items => items.length);
    expect(items).toBeGreaterThan(0);
  });

  test("Prevent adding empty items", async () => {
    const initialCount = await page.$$eval("#checklist li", items => items.length);
    // Clear input first
    await page.$eval('#newItem', input => input.value = '');
    const addButton = await page.waitForSelector('button:has-text("Add Item")');
    await addButton.click();
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCount = await page.$$eval("#checklist li", items => items.length);
    expect(newCount).toBe(initialCount);
  });

  test("Check item and verify strikethrough", async () => {
    await page.waitForSelector('#checklist input[type="checkbox"]');
    await page.click('#checklist input[type="checkbox"]');
    const textColor = await page.$eval('#checklist li', el => 
      getComputedStyle(el.querySelector('span')).color
    );
    expect(textColor).toBe("rgb(136, 136, 136)");
  });

  test("Reset checklist", async () => {
    const resetButton = await page.waitForSelector('button:has-text("Reset All")');
    await resetButton.click();
    await page.waitForSelector('#checklist:empty');
    const items = await page.$$eval("#checklist li", items => items.length);
    expect(items).toBe(0);
  });
});
