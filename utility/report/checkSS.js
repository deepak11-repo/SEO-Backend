const puppeteer = require('puppeteer');
const { URL } = require('url');

const getSS = async (url) => {
    const { default: lighthouse } = await import('lighthouse');
    const browser = await puppeteer.launch({ headless: true });
    const { port } = new URL(browser.wsEndpoint());

    const result = await lighthouse(url, {
        port,
        output: 'json',
        onlyCategories: ['performance'],
        formFactor: 'desktop',
        screenEmulation: {
            mobile: false,
            width: 1350,
            height: 940,
            deviceScaleFactor: 1,
            disabled: false,
        },
    });

    await browser.close();

    const report = JSON.parse(result.report);
    const screenshotData = report.audits['final-screenshot'].details.data;

    return screenshotData;
};

module.exports = { getSS };
