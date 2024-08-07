const { analyzePage } = require("../../utility/report/checkExistingLink");

const getExistingLink = async (req, res) => {
    try {
        console.log('Existing Links called');
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ message: "URL is required" });
        }
        const result = await analyzePage(url);
        return res.json (result);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}

module.exports = { getExistingLink }; 
