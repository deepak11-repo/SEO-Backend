const express = require("express");
const router = express.Router();


const { getWebVitals } = require("../controllers/report/webVitals");

const { checkTechSEO } = require("../controllers/report/checkTechnicalSEO");
const { validateSD } = require("../controllers/report/checkSD");
const { checkCanonical } = require("../controllers/report/checkCanonical");
const { checkTag } = require("../controllers/report/checkTag");
const { getScores } = require("../controllers/report/checkScore");
const { getTitleMeta } = require("../controllers/report/checkTitleMeta");
const { getURLStructure } = require("../controllers/report/checkURL");
const { getContent } = require("../controllers/report/checkContent");

const { getScreenshot } = require("../controllers/report/checkSS");
const { getMobileFriendly } = require("../controllers/report/checkMobileFriendly");
const { getExistingLink } = require("../controllers/report/checkExistingLink");
const { getAltSecondaryKeyword } = require("../controllers/report/checkAltKeyword");


router.get("/checkTechSEO", checkTechSEO);
router.get("/checkSD", validateSD);
router.get("/checkCanonical", checkCanonical);
router.get("/checkTag", checkTag);
router.get("/checkScore", getScores);
router.get("/checkTitleMeta", getTitleMeta);
router.get("/checkURL", getURLStructure);
router.get("/checkContent", getContent);
router.get("/checkSS", getScreenshot);
router.get("/checkMobileFriendly", getMobileFriendly);
router.get("/checkInternalLink", getExistingLink);
router.get("/checkAltKeyword", getAltSecondaryKeyword);

router.get("/vitals", getWebVitals);

module.exports = router;
