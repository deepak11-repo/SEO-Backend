const axios = require('axios');
const url = require('url');

function processURL(inputURL) {
    const parsedURL = new URL(inputURL);
    if (parsedURL.pathname !== '/') {
        return parsedURL.href;
    } else {
        return null; 
    }
}

async function optimizeURL(inputURL, primaryKeywords) {
    const primaryKeywordsArray = primaryKeywords.split(',').map(keyword => keyword.trim());
    const primaryKeywordsString = primaryKeywordsArray.join(', ');

    const messages = [
        {
            role: "system",
            content: `As an SEO Expert, Optimize the URL '${inputURL}'. Incorporate primary keywords, such as “${primaryKeywordsString}" directly into the URL path to enhance relevance for search engines. Ensure the URL structure is logical and straightforward. Exclude symbols like %, &, @, and spaces. Use hyphens - to separate words instead of underscores _. Shorter URLs are easier to read and share. Avoid unnecessary parameters or session IDs. Stick to lowercase to prevent case sensitivity issues across different platforms. Always use HTTPS to secure the connection, which can positively impact SEO rankings. Please provide the output in JSON format: {“old”:”here add current url”, “new”: “here add optimized url”, “reason”: “flaws in current url”, “impact”: “impact on SEO here”}. Don't add anything else except this JSON in the output. If no optimization is needed then provide the output in the JSON format: {“url”: ”current url”, “needOptimization”: ”no”}`,
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
        // const result = response.data.choices[0].message.content.trim();
        // console.log('Optimize URL response:', result);
        // return JSON.parse(result);
        let result = response.data.choices[0].message.content.trim();
        try {
            return JSON.parse(result);
        } catch (error) {
            // If JSON.parse fails, attempt to remove Markdown formatting and parse again
            result = result.replace(/```json|```/g, '');
            return JSON.parse(result);
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

module.exports = { processURL, optimizeURL };