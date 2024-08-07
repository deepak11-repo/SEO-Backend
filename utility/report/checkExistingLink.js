const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');

async function analyzePage(pageUrl) {
  // Launch Puppeteer and get page content
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(pageUrl);
  const content = await page.content();
  await browser.close();

  // Parse the content with Cheerio
  const $ = cheerio.load(content);
  const baseUrl = new URL(pageUrl).origin;

  // Task 1: Check for internal links
  let hasInternalLink = false;
  for (const link of $('a')) {
    const href = $(link).attr('href');
    if (href) {
      const linkUrl = new URL(href, pageUrl).origin;
      if (linkUrl === baseUrl) {
        hasInternalLink = true;
        break; // Exit loop as soon as an internal link is found
      }
    }
  }

  // Task 2: Scrape anchor links and check their HTTP status
  const anchorLinks = [];
  $('a').each((index, element) => {
    const href = $(element).attr('href');
    if (href && href.trim().length > 0 && !isExcluded(href)) {
      try {
        const parsedUrl = new URL(href, pageUrl);
        anchorLinks.push(parsedUrl.href);
      } catch (error) {
        if (href.startsWith('/') && !href.startsWith('//')) {
          const absoluteUrl = new URL(href, pageUrl).href;
          anchorLinks.push(absoluteUrl);
        }
      }
    }
  });

  function isExcluded(href) {
    const excludedProtocols = ['javascript:', 'mailto:', 'tel:', 'skype:', 'data:', 'ftp:', 'file:'];
    const lowerHref = href.toLowerCase().trim();
    return excludedProtocols.some(protocol => lowerHref.startsWith(protocol)) || href === '#' || href === '/';
  }

  const brokenLinks = [];
  async function checkHttpStatus(link) {
    try {
      const response = await axios.get(link, { validateStatus: null });
      if (response.status >= 400) {
        brokenLinks.push({ url: link, status: response.status });
      }
    } catch (error) {
      brokenLinks.push({ url: link, status: 'Error', message: error.message });
    }
  }

  await Promise.all(anchorLinks.map(link => checkHttpStatus(link)));

  return {
    hasInternalLink,
    brokenLinks
  };
}

module.exports = { analyzePage };