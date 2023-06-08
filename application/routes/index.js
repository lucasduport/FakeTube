var express = require("express");
var router = express.Router();
var { isLoggedIn } = require("../middleware/auth");
var { getRecentPosts } = require("../middleware/posts");

router.get("/", getRecentPosts, function (req, res) {
  res.render("index", { title: "FakeTube", css: ["style.css"] });
});

router.get("/login", function (req, res) {
  res.render("login", { title: "Login", css: ["style.css"] });
});

router.get("/register", function (req, res) {
  res.render("register", {
    title: "Register",
    css: ["style.css"],
    js: ["validation.js"],
  });
});

router.get("/postvideo", isLoggedIn, function (req, res) {
  res.render("postvideo", { title: "Post video", css: ["style.css"] });
});

module.exports = router;
