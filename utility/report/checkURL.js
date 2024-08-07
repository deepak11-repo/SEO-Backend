const { URL } = require('url');

function checkUrl(inputUrl, primaryKeywordsString) {
    try {
        const parsedUrl = new URL(inputUrl);
        const path = parsedUrl.pathname;
        const hasPath = path !== '/' && path !== '';
        const primaryKeywords = primaryKeywordsString.split(',').map(keyword => keyword.trim());

        // Check if path contains any primary keywords
        const pathContainsKeywords = primaryKeywords.some(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'i');
            return regex.test(path);
        });

        // Validate URL length
        const isUrlLengthValid = inputUrl.length < 75;

        // Regex patterns to detect dates in different formats
        const datePatterns = [
            /\b\d{2}-\d{2}-\d{2}\b/,             // yy-mm-dd
            /\b\d{4}-\d{2}-\d{2}\b/,             // yyyy-mm-dd
            /\b\d{4}-[A-Za-z]{3}-\d{2}\b/,       // yyyy-mmm-dd
            /\b\d{4}\/\d{2}\/\d{2}\b/,           // yyyy/mm/dd
            /\b\d{2}\/\d{2}\/\d{4}\b/,           // mm/dd/yyyy
            /\b\d{2}-\d{2}-\d{4}\b/,             // mm-dd-yyyy
            /\b\d{4}-\d{2}\b/,                   // yyyy-mm
            /\b\d{2}\/\d{4}\b/                   // mm/yyyy
        ];

        // Check if path contains any date formats
        const hasDate = datePatterns.some(pattern => pattern.test(path));

        return { path: hasPath, primaryKeyword: pathContainsKeywords, lengthValid: isUrlLengthValid, hasDate: hasDate };
    } catch (e) {
        console.error('Invalid URL:', e);
        return { path: false, primaryKeyword: false, lengthValid: false, hasDate: false };
    }
}

module.exports = { checkUrl };
