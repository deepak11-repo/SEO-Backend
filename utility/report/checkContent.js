const puppeteer = require('puppeteer');

const scrapeParagraphs = async (url, primaryKeywordsString, secondaryKeywordsString) => {
  const primaryKeywords = primaryKeywordsString.split(',').map(keyword => keyword.trim());
  const secondaryKeywords = secondaryKeywordsString.split(',').map(keyword => keyword.trim());

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  const paragraphs = await page.evaluate(() => {
    const paragraphs = Array.from(document.querySelectorAll('p')).map(p => p.innerText);
    return paragraphs;
  });

  const totalParagraphs = paragraphs.length;

  const primaryKeywordsRegexes = primaryKeywords.map(keyword =>
    new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
  );

  const secondaryKeywordsRegexes = secondaryKeywords.map(keyword =>
    new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
  );

  let primaryKeywordCount = 0;
  let secondaryKeywordCount = 0;
  let noneCount = 0;
  let totalWords = 0;

  paragraphs.forEach(paragraph => {
    const words = paragraph.split(/\s+/).filter(word => word.length > 0);
    totalWords += words.length;

    if (primaryKeywordsRegexes.some(regex => regex.test(paragraph))) {
      primaryKeywordCount++;
    } else if (secondaryKeywordsRegexes.some(regex => regex.test(paragraph))) {
      secondaryKeywordCount++;
    } else {
      noneCount++;
    }
  });

  await browser.close();

  return {
    totalPara: totalParagraphs,
    pCount: primaryKeywordCount,
    sCount: secondaryKeywordCount,
    nCount: noneCount,
    wordCount: totalWords,
  };
};

module.exports = { scrapeParagraphs };