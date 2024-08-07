const { checkUrl } = require("../../utility/report/checkURL");

const getURLStructure = async (req, res) => {
    try {
        console.log('Check URL called');
        const { url, primaryKeywords } = req.query;
        if (!url || !primaryKeywords ) {
            return res.status(400).json({ message: "URL and primaryKeywords are required" });
        }
        const result = checkUrl(url, primaryKeywords);
        return res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

module.exports = { getURLStructure };
