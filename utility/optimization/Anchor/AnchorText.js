const puppeteer = require('puppeteer');
const axios = require('axios');
const dotenv = require("dotenv");
dotenv.config();

let optimizedText = [];
let missingText = [];

async function fetchAnchors(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    const links = await page.evaluate(() => {
        // Get all anchor tags
        const anchorTags = Array.from(document.querySelectorAll('a'));
        return anchorTags
            .map(anchor => ({
                href: anchor.getAttribute('href'),
                text: anchor.innerText
            }))
            .filter(anchor =>
                anchor.href &&
                anchor.href !== 'javascript:void(0)' &&
                anchor.href !== '#' &&
                anchor.href !== '/'
            );
    });

    // Custom logic to check if a URL needs optimization
    const genericTexts = ["click here", "read more", "more info", "here"];
    const needsOptimization = (link) => {
        const isGenericText = genericTexts.includes(link.text.trim().toLowerCase());

        if (!link.text) {
            return false; // Exclude links without text from optimization check
        }

        // Check if the text is part of the href but should not be considered for optimization
        const isTextInHref = link.href.toLowerCase().includes(link.text.trim().toLowerCase());
        const endsWithPunctuation = /[.,!?;:]$/.test(link.text.trim()); // Check if text ends with punctuation
        const endsWithHtml = link.href.toLowerCase().endsWith('.html'); // Check if href ends with .html

        // Needs optimization if any of the generic criteria are met and not a special case
        return isGenericText && !(isTextInHref && (endsWithPunctuation || endsWithHtml));
    };

    // Separate the links into categories
    const categorizedLinks = {
        absoluteURL: [],
        missingText: [],
        needsOptimization: [],
        genericTextLinks: []
    };

    links.forEach(link => {
        let absoluteHref = link.href;
        if (!link.href.startsWith('https:') && !link.href.startsWith('http:')) {
            // Remove trailing slash from base URL if present
            const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
            absoluteHref = new URL(link.href, baseUrl).href;
        }

        if (!link.text) {
            categorizedLinks.missingText.push({ href: absoluteHref });
        } else if (genericTexts.includes(link.text.trim().toLowerCase())) {
            categorizedLinks.genericTextLinks.push({ href: absoluteHref, text: link.text });
        } else if (needsOptimization(link)) {
            categorizedLinks.needsOptimization.push({ href: absoluteHref, text: link.text });
        } else {
            categorizedLinks.absoluteURL.push({ href: absoluteHref, text: link.text });
        }
    });

    await browser.close();
    return categorizedLinks;
}

async function optimizeAnchors(genericText) {
    const messages = [
        {
            role: "system",
            content: `You are an SEO Expert. Optimize the text, identify the key topic or keyword related to the given URL. Craft an anchor text that is descriptive, relevant, and contains appropriate keywords. Maintain a balance between keyword-rich and natural, readable text. For each text, provide the output in the format {"href":"given href", "old":"old text", "newText":"optimized text", "reason":"here add reason for optimization", "impact":"here add impact on seo"}. Don’t output anything else except this format.`,
        },
        {
            role: "user",
            content: JSON.stringify(genericText)
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
        const result = response.data.choices[0].message.content.trim();
        optimizedText.push(JSON.parse(result));
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function processAnchor(url) {
    // Reset arrays at the start of each processing
    optimizedText = [];
    missingText = [];
    
    try {
        const categorizedLinks = await fetchAnchors(url);
        const genericTextLinks = categorizedLinks.genericTextLinks;
        missingText = categorizedLinks.missingText.map(link => link.href);

        for (const link of genericTextLinks) {
            await optimizeAnchors(link);
        }

        const outputData = {
            optimizedText: optimizedText,
            missingText: missingText
        };

        return outputData;
    } catch (error) {
        console.error('Error processing anchors:', error);
        throw error;
    }
}

module.exports = { processAnchor };
