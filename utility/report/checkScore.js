const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const getPerformanceScores = async (url) => {
  const baseUrl = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
  const API_KEY = process.env.PAGESPEED_API_KEY;

  const getScore = async (strategy) => {
    try {
      const response = await axios.get(baseUrl, {
        params: {
          url,
          key: API_KEY,
          strategy,
        },
      });
      const { lighthouseResult } = response.data;
      const performanceScore =
        lighthouseResult.categories.performance.score * 100;
      return performanceScore;
    } catch (error) {
      console.error(`Error fetching ${strategy} score:`, error.message);
      return null;
    }
  };

  const mobileScore = await getScore("mobile");
  const desktopScore = await getScore("desktop");

  return { mobile: mobileScore, desktop: desktopScore };
};

module.exports =  { getPerformanceScores };
