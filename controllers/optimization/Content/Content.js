const { processParaContent } = require('../../../utility/optimization/Content/p');

const getContent = async (req, res) => {
    try {
        console.log('P called');
        const { url, primaryKeywords, secondaryKeywords } = req.query;
        if (!url || !primaryKeywords || !secondaryKeywords) {
            return res.status(400).json({ message: "URL, primaryKeywords, and secondaryKeywords are required" });
        }
        const secondaryKeywordsArray = secondaryKeywords.split(',').map(keyword => keyword.trim());
        const output = await processParaContent(url, primaryKeywords, secondaryKeywordsArray);
        res.status(200).json(output);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { getContent };
