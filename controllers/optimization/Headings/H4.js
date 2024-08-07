const { fetchH4, checkH4, optimizeH4 } = require("../../../utility/optimization/Headings/h4");

const getH4 = async (req, res) => {
    try {
        const { url, secondaryKeywords } = req.query;
        if (!url || !secondaryKeywords) {
            return res.status(400).json({ message: "URL and secondaryKeywords are required" });
        }
        const h4Object = await fetchH4(url);
        if (!h4Object || !h4Object.h4 || h4Object.h4.length === 0) {
            return res.status(200).json({ message: "empty" }); // Return empty array if h4Object or h4Object.h4 is empty
        }
        const { h4 } = h4Object;
        const h4Array = await checkH4(h4, secondaryKeywords);
        if (h4Array.length > 0) {
            const output = await optimizeH4(h4Array, secondaryKeywords); 
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

module.exports = { getH4 };
