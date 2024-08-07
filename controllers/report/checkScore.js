const { getPerformanceScores } = require("../../utility/report/checkScore");

const getScores = async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }
    try {
        const result = await getPerformanceScores(url);
        res.json({scores: result});
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while running Lighthouse' });
    }
}

module.exports = { getScores };