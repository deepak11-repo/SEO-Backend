const { fetchH2, checkH2, optimizeH2 } = require("../../../utility/optimization/Headings/h2");

const getH2 = async (req, res) => {
    try {
        const { url, secondaryKeywords } = req.query;
        if (!url || !secondaryKeywords) {
            return res.status(400).json({ message: "URL and secondaryKeywords are required" });
        }
        const h2Object = await fetchH2(url);
        if (!h2Object || !h2Object.h2 || h2Object.h2.length === 0) {
            return res.status(200).json({ message: "empty" });
        }
        const { h2 } = h2Object;
        const h2Array = await checkH2(h2, secondaryKeywords);
        if(h2Array.length > 0) {
            const output = await optimizeH2(h2Array, secondaryKeywords); 
            // const outputJson = JSON.parse(output); 
            // res.status(200).json(outputJson);
            console.log('Output:', output); // Log output before sending response
            res.status(200).json(output);
        } else {
            res.status(200).json({ message: "optimized"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { getH2 };
