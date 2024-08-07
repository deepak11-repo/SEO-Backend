const { getSS } = require("../../utility/report/checkSS");

const getScreenshot = async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "URL parameter is required" });
  }
  try {
    const result = await getSS(url);
    res.json({ssImg: result});
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while running Lighthouse" });
  }
};

module.exports = { getScreenshot };
