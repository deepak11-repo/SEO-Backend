const { structuredDataTest } = require('structured-data-testing-tool');
const axios = require('axios');

const checkStructuredData = async (url) => {
  try {
    // Fetch the HTML content of the URL
    const response = await axios.get(url);
    const htmlContent = response.data;

    // Perform the structured data test
    let result = await structuredDataTest(url);

    // Check if structured data exists
    const exists = result && result.schemas.length > 0;

    // Check if structured data is valid (if it exists)
    let isValid = false;
    if (exists) {
      isValid = result.passed.length > 0 && result.failed.length === 0;
    }

    // Return structured response
    return {
      exists: exists,
      isValid: isValid
    };
  } catch (err) {
    console.error('Error fetching or parsing URL:', err);
    throw err;
  }
};

module.exports = { checkStructuredData };

