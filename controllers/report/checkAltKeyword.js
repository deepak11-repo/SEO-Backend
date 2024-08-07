const { checkAltTextForKeywords } = require('../../utility/report/checkAltKeyword');

const getAltSecondaryKeyword = async (req, res) => {
    try {
        console.log('Alt Keyword API called');
        const { url, secondaryKeywords } = req.query;
        if (!url || !secondaryKeywords) {
            return res.status(400).json({ message: "URL and secondaryKeywords are required" });
        }
        const result = await checkAltTextForKeywords(url, secondaryKeywords);
        return res.json({ hasAltKeyword: result});
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}

module.exports = { getAltSecondaryKeyword };
