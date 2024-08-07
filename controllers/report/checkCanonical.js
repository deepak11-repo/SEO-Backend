const { fetchHTML, checkCanonicalTags } = require("../../utility/report/checkCanonical");

const checkCanonical = async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const htmlContent = await fetchHTML(url);
    
    if (htmlContent) {
      const result = checkCanonicalTags(htmlContent);
      res.json({hasCanonicalTags: result});
    } else {
      res.status(500).json({ error: "Failed to fetch HTML content" });
    }
  } catch (error) {
    console.error(`Error processing URL ${url}: ${error.message}`);
    res.status(500).json({ error: `Error processing URL ${url}: ${error.message}` });
  }
};

module.exports = { checkCanonical };
