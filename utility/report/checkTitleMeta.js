const puppeteer = require("puppeteer");

const scrapeSEO = async (url, primaryKeyword, secondaryKeywordsString) => {
  // Convert the comma-separated secondary keywords string into an array
  const secondaryKeywords = secondaryKeywordsString
    .split(",")
    .map((keyword) => keyword.trim());

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const result = await page.evaluate(
    (primaryKeyword, secondaryKeywords) => {
      const titleElement = document.querySelector("title");
      const metaDescriptionElement = document.querySelector('meta[name="description"]');
      
      const title = titleElement ? titleElement.innerText : "";
      const metaDescription = metaDescriptionElement ? metaDescriptionElement.getAttribute("content") : "";

      const primaryKeywordRegex = new RegExp(
        `\\b${primaryKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        "i"
      );
      const secondaryKeywordsRegexes = secondaryKeywords.map(
        (keyword) =>
          new RegExp(
            `\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
            "i"
          )
      );

      const titleHasPrimaryKeyword = titleElement ? primaryKeywordRegex.test(title) : false;
      const titleLengthValid = titleElement ? title.length < 70 : false;
      const metaDescriptionHasPrimaryKeyword = metaDescriptionElement ? primaryKeywordRegex.test(metaDescription) : false;
      const metaDescriptionHasSecondaryKeywords = metaDescriptionElement ? secondaryKeywordsRegexes.some(regex => regex.test(metaDescription)) : false;
      const metaDescriptionLengthValid = metaDescriptionElement ? metaDescription.length < 160 : false;

      return {
        isTitle: !!titleElement,
        isMeta: !!metaDescriptionElement,
        titlePrimary: titleHasPrimaryKeyword,
        titleLength: titleLengthValid,
        mPrimary: metaDescriptionHasPrimaryKeyword,
        mSecondary: metaDescriptionHasSecondaryKeywords,
        mLength: metaDescriptionLengthValid,
      };
    },
    primaryKeyword,
    secondaryKeywords
  );

  await browser.close();
  return result;
};

module.exports = { scrapeSEO };
