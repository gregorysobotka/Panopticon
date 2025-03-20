const { chromium } = require("playwright");

/*
    captureObject:
    
        {
            url: 'str',
            delay: 'str',
            width: num,
            filePath: 'str'
        }
*/
async function screenCapture(captureObject) {

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(captureObject.url);
    await page.waitForTimeout(captureObject.delay);
    const screenshot = await page.screenshot({ path: captureObject.filePath, fullPage: true });
    await browser.close();
    return screenshot;
};

module.exports = { screenCapture };