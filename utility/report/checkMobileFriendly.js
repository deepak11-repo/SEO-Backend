const puppeteer = require('puppeteer-extra')
const { URL } = require('url');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());
async function checkMobileFriendly(url) {
    const { default: lighthouse } = await import('lighthouse');
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] });
    // const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle2' });
        console.log('Page loaded, starting Lighthouse...');

        const lighthouseConfig = {
            extends: 'lighthouse:default',
            settings: {
                onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
            },
        };

        const { lhr } = await lighthouse(page.url(), {
            port: new URL(browser.wsEndpoint()).port,
            output: 'json',
            logLevel: 'info',
            ...lighthouseConfig,
        });

        const scores = lhr.categories;
        const mobileFriendlinessScore = scores['best-practices'].score * 100;

        const isMobileFriendly = mobileFriendlinessScore >= 75;

        return ({ isMobileFriendly: isMobileFriendly });

    } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throw error for handling in API
    } finally {
        await browser.close();
    }
}

module.exports = { checkMobileFriendly };