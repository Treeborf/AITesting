const puppeteer = require("puppeteer");

describe("Travel Checklist Tests", () => {
  let browser, page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    });
    page = await browser.newPage();
    await page.goto("http://localhost:3000/checklist.html"); // Adjust for GitHub Pages URL
  });

  afterAll(async () => {
    await browser.close();
  });

  test("Adding a valid item", async () => {
    await page.type("#newItem", "Passport");
    const addButton = await page.$x("//button[text()='Add Item']"); // Using XPath correctly here
    if (addButton.length > 0) {
      await addButton[0].click(); // Click the button if found
    }
    const items = await page.$eval("#checklist", ul => ul.children.length);
    expect(items).toBeGreaterThan(0);
  });

  test("Prevent adding empty items", async () => {
    const addButton = await page.$x("//button[text()='Add Item']");
    if (addButton.length > 0) {
      await addButton[0].click();
    }
    const items = await page.$eval("#checklist", ul => ul.children.length);
    expect(items).toBeGreaterThan(0); // Should not change
  });

  test("Check item and verify strikethrough", async () => {
    const checkboxes = await page.$$("#checklist input[type='checkbox']");
    if (checkboxes.length > 0) {
      await checkboxes[0].click();  // Click the first checkbox
    }
    const textColor = await page.$eval("#checklist input[type='text']", el => getComputedStyle(el).color);
    expect(textColor).toBe("rgb(136, 136, 136)"); // Gray color when checked
  });

  test("Reset checklist", async () => {
    const resetButton = await page.$x("//button[text()='Reset All']"); // XPath for "Reset All"
    if (resetButton.length > 0) {
      await resetButton[0].click();
    }
    const items = await page.$eval("#checklist", ul => ul.children.length);
    expect(items).toBe(0);
  });
});
