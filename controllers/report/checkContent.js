const { scrapeParagraphs } = require("../../utility/report/checkContent");

const getContent = async (req, res) => {
  try {
    console.log("Content API called");
    const { url, primaryKeywords, secondaryKeywords } = req.query;
    if (!url || !primaryKeywords || !secondaryKeywords) {
      return res
        .status(400)
        .json({
          message: "URL, primaryKeywords, and secondaryKeywords are required",
        });
    }
    const result = await scrapeParagraphs(
      url,
      primaryKeywords,
      secondaryKeywords
    );
    return res.json(result);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = { getContent };
