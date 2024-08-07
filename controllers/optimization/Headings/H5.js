const { fetchH5, checkH5, optimizeH5 } = require("../../../utility/optimization/Headings/h5");

const getH5 = async (req, res) => {
    try {
        const { url, secondaryKeywords } = req.query;
        if (!url || !secondaryKeywords) {
            return res.status(400).json({ message: "URL and secondaryKeywords are required" });
        }
        const h5Object = await fetchH5(url);
        if (!h5Object || !h5Object.h5 || h5Object.h5.length === 0) {
            return res.status(200).json({ message: "empty" });
        }
        const { h5 } = h5Object;
        const h5Array = await checkH5(h5, secondaryKeywords);
        if (h5Array.length > 0) {
            const output = await optimizeH5(h5Array, secondaryKeywords); 
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

module.exports = { getH5 };
