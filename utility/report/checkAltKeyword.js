const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

async function checkAltTextForKeywords(url, secondaryKeywords) {
  const keywords = secondaryKeywords.split(",").map((keyword) => keyword.trim());
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  const content = await page.content();
  await browser.close();

  const $ = cheerio.load(content);
  const altTexts = $("img")
    .map((i, img) => $(img).attr("alt"))
    .get();

  const withKeywords = [];
  const withoutKeywords = [];

  let keywordMatchCount = 0;
  for (const altText of altTexts) {
    if (
      keywords.some((keyword) =>
        new RegExp(`\\b${keyword}\\b`, "i").test(altText)
      )
    ) {
      withKeywords.push(altText);
      keywordMatchCount++;
    } else {
      withoutKeywords.push(altText);
    }
  }

  console.log("Alt texts with secondary keywords:", withKeywords);
  console.log("Alt texts without secondary keywords:", withoutKeywords);
  return keywordMatchCount >= 4;
}

module.exports = { checkAltTextForKeywords };
