const { fetchH3, checkH3, optimizeH3 } = require("../../../utility/optimization/Headings/h3");

const getH3 = async (req, res) => {
    try {
        const { url, secondaryKeywords } = req.query;
        if (!url || !secondaryKeywords) {
            return res.status(400).json({ message: "URL and secondaryKeywords are required" });
        }
        const h3Object = await fetchH3(url);
        if (!h3Object || !h3Object.h3 || h3Object.h3.length === 0) {
            return res.status(200).json({ message: "empty" });
        }
        const { h3 } = h3Object;
        const h3Array = await checkH3(h3, secondaryKeywords);
        if (h3Array.length > 0) {
            const output = await optimizeH3(h3Array, secondaryKeywords); 
            // const outputJson = JSON.parse(output); 
            // res.status(200).json(outputJson);
            console.log('Output:', output); // Log output before sending response
            res.status(200).json(output);
        } else {
            res.status(200).json({ message: "optimized" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { getH3 };
