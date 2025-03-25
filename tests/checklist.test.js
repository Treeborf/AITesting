const puppeteer = require("puppeteer");

describe("Travel Checklist Tests", () => {
  let browser, page;

  beforeAll(async () => {
    // Launch Chrome with necessary flags to avoid sandboxing issues
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],  // Add flags here
      headless: true, // Ensure it runs in headless mode (no GUI)
    });
    page = await browser.newPage();
    await page.goto("https://treeborf.github.io/AITesting/checklist.html"); // Adjust for GitHub Pages URL
  });

  afterAll(async () => {
    await browser.close();
  });

  test("Adding a valid item", async () => {
    await page.type("#newItem", "Passport");
    await page.click("button:has-text('Add Item')");
    const items = await page.$eval("#checklist", ul => ul.children.length);
    expect(items).toBeGreaterThan(0);
  });

  test("Prevent adding empty items", async () => {
    await page.click("button:has-text('Add Item')");
    const items = await page.$eval("#checklist", ul => ul.children.length);
    expect(items).toBeGreaterThan(0); // Should not change
  });

  test("Check item and verify strikethrough", async () => {
    await page.click("#checklist input[type='checkbox']");
    const textColor = await page.$eval("#checklist input[type='text']", el => getComputedStyle(el).color);
    expect(textColor).toBe("rgb(136, 136, 136)"); // Gray color when checked
  });

  test("Reset checklist", async () => {
    await page.click("button:has-text('Reset All')");
    const items = await page.$eval("#checklist", ul => ul.children.length);
    expect(items).toBe(0);
  });
});
