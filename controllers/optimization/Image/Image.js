const { scrapeImagesWithoutAltOrTitle } = require('../../../utility/optimization/Images/image');

const getImage = async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ message: "URL parameter is required" });
        }
        const { altArray, titleArray, commonArray } = await scrapeImagesWithoutAltOrTitle(url);
        if (altArray.length === 0 && titleArray.length === 0 && commonArray.length === 0) {
            return res.status(404).json({ message: "No images without alt or title attributes found" });
        }
        res.status(200).json({ altArray, titleArray, commonArray });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { getImage };
