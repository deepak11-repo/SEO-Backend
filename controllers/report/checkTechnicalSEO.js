const { checkRobotsTxt, checkSitemapXml, checkHttpStatus } = require("../../utility/report/checkTechnicalSEO");

const checkTechSEO = async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }
  const hasRobotsTxt = await checkRobotsTxt(url);
  const hasSitemapXml = await checkSitemapXml(url);
  const hasHttpStatus = await checkHttpStatus(url);

  res.json({ hasRobotsTxt, hasSitemapXml, hasHttpStatus });
};


module.exports = { checkTechSEO }