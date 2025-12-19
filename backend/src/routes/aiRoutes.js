const express = require("express");
const router = express.Router();
const { generatePost } = require("../controllers/aiController");

router.post("/generate", generatePost);

module.exports = router;
