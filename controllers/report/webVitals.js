const { getMobilePageSpeedInsights, getDesktopPageSpeedInsights } = require("../../utility/report/webVitals");

const getWebVitals = async (req, res) => {
    try {
        const { url } = req.query;
        const mobileScores = await getMobilePageSpeedInsights(url);
        const desktopScores = await getDesktopPageSpeedInsights(url);
        res.json({
            mobileScores,
            desktopScores
        });
    } catch (error) {
        console.error('Error fetching PageSpeed Insights scores:', error.message);
        res.status(500).json({ error: 'Failed to fetch PageSpeed Insights scores' });
    }
}


module.exports = { getWebVitals };