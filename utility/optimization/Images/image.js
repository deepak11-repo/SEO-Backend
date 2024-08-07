const puppeteer = require('puppeteer');

const scrapeImagesWithoutAltOrTitle = async (url) => {
    if (!url) {
        throw new Error("URL parameter is required");
    }
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const result = await page.evaluate(() => {
        const imgElements = document.querySelectorAll('body img');
        const altArray = [];
        const titleArray = [];
        const commonArray = [];
        imgElements.forEach((img) => {
            const alt = img.getAttribute('alt');
            const src = img.getAttribute('src');
            const title = img.getAttribute('title');
            if (src && !alt && !title) {
                commonArray.push(src);
            } else {
                if (src && !alt) {  // Check if src is present but alt is missing
                    altArray.push(src);
                }
                if (src && !title) {  // Check if src is present but title is missing
                    titleArray.push(src);
                }
            }
        });
        return { altArray, titleArray, commonArray };
    });
    await browser.close();
    return result;
}

module.exports = { scrapeImagesWithoutAltOrTitle };
