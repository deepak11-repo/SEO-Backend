const { extractH1Headers, checkH1, optimizeSingleH1, optimizeMultipleH1, generateH1 } = require('../../../utility/optimization/Headings/h1');

const getH1 = async (req, res, next) => {
    try {
        const { url, primaryKeywords } = req.query;

        // Validate URL and primaryKeywords
        if (!url || !primaryKeywords) {
            return res.status(400).json({ message: "URL and primaryKeywords are required" });
        }

        // Extract H1 headers from the URL
        const data = await extractH1Headers(url);
        console.log('Extracted H1 data:', data);

        if (data.h1.length === 0) {
            console.log('No H1 headers found on the page.');
            const newHeader = await generateH1(url, primaryKeywords);
            return res.status(200).json({ message: "new", newHeader });
        }

        // Handle multiple H1 headers
        if (data.h1.length > 1) {
            const optimizationResult = await optimizeMultipleH1(data.h1, primaryKeywords);
            return res.status(200).json({ message: "multiple", optimizationResult, old: data.h1 });
        }

        // Handle single H1 header optimization
        const optimizationResults = await Promise.all(data.h1.map(async h1 => {
            const result = await checkH1(h1, primaryKeywords);
            return result;
        }));

        // Filter and optimize single H1 headers needing optimization
        const filteredResults = optimizationResults.filter(result => result.needOptimization === "yes");

        if (filteredResults.length > 0) {
            const optimizedResults = await Promise.all(filteredResults.map(async result => {
                const optimizationResult = await optimizeSingleH1(result.h1, primaryKeywords);
                return optimizationResult;
            }));
            return res.status(200).json({ message: "single", optimizedResults });
        } else {
            return res.status(200).json({ message: "no", h1: data.h1 });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    } finally {
        next();
    }
};

module.exports = { getH1 };
