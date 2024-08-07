const puppeteer = require('puppeteer');
const axios = require('axios');
const dotenv = require("dotenv");
dotenv.config();
const { assessSEOOptimization } = require('./manualCheck');

let optimizedContent = [];

async function fetchAndStorePTags(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(url);
        const pText = await page.evaluate(() => {
            const pElements = Array.from(document.querySelectorAll('p'));
            return pElements
                .map(p => p.textContent.trim())
                .filter(text => text.split(/\s+/).length > 7 && !text.includes('Suggestions based on your search history appear here'));
        });
        return { p: pText };
    } catch (error) {
        console.error('Error fetching and storing <p> tags:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

async function checkP(paragraph, primaryKeyword, secondaryKeywords) {
    const seoAssessment = assessSEOOptimization(paragraph, primaryKeyword, secondaryKeywords);
    return seoAssessment.optimizationNeeded ? paragraph : '';
}

async function optimizeP(paragraph, primaryKeyword, secondaryKeywords) {
    let secondaryKeywordsArray = [];
    if (typeof secondaryKeywords === 'string') {
        secondaryKeywordsArray = secondaryKeywords.split(',').map(keyword => keyword.trim());
    } else if (Array.isArray(secondaryKeywords)) {
        secondaryKeywordsArray = secondaryKeywords.map(keyword => keyword.trim());
    } else {
        throw new Error('Secondary keywords should be provided as a comma-separated string or an array.');
    }

    const formattedSecondaryKeywords = secondaryKeywordsArray.filter(keyword => keyword !== '').join(', ');
    const apiKey = process.env.AI_API_KEY;
    const apiUrl = process.env.AI_API_URL;
    
    const messages = [
        {
            role: "system",
            content: `You are an SEO Expert. Optimize the paragraph. Ensure the primary keyword i.e. '${primaryKeyword}' is included naturally within each paragraph, ideally within the first sentence or two. Check for the appropriate use of related secondary keywords i.e. '${formattedSecondaryKeywords}' and variations without keyword stuffing. Include synonyms and semantically related terms to add context. Keep paragraphs concise, typically 2-4 sentences long. Avoid keyword stuffing. Include contextual terms and phrases related to the primary keyword to provide semantic relevance. For each P tag please provide the output in format: {"p": "current p here", "optimized": "optimized p here", "reason": "any flaws in the current p here", "impact": "impact on SEO here"}. Do not output anything else except the json.`,
        },
        {
            role: "user",
            content: paragraph
        }
    ];

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
        const result = JSON.parse(response.data.choices[0].message.content.trim());
        console.log(result);
        optimizedContent.push(result);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


async function processParaContent(url, primaryKeyword, secondaryKeywords) {
    try {
        const result = await fetchAndStorePTags(url);
        const paragraphs = result.p;
        
        if (!paragraphs || paragraphs.length === 0) {
            console.log('No paragraphs found on the webpage.');
            return [];
        }

        const results = await Promise.all(paragraphs.map(paragraph => checkP(paragraph, primaryKeyword, secondaryKeywords)));
        const filteredResults = results.filter(result => result !== '');
        const formattedResults = { p: filteredResults };

        if (formattedResults.p.length > 0) {       
            for (let paragraph of formattedResults.p) {
                await optimizeP(paragraph, primaryKeyword, secondaryKeywords);
            }
            return optimizedContent;
        } else {
            console.log('No paragraphs needed optimization.');
            return [];
        }
    } catch (error) {
        console.error('Error processing paragraphs:', error);
        throw error; 
    }
}

module.exports = { processParaContent };