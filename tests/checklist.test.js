const puppeteer = require("puppeteer");

describe("Travel Checklist Tests", () => {
  let browser, page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: "new", // Use new headless mode
    });
    page = await browser.newPage();
    await page.goto("https://treeborf.github.io/AITesting/checklist.html");
    await page.waitForSelector('#checklist'); // Ensure page loads
  }, 15000); // Increase timeout for setup

  afterAll(async () => {
    await browser.close();
  });

  test("Adding a valid item", async () => {
    await page.type("#newItem", "Passport");
    const addButton = await page.waitForXPath("//button[text()='Add Item']");
    await addButton.click();
    await page.waitForFunction(() => 
      document.querySelector('#checklist').children.length > 0
    );
    const items = await page.$eval("#checklist", ul => ul.children.length);
    expect(items).toBeGreaterThan(0);
  });

  test("Prevent adding empty items", async () => {
    const initialItems = await page.$eval("#checklist", ul => ul.children.length);
    const addButton = await page.waitForXPath("//button[text()='Add Item']");
    await addButton.click();
    // Wait briefly to ensure no new items are added
    await new Promise(resolve => setTimeout(resolve, 500));
    const newItems = await page.$eval("#checklist", ul => ul.children.length);
    expect(newItems).toBe(initialItems);
  });

  test("Check item and verify strikethrough", async () => {
    const checkbox = await page.waitForSelector('#checklist input[type="checkbox"]');
    await checkbox.click();
    // Target the text element next to the checkbox
    const textColor = await page.$eval('#checklist input[type="checkbox"] + span', 
      el => getComputedStyle(el).color
    );
    expect(textColor).toBe("rgb(136, 136, 136)");
  });

  test("Reset checklist", async () => {
    const resetButton = await page.waitForXPath("//button[text()='Reset All']");
    await resetButton.click();
    await page.waitForFunction(() =>
      document.querySelector('#checklist').children.length === 0
    );
    const items = await page.$eval("#checklist", ul => ul.children.length);
    expect(items).toBe(0);
  });
});
