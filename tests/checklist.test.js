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

  // Utility function to click buttons by text
  async clickButtonByText(text) {
    const buttons = await page.$$('button');
    for (const button of buttons) {
      const buttonText = await button.evaluate(el => el.textContent.trim());
      if (buttonText === text) {
        await button.click();
        return true;
      }
    }
    throw new Error(`Button with text "${text}" not found`);
  }

  test("Adding a valid item", async () => {
    // Clear existing items
    await this.clickButtonByText("Reset All");
    
    await page.type("#newItem", "Passport");
    await this.clickButtonByText("Add Item");
    
    await page.waitForSelector('#checklist li');
    const items = await page.$$eval("#checklist li", items => items.length);
    expect(items).toBe(1);
  });

  test("Prevent adding empty items", async () => {
    const initialCount = await page.$$eval("#checklist li", items => items.length);
    
    // Clear input properly
    await page.$eval('#newItem', input => input.value = '');
    await this.clickButtonByText("Add Item");
    
    await page.waitForTimeout(500);
    const newCount = await page.$$eval("#checklist li", items => items.length);
    expect(newCount).toBe(initialCount);
  });

  test("Check item and verify strikethrough", async () => {
    if ((await page.$$('#checklist li')).length === 0) {
      await page.type("#newItem", "Test Item");
      await this.clickButtonByText("Add Item");
      await page.waitForSelector('#checklist li');
    }

    await page.click('#checklist li:first-child input[type="checkbox"]');
    
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
    if ((await page.$$('#checklist li')).length === 0) {
      await page.type("#newItem", "Test Item");
      await this.clickButtonByText("Add Item");
      await page.waitForSelector('#checklist li');
    }

    await this.clickButtonByText("Reset All");
    await page.waitForFunction(() => 
      document.querySelectorAll('#checklist li').length === 0
    );
    
    const items = await page.$$eval("#checklist li", items => items.length);
    expect(items).toBe(0);
  });
});
