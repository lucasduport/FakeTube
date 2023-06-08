var express = require("express");
var router = express.Router();
var db = require("../conf/database");
var bcrypt = require("bcrypt");
const hashRounds = 3;
var { isLoggedIn, getProfileInfo } = require("../middleware/auth");
var { getPostsForUserBy } = require("../middleware/posts");
const {
  usernameCheck,
  isUsernameUnique,
  isEmailUnique,
  passwordCheck,
  emailCheck,
  tosCheck,
  ageCheck,
} = require("../middleware/validation");

router.post(
  "/register",
  usernameCheck,
  passwordCheck,
  emailCheck,
  tosCheck,
  ageCheck,
  isUsernameUnique,
  isEmailUnique,
  async function (req, res, next) {
    var { username, email, password } = req.body;
    try {
      var hashedPassword = await bcrypt.hash(password, hashRounds);

      var [resultObject, fields] = await db.execute(
        "insert into users (username, email, password) values (?,?,?);",
        [username, email, hashedPassword]
      );

      if (resultObject && resultObject.affectedRows == 1) {
        res.redirect("/login");
      } else {
        res.redirect("/register");
      }
    } catch (err) {
      console.log(err);
    }
    res.end();
  }
);

router.post("/login", async function (req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.redirect("/login");
  }
  try {
    var [rows, fields] = await db.execute(
      "select id,username,password,email from users where username=?;",
      [username]
    );
    var user = rows[0];
    var passwordsMatch = false;
    if (user) {
      passwordsMatch = await bcrypt.compare(password, user.password);
      if (passwordsMatch) {
        req.session.user = {
          userId: user.id,
          email: user.email,
          username: user.username,
        };
        req.flash("success", "Login successful");
        req.session.save(function (err) {
          return res.redirect("/");
        });
      }
    }
    if (!passwordsMatch || !user) {
      // Redirect when username or passwords dont match
      req.flash("error", "Login failed: Invalid username/password");
      req.session.save(function (err) {
        return res.redirect("/login");
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get(
  "/profile/:id(\\d+)",
  isLoggedIn,
  getProfileInfo,
  getPostsForUserBy,
  function (req, res) {
    res.render("profile", { title: "My profile", css: ["style.css"] });
  }
);

router.post("/logout", isLoggedIn, function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      return next(err);
    }
    return res.redirect("/");
  });
});

module.exports = router;
