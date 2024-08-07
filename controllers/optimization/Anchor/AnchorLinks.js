const { optimizeLinks } = require('../../../utility/optimization/Anchor/AnchorLink');

const getAnchorLinks = async (req, res) => {
    console.log('AnchorLink API called');
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ message: "URL is required" });
        }
        const optimizedResults = await optimizeLinks(url); 
        res.status(200).json(optimizedResults);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { getAnchorLinks };
