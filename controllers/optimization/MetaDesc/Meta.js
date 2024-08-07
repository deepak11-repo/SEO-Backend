const { scrapeMetaDescription, checkMeta, optimizeMeta } = require("../../../utility/optimization/MetaDesc/meta");

const getMetaDescription = async (req, res, next) => {
    try {
        const { url, primaryKeywords } = req.query;
        if (!url || !primaryKeywords) {
            return res.status(400).json({ message: "URL and primaryKeywords are required" });
        }
        const meta = await scrapeMetaDescription(url);
        const optimizationNeeded = await checkMeta(meta, primaryKeywords);
        if (optimizationNeeded) {
            const output = await optimizeMeta(meta, primaryKeywords); // Changed to optimizeMeta
            const outputJson = JSON.parse(output); 
            res.status(200).json({message: "yes", outputJson});
        } else {
            res.status(200).json({ message: "no", meta: meta });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    } finally {
        next();
    }
}

module.exports = { getMetaDescription };
