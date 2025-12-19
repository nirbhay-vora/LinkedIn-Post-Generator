const express = require("express");
const router = express.Router();
const { auth } = require("../../middleware/auth");
const {
    loginLinkedIn,
    linkedinCallback,
    postToLinkedIn
} = require("../controllers/linkedinController");

router.get("/login", loginLinkedIn);
router.get("/callback", linkedinCallback);
router.post("/post", auth, postToLinkedIn);

module.exports = router;
