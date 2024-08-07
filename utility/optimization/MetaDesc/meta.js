const axios = require("axios");
const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
const he = require("he"); 
dotenv.config();


async function scrapeMetaDescription(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url);

    // Extract meta description
    const metaDescription = await page.evaluate(() => {
      const metaTag = document.querySelector('meta[name="description"]');
      return metaTag ? metaTag.getAttribute("content") : null;
    });

    // Decode meta description using he package
    const decodedDescription = metaDescription
      ? he.decode(metaDescription)
      : "Missing";

    return decodedDescription;
  } catch (error) {
    console.error("Error scraping meta description:", error);
    return "Missing"; // Return 'Missing' if error occurs or no meta description found
  } finally {
    await browser.close();
  }
}

async function checkMeta(description, keywords) {
  const primaryKeywords = keywords.split(",").map((keyword) => keyword.trim());
  const keywordsString = primaryKeywords.join(", ");
  const apiKey = process.env.AI_API_KEY;
  const url = process.env.AI_API_URL;
  const messages = [
    {
      role: "system",
      content: `You are a SEO Expert. Help me to review the meta description i.e. '${description}', to ensure all primary keywords i.e. '${keywordsString}', are included and that the description does not exceed 150-160 characters. Determine if any primary keyword is missing and relevant for search intent, or if the description exceeds the character limit, to check whether optimization is needed. Please provide the output in json format {"meta": "${description}", "needOptimization": "yes/no"}.`,
    },
  ];
  console.log("System Prompt:", messages[0].content);
  const payload = {
    model: "gpt-3.5-turbo",
    messages: messages,
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  try {
    const response = await axios.post(url, payload, { headers });
    if (response.status !== 200) {
      throw new Error(`Failed to fetch data. Status code: ${response.status}`);
    }
    const result = response.data.choices[0].message.content.trim();
    return result.includes('"needOptimization": "yes"');
  } catch (error) {
    if (error.response) {
      console.error(
        `Server responded with non-success status: ${error.response.status}`,
        "Response data:",
        error.response.data,
        "Response headers:",
        error.response.headers
      );
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    console.error("Full error:", error);
  }  
}

async function optimizeMeta(description, keywords) {
  const primaryKeywords = keywords.split(",").map((keyword) => keyword.trim());
  const keywordsString = primaryKeywords.join(", ");
  const messages = [
    {
      role: "system",
      content: `You are an SEO Expert. Optimize the meta description ‘${description}’, ensuring it includes primary keywords ‘${keywordsString}’. Please keep it around 70 - 150 characters in length for optimal readability and SEO impact. If needed for clarity and readability, recommended punctuation includes hyphens (-) or pipes (|). Please provide the output in the following JSON format: {"meta": "${description}", "optimized": "optimized description here", "reason": "any flaws in the current description here", "impact": "impact on SEO here"}. Don't add anything else except this JSON in the output.`,
    },
  ];

  console.log("System Prompt:", messages[0].content);
  const apiKey = process.env.AI_API_KEY;
  const url = process.env.AI_API_URL;

  const payload = {
    model: "gpt-3.5-turbo",
    messages: messages,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  try {
    const response = await axios.post(url, payload, { headers });
    const result = response.data.choices[0].message.content.trim();
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

module.exports = { scrapeMetaDescription, checkMeta, optimizeMeta };
