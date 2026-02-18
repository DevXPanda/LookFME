const express = require("express");
const router = express.Router();
const { getWelcomeOffer, getWelcomeOfferAdmin, updateWelcomeOffer } = require("../controller/welcomeOffer.controller");
const { isAuth } = require("../config/auth");

router.get("/", getWelcomeOffer);
router.get("/admin", isAuth, getWelcomeOfferAdmin);
router.put("/", isAuth, updateWelcomeOffer);

module.exports = router;
