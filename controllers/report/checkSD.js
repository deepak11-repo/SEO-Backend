const { checkStructuredData } = require("../../utility/report/checkSD");

const validateSD = async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }
  const getResult = await checkStructuredData(url);
  res.send(getResult);
};

module.exports = { validateSD };
