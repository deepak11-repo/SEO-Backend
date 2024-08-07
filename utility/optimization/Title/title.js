const axios = require('axios');
// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra')
const dotenv = require("dotenv");
dotenv.config();

async function fetchTitle(url) {
    try {
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] });
        const page = await browser.newPage();
        await page.goto(url);
        const pageTitle = await page.title();
        await browser.close();
        return pageTitle;
    } catch (error) {
        console.error('Error fetching title:', error);
        throw error;
    }
}

async function checkTitle(title, keywords) {
    const primaryKeywords = keywords.split(',').map(keyword => keyword.trim());
    const keywordsString = primaryKeywords.join(', ');

    const messages = [
        {
            role: "system",
            content: `You are a SEO Expert and help me to determine if the title i.e. '${title}', aligns with the provided keywords i.e. '${keywordsString}', & check if there is a need for optimization. Don't output anything else except the json format {"title": "${title}", "needOptimization": "yes/no"}.`
        }
    ];

    console.log('System Prompt:', messages[0].content);
    const apiKey = process.env.AI_API_KEY;
    const url = process.env.AI_API_URL;

    const payload = {
        model: 'gpt-3.5-turbo',
        messages: messages,
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    try {
        const response = await axios.post(url, payload, { headers });
        const result = response.data.choices[0].message.content.trim();
        console.log(result);
        return result.includes('"needOptimization": "yes"');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function optimizeTitle(title, keywords, website) {
    const primaryKeywords = keywords.split(',').map(keyword => keyword.trim());
    const keywordsString = primaryKeywords.join(', ');

    const messages = [
        {
            role: "system",
            content: `You are an SEO Expert. Help me optimize the title '${title}' for the website '${website}', ensuring it includes the primary keywords '${keywordsString}' and avoids characters like commas (,), colons (:), semicolons (;), exclamation marks (!), question marks (?), and quotation marks ("). Please keep the title descriptive, aiming for around 60 characters in length for optimal readability and SEO impact. If needed for clarity and readability, recommended punctuation includes hyphens (-) or pipes (|). Please provide the output in the following JSON format: {"title": "${title}", "optimized": "optimized title here", "reason": "any flaws in the current title here", "impact": "impact on SEO here"}. Don't add anything else except this JSON in the output.`
        }
    ];

    console.log('System Prompt:', messages[0].content);
    const apiKey = process.env.AI_API_KEY;
    const url = process.env.AI_API_URL;

    const payload = {
        model: 'gpt-3.5-turbo',
        messages: messages,
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    try {
        const response = await axios.post(url, payload, { headers });
        const result = response.data.choices[0].message.content.trim();
        console.log(result);
        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

module.exports = { fetchTitle, checkTitle, optimizeTitle };