const axios = require('axios');
const url = require('url');
const dotenv = require("dotenv");
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;

const checkRobotsTxt = async (siteUrl) => {
    try {
        const parsedUrl = url.parse(siteUrl);
        const robotsUrl = `${parsedUrl.protocol}//${parsedUrl.host}/robots.txt`;
        
        const response = await axios.get(robotsUrl);
        return {
            exists: response.status === 200,
            finalUrl: robotsUrl
        };
    } catch (error) {
        return {
            found: false,
            robotsUrl: null
        };
    }
};

const checkSitemapXml = async (siteUrl) => {
    try {
        // Construct potential sitemap URLs
        const parsedUrl = url.parse(siteUrl);
        const baseDomain = `${parsedUrl.protocol}//${parsedUrl.host}`;
        const possibleSitemapUrls = [
            `${baseDomain}/sitemap.xml`,
            `${baseDomain}/sitemap_index.xml`,  // Common variations
            `${baseDomain}/sitemap/sitemap-index.xml`
        ];

        let finalSitemapUrl = null;

        // Check each potential sitemap URL
        for (const sitemapUrl of possibleSitemapUrls) {
            try {
                const response = await axios.head(sitemapUrl, {
                    maxRedirects: 5,  // Adjust as needed
                    validateStatus: function (status) {
                        return status >= 200 && status < 400; // Resolve status codes to check
                    }
                });

                // If any sitemap URL returns a successful status code, set finalSitemapUrl and break out of loop
                if (response.status >= 200 && response.status < 400) {
                    finalSitemapUrl = sitemapUrl;
                    break;
                }
            } catch (error) {
                // Continue to next sitemap URL in case of error
                continue;
            }
        }

        // Return an object with existence boolean and finalSitemapUrl
        return {
            exists: finalSitemapUrl !== null,
            finalUrl: finalSitemapUrl
        };
    } catch (error) {
        return {
            exists: false,
            finalUrl: null
        };
    }
};

const checkHttpStatus = async (siteUrl) => {
    try {
        
        const response = await axios.head(siteUrl, {
            maxRedirects: 0,  // Ensure no automatic redirects
            validateStatus: function (status) {
                return status >= 200 && status < 400; // Resolve status codes to check
            },       
            followRedirects: false  // Disable automatic redirects
        });

        // Extract the final URL after any redirects
        let finalUrl = response.headers.location || siteUrl;

        return {
            exists: true,
            statusCode: response.status,
            statusText: response.statusText,
            finalUrl: finalUrl
        };
    } catch (error) {
        if (error.response) {
            return {
                statusCode: error.response.status,
                statusText: error.response.statusText,
                finalUrl: error.response.request.res.responseUrl
            };
        } else if (error.request) {
            return {
                exists: false,
                error: 'No response received from the server.'
            };
        } else {
            return {
                error: error.message
            };
        }
    }
};

module.exports = { checkRobotsTxt, checkSitemapXml, checkHttpStatus };
