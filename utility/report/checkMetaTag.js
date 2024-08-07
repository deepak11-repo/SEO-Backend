const axios = require('axios');
const cheerio = require('cheerio');

const checkMetaTags = async (url) => {
  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);

    // Initialize flags
    let followTagFound = false;
    let indexTagFound = false;

    // Find all meta tags
    $('meta').each((_, element) => {
      const content = $(element).attr('content');
      if (content) {
        const contentLower = content.toLowerCase();
        followTagFound = followTagFound || contentLower.includes('follow');
        indexTagFound = indexTagFound || contentLower.includes('index');
      }
    });

    console.log(`Follow Tag Found: ${followTagFound}`);
    console.log(`Index Tag Found: ${indexTagFound}`);

    return { followTag: followTagFound, indexTag: indexTagFound };
  } catch (error) {
    console.error(`Error fetching or parsing the URL: ${error.message}`);
    return { followTagFound: false, indexTagFound: false };
  } 
};

module.exports = { checkMetaTags };
