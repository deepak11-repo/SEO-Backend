const axios = require('axios');
const cheerio = require('cheerio');

// Function to fetch HTML content from a URL
async function fetchHTML(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching HTML from ${url}: ${error.message}`);
        return null;
    }
}

// Function to check for canonical tags in HTML content
function checkCanonicalTags(htmlContent) {
    const $ = cheerio.load(htmlContent);
    const canonicalTags = $('link[rel="canonical"]');
    
    if (canonicalTags.length > 0) {
        canonicalTags.each((index, element) => {
            const href = $(element).attr('href');
            console.log(`Canonical tag found: ${href}`);
        });
        return true; // Return true if canonical tags are found
    } else {
        console.log('No canonical tags found.');
        return false; // Return false if no canonical tags are found
    }
}

module.exports = { fetchHTML, checkCanonicalTags };