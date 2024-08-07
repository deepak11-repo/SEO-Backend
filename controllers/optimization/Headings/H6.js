const { fetchH6, checkH6, optimizeH6 } = require("../../../utility/optimization/Headings/h6");

const getH6 = async (req, res) => {
    try {
        const { url, secondaryKeywords } = req.query;
        if (!url || !secondaryKeywords) {
            return res.status(400).json({ message: "URL and secondaryKeywords are required" });
        }
        const h6Object = await fetchH6(url);
        if (!h6Object || !h6Object.h6 || h6Object.h6.length === 0) {
            return res.status(200).json({ message: "empty" });
        }
        const { h6 } = h6Object;
        const h6Array = await checkH6(h6, secondaryKeywords);
        if (h6Array.length > 0) {
            const output = await optimizeH6(h6Array, secondaryKeywords); 
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

module.exports = { getH6 };
