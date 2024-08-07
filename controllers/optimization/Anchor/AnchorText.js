const { processAnchor } = require('../../../utility/optimization/Anchor/AnchorText');

const getAnchorText = async (req, res) => {
    console.log('AnchorText API called');
    try {
        const { url } = req.query;
        
        if (!url) {
            return res.status(400).json({ message: "URL parameter is required" });
        }
        
        const output = await processAnchor(url);
        res.status(200).json(output);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { getAnchorText };
