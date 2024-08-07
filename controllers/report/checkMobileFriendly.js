const { checkMobileFriendly } = require('../../utility/report/checkMobileFriendly');

const getMobileFriendly = async (req, res) => {
    try {
        console.log('Mobile friendly Test');
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ message: "URL is required" });
        }
        const result = await checkMobileFriendly(url);
        return res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}

module.exports = { getMobileFriendly };
