const axios = require('axios');
const dotenv = require("dotenv");
dotenv.config();

async function getMobilePageSpeedInsights(url) {
    try {
        const apiKey = process.env.GOOGLE_API_KEY;  // Replace with your PageSpeed Insights API key
        const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile`;

        const response = await axios.get(apiUrl);
        const data = response.data.lighthouseResult;

        const lcp = data.audits['largest-contentful-paint'].numericValue;
        const cls = data.audits['cumulative-layout-shift'].numericValue;
        const tbt = data.audits['total-blocking-time'].numericValue;

        return { lcp, cls, tbt };
    } catch (error) {
        console.error('Error fetching mobile PageSpeed Insights data:', error.message);
        throw error;
    }
}

async function getDesktopPageSpeedInsights(url) {
    try {
        const apiKey = process.env.GOOGLE_API_KEY;  // Replace with your PageSpeed Insights API key
        const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=desktop`;

        const response = await axios.get(apiUrl);
        const data = response.data.lighthouseResult;

        const lcp = data.audits['largest-contentful-paint'].numericValue;
        const cls = data.audits['cumulative-layout-shift'].numericValue;
        const tbt = data.audits['total-blocking-time'].numericValue;

        return { lcp, cls, tbt };
    } catch (error) {
        console.error('Error fetching desktop PageSpeed Insights data:', error.message);
        throw error;
    }
}

module.exports = { getMobilePageSpeedInsights, getDesktopPageSpeedInsights };