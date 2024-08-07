const { fetchTitle, checkTitle, optimizeTitle } = require('../../../utility/optimization/Title/title');

const getTitle = async (req, res, next) => {
    try {        
        const { url, primaryKeywords } = req.query;
        if (!url || !primaryKeywords) {
            return res.status(400).json({ message: "URL and primaryKeywords are required" });
        }

        const title = await fetchTitle(url);
        const optimizationNeeded = await checkTitle(title, primaryKeywords);
        if (optimizationNeeded) {
            const website = new URL(url).hostname;
            const output = await optimizeTitle(title, primaryKeywords, website);
            const outputJson = JSON.parse(output); 
            res.status(200).json({message: "yes", outputJson});
        } else {
            res.status(200).json({ message: "no", title: title });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    } finally {
        next();
    }
};

module.exports = { getTitle };