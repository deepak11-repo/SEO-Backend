const puppeteer = require('puppeteer');
const axios = require('axios');
const dotenv = require("dotenv");
dotenv.config();

async function extractH1Headers(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.setDefaultNavigationTimeout(60000); // 30 seconds timeout
        await page.goto(url, { waitUntil: 'networkidle2' }); // Wait until the network is idle
        console.log(`Navigated to ${url}`);

        const h1Headers = await page.evaluate(() => {
            const h1Elements = Array.from(document.querySelectorAll('h1'));
            return h1Elements.map(h1 => h1.textContent.trim());
        });

        await browser.close();

        if (h1Headers.length === 0 || (h1Headers.length === 1 && h1Headers[0] === '')) {
            console.log('No valid H1 headers found on the page.');
            return { h1: [] };
        }

        console.log('Extracted H1 headers:', h1Headers);

        const data = {
            h1: h1Headers
        };
        console.log('Saved extracted H1 headers to newH1.json');

        return data;

    } catch (error) {
        console.error('Error:', error);
        await browser.close();
        return { h1: [] }; // Return an empty array in case of an error
    }
}

async function checkH1(h1, primaryKeywords) {
    const primaryKeywordsArray = primaryKeywords.split(',').map(keyword => keyword.trim());
    const primaryKeywordsString = primaryKeywordsArray.join(', ');
    console.log('Input h1:', h1);
    const messages = [
        {
            role: "system",
            content: `You are a SEO Expert and help me to review the Header h1 i.e. '${h1}'. Verify that the h1 incorporates primary keywords i.e. '${primaryKeywordsString}', effectively where relevant. Evaluate whether the H1 tag aligns with the overall SEO strategy and user search intent to determine if optimization is necessary. Please provide the output in json format {"h1": "${h1}", "needOptimization": "yes/no"}, don't output anything else except the json.`,
        }
    ];

    console.log('System Prompt:', messages[0].content);
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

    try {
        const response = await axios.post(apiUrl, payload, { headers });
        const result = response.data.choices[0].message.content.trim();
        console.log('Check H1 response:', result);
        return JSON.parse(result);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function optimizeSingleH1(h1, primaryKeywords) {
    const primaryKeywordsArray = primaryKeywords.split(',').map(keyword => keyword.trim());
    const primaryKeywordsString = primaryKeywordsArray.join(', ');

    const messages = [
        {
            role: "system",
            content: `You are an SEO Expert. Help me optimize the header h1 '${h1}' having primary keywords ‘${primaryKeywordsString}’. Ensure the H1 includes the primary keyword(s), while including keywords is important, overloading the H1 with keywords can hurt readability and SEO. H1 should clearly describe the page content to both users and search engines. Keep the H1 between 30 and 70 characters to ensure it displays properly in search results and on the webpage. Avoid Special Characters: Special characters like commas, colons, semicolons, exclamation marks, question marks, and quotation marks should be avoided for better readability and search engine friendliness. Use hyphens or pipes if needed for clarity. Consider what users are likely searching for and ensure the H1 matches their intent. Please provide the output in the following JSON format: {"h1": "current h1 here", "optimized": "optimized h1 here", "reason": "any flaws in the current h1 here", "impact": "impact on SEO here"}. Don't add anything else except this JSON in the output.`,
        }
    ];

    console.log('System Prompt:', messages[0].content);
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

    try {
        const response = await axios.post(apiUrl, payload, { headers });
        const result = response.data.choices[0].message.content.trim();
        console.log('Optimize H1 response:', result);
        return JSON.parse(result);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function optimizeMultipleH1(h1Array, primaryKeywords) {
    const primaryKeywordsArray = primaryKeywords.split(',').map(keyword => keyword.trim());
    const primaryKeywordsString = primaryKeywordsArray.join(', ');

    const messages = [
        {
            role: "system",
            content: `As an SEO Expert, Optimize the headers in the array using primary keywords i.e. “${primaryKeywordsString}”, ensuring the header includes the primary keyword(s) without keyword stuffing. The header should be descriptive. Ensure the resulting header is between 30 to 70 characters to display effectively on both search results and webpages. Use hyphens or pipes for clarity if necessary, and avoid special characters like commas, colons, semicolons, exclamation marks, question marks, and quotation marks for better readability and SEO friendliness. Merge all the headers into a single header. Please provide the output in the following JSON format: {"optimized": "optimized header here", "reason": "flaws in the merged header here", "impact": "impact on SEO here"}. Don't add anything else except this JSON in the output.`,
        },
        {
            role: "user",
            content: JSON.stringify(h1Array),
        },
    ];

    console.log('System Prompt:', messages[0].content);
    console.log('User Prompt:', messages[1].content);
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

    try {
        const response = await axios.post(apiUrl, payload, { headers });
        // const result = response.data.choices[0].message.content.trim();
        // console.log('Optimize H1 response:', result);
        // return JSON.parse(result);
        let result = response.data.choices[0].message.content.trim();
        result = result.replace(/```json|```/g, '');
        const parsedResult = JSON.parse(result);
        return parsedResult;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function generateH1(url, primaryKeywords) {
    const primaryKeywordsArray = primaryKeywords.split(',').map(keyword => keyword.trim());
    const primaryKeywordsString = primaryKeywordsArray.join(', ');

    const messages = [
        {
            role: "system",
            content: `As an SEO Expert, write H1 header for website ‘${url}’ that are compelling and encourage users to engage with the content using primary keywords i.e. “${primaryKeywordsString}”, ensuring the header includes the primary keyword(s) without keyword stuffing. Ensure the resulting header is 70 characters to display effectively on both search results and webpages. Use hyphens or pipes for clarity if necessary, and avoid special characters like commas, colons, semicolons, exclamation marks, question marks, and quotation marks for better readability and SEO friendliness. Please provide the output in JSON format: {“h1”:”add generated header here”, "reason":"write reason for having h1 header", "impact": "write impact on SEO"}. Don't add anything else except this JSON in the output. `,
        }
    ];

    console.log('System Prompt:', messages[0].content);
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

    try {
        const response = await axios.post(apiUrl, payload, { headers });
        const result = response.data.choices[0].message.content.trim();
        console.log('Generated H1 response:', result);
        return JSON.parse(result);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

module.exports = { extractH1Headers, checkH1, optimizeSingleH1, optimizeMultipleH1, generateH1 };
