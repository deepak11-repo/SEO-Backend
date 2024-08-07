const { checkMetaTags } = require("../../utility/report/checkMetaTag");

const checkTag = async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }
  try {
    const result = await checkMetaTags(url);
    res.json({ hasMetaTag: result });
  } catch (error) {
    console.error(`Error processing URL ${url}: ${error.message}`);
    res
      .status(500)
      .json({ error: `Error processing URL ${url}: ${error.message}` });
  }
};

module.exports = { checkTag };
