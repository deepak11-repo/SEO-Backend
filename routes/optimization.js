const express = require("express");
const router = express.Router();

const { checkURL } = require("../controllers/optimization/URL/validateUrl");
const { getUrl } = require("../controllers/optimization/URL/URL");
const { getTitle } = require("../controllers/optimization/Title/Title");
const { getMetaDescription } = require("../controllers/optimization/MetaDesc/Meta");
const { getH1 } = require("../controllers/optimization/Headings/H1");
const { getH2 } = require("../controllers/optimization/Headings/H2");
const { getH3 } = require("../controllers/optimization/Headings/H3");
const { getH4 } = require("../controllers/optimization/Headings/H4");
const { getH5 } = require("../controllers/optimization/Headings/H5");
const { getH6 } = require("../controllers/optimization/Headings/H6");
const { getContent } = require("../controllers/optimization/Content/Content");
const { getImage } = require("../controllers/optimization/Image/Image");
const { getAnchorText } = require("../controllers/optimization/Anchor/AnchorText");
const { getAnchorLinks } = require("../controllers/optimization/Anchor/AnchorLinks");

router.get("/validate", checkURL);
router.get("/url", getUrl);
router.get("/title", getTitle);
router.get("/meta", getMetaDescription);

router.get("/h1", getH1);

router.get("/h2", getH2);
router.get("/h3", getH3);
router.get("/h4", getH4);
router.get("/h5", getH5);
router.get("/h6", getH6);


router.get("/content", getContent);


router.get("/image", getImage);

router.get("/anchorText", getAnchorText);
router.get("/anchorLink", getAnchorLinks);


module.exports = router;
