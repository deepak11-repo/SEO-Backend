const axios = require("axios");
const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();

async function fetchH4(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();    
    try {
        await page.goto(url);
        const h4Text = await page.evaluate(() => {
            const h4Elements = Array.from(document.querySelectorAll('h4'));
            return h4Elements.map(h4 => h4.textContent.trim());
        });
        return { h4: h4Text };
    } catch (error) {
        console.error('Error fetching h4:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

async function checkH4(h4, secondaryKeywords) {
    const secondaryKeywordsArray = secondaryKeywords.split(',').map(keyword => keyword.trim());
    const secondaryKeywordsString = secondaryKeywordsArray.join(', ');
    const apiKey = process.env.AI_API_KEY;
    const url = process.env.AI_API_URL;

    const messages = [
        {
            role: "system",
            content: `You are an SEO Expert. Help me to review Header H4 tags. Check if there are suitable opportunities to naturally integrate secondary keywords i.e. '${secondaryKeywordsString}', ensuring they are relevant to the specific section of content and flow seamlessly within the context of the header. Evaluate whether the H4 tags align with the overall SEO strategy and user search intent to determine if optimization is required (Yes/No). For each H4 please provide the output in json format [{"h4": "", "needOptimization": "yes/no"}], don't output anything else except the json.`,
        }, 
        {
            role: "user",
            content: JSON.stringify(h4, null, 2)
        }
    ];

    const payload = {
        model: 'gpt-3.5-turbo',
        messages: messages,
    };

    // Send data to API
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    try {
        const response = await axios.post(url, payload, { headers });        
        let result = response.data.choices[0].message.content.trim();
        // const optimizedH4Array = JSON.parse(result).filter(item => item.needOptimization === 'yes');
        // return optimizedH4Array.map(item => item.h4); 
        let optimizedH4Array;
        try {
            optimizedH4Array = JSON.parse(result).filter(item => item.needOptimization === 'yes');
        } catch (error) {
            result = result.replace(/```json|```/g, '');
            optimizedH4Array = JSON.parse(result).filter(item => item.needOptimization === 'yes');
        }
        return optimizedH4Array.map(item => item.h4);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function optimizeH4(h4, secondaryKeywords) {
    const secondaryKeywordsArray = secondaryKeywords.split(',').map(keyword => keyword.trim());
    const secondaryKeywordsString = secondaryKeywordsArray.join(', ');
    const apiKey = process.env.AI_API_KEY;
    const url = process.env.AI_API_URL;

    const messages = [
        {
            role: "system",
            content: `You are an SEO Expert. Help me optimize the header h4 for keywords ‘${secondaryKeywordsString}’. Ensure the H4 includes the keywords, while including keywords is important, overloading the H4 with keywords can hurt readability and SEO. H4 should be descriptive, informative, and relevant. to both users and search engines. Keep the H1 between 30 and 70 characters to ensure it displays properly in search results and on the webpage. Avoid Special Characters like commas, colons, semicolons, exclamation marks, question marks, and quotation marks should be avoided for better readability and search engine friendliness. Use hyphens or pipes if needed for clarity. Consider what users are likely searching for and ensure the H4 matches their intent. 
            For each h4, please provide the output in the following format:
            [{
            "h4": "current h4 here",
            "optimized": "optimized h4 here",
            "reason": "any flaws in the current h4 here",
            "impact": "impact on SEO here"
            }]
            Don't add anything else except this JSON in the output.`,            
        }, 
        {
            role: "user",
            content: JSON.stringify(h4, null, 2)
        }
    ];

    const payload = {
        model: 'gpt-3.5-turbo',
        messages: messages,
    };

    // Send data to API
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    try {
        const response = await axios.post(url, payload, { headers });        
        // const result = response.data.choices[0].message.content.trim();
        // console.log(result);
        // return result;
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

module.exports = { fetchH4, checkH4, optimizeH4 };
