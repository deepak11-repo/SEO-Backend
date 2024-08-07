const { processURL, optimizeURL } = require('../../../utility/optimization/URL/URL');

const getUrl = async (req, res) => {
    try {
        const { url, primaryKeywords } = req.query;
        console.log("Received request with URL:", url);

        const processedURL = processURL(url);
        if (processedURL) {
            console.log("Processed URL with path:", processedURL);
            try {
                const optimizedResult = await optimizeURL(processedURL, primaryKeywords);
                console.log("Optimized URL result:", optimizedResult);
                res.status(200).json({ message: "yes", optimizedResult });
            } catch (error) {
                console.error('Error optimizing URL:', error);
                res.status(500).json({ message: "Error optimizing URL" });
            }
        } else {
            console.log("URL does not have a path:", url);
            res.status(200).json({ message: "no", url });
        }
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { getUrl };
