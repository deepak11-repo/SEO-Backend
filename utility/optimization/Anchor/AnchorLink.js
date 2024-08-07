const puppeteer = require('puppeteer');
const axios = require('axios');
const dotenv = require("dotenv");
dotenv.config();

const stopWords = ['and', 'but', 'the', 'or', 'of', 'a'];

// Function to check if URL contains any capital letters
function hasCapitalLetters(url) {
    return /[A-Z]/.test(url);
}

// Function to filter URLs that need optimization
function filterUrlsForOptimization(urls) {
    return urls.filter(url => {
        const isHttp = url.startsWith('http://');
        const hasUnderscores = url.includes('_');
        const hasStopWords = stopWords.some(word => new RegExp(`\\b${word}\\b`, 'i').test(url));
        const hasCapitals = hasCapitalLetters(url);

        // Check for dynamic parameters but exclude specific URLs
        const hasDynamicParams = /\?.+=/.test(url) && !/\.html(?:$|\?)/.test(url);

        const reasons = [];
        if (isHttp) reasons.push('URL starts with http://');
        if (hasUnderscores) reasons.push('URL contains underscore (_)');
        if (hasStopWords) reasons.push('URL contains stop words');
        if (hasCapitals) reasons.push('URL contains capital letters');
        if (hasDynamicParams) reasons.push('URL has dynamic parameters');

        if (reasons.length > 0) {
            console.log(`URL: ${url} | Reasons: ${reasons.join(', ')}`);
        }

        return reasons.length > 0;
    });
}

async function fetchAbsoluteUrls(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    const links = await page.evaluate((targetUrl) => {
        const targetDomain = new URL(targetUrl).hostname;
        const seenUrls = new Set();

        // Get all anchor tags
        const anchorTags = Array.from(document.querySelectorAll('a'));
        return anchorTags
            .map(anchor => anchor.href)
            .filter(href => {
                if (!href || href === 'javascript:void(0)' || href === '#' || href === '/') {
                    return false;
                }

                try {
                    const parsedUrl = new URL(href);
                    if (parsedUrl.hostname !== targetDomain) {
                        return false;
                    }

                    // Check if URL has been seen before
                    if (seenUrls.has(parsedUrl.href)) {
                        return false;
                    }

                    // Add URL to seenUrls set
                    seenUrls.add(parsedUrl.href);
                    return true;
                } catch (error) {
                    console.error('Error parsing URL:', error);
                    return false;
                }
            });
    }, url);

    await browser.close();
    return links;
}

async function optimizeUrl(domain, url) {
    const messages = [
        {
            role: "system",
            content: `You're an SEO expert. Optimize the URL '${url}' of the website '${domain}' for improved SEO. Provide the output in this json format: {url: current url, optimized: optimized url, reason: reason for optimization, impact: impact on SEO}. Don’t output anything else except this json format.`,
        },
        {
            role: "user",
            content: url
        }
    ];

    const apiKey = process.env.AI_API_KEY;
    const apiUrl = process.env.AI_API_URL;

    const payload = {
        model: 'gpt-3.5-turbo',
        messages: messages,
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    console.log('System Prompt:', messages[0].content);
    console.log('User Prompt:', messages[1].content);

    try {
        const response = await axios.post(apiUrl, payload, { headers });
        const rawResult = response.data.choices[0].message.content.trim();
        console.log('Raw API Response:', rawResult); // Log the raw response

        try {
            const optimizedResult = JSON.parse(rawResult.replace(/^"(.*)"$/, '$1')); 
            return optimizedResult;
        } catch (jsonError) {
            console.error('JSON Parsing Error:', jsonError);
            console.error('Invalid JSON:', rawResult);
            return { url, optimized: null, reason: 'JSON parsing error', impact: 'N/A' }; // Return default object
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function optimizeLinks(targetUrl) {
    try {
        const absoluteUrls = await fetchAbsoluteUrls(targetUrl);
        const urlsToOptimize = filterUrlsForOptimization(absoluteUrls); 
        const domain = new URL(targetUrl).hostname;
        if (urlsToOptimize.length === 0) {
            return { message: 'No URLs need optimization.' };
        }
        const optimizedResults = [];
        for (const url of urlsToOptimize) {
            const optimizedResult = await optimizeUrl(domain, url);
            optimizedResults.push(optimizedResult);
        }
        return optimizedResults;       
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = { optimizeLinks }
