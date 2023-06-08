var validator = require("validator");
var db = require("../conf/database");

module.exports = {
  usernameCheck: function (req, res, next) {
    var { username } = req.body;
    username = username.trim();
    if (!validator.isLength(username, { min: 3 })) {
      req.flash("error", "Username must be at least 3 characters");
    }

    if (!/[a-zA-Z]/.test(username.charAt(0))) {
      req.flash("error", "Username must begin with a character");
    }

    if (req.session.flash.error) {
      req.session.save(function (err) {
        if (err) next(err);
        res.redirect("/register");
      });
    } else {
      next();
    }
  },
  passwordCheck: function (req, res, next) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[/*\-+!@#$^&~\[\]]).{8,}$/;
    var { password } = req.body;
    if (!passwordRegex.test(password)) {
      req.flash(
        "error",
        "Password must be 8 or more characters and contain at least 1 uppercase letter, 1 number, and 1 of the following special characters: / * - + ! @ # $ ^ & ~ [ ]"
      );
    }
    if (req.session.flash.error) {
      req.session.save(function (err) {
        if (err) next(err);
        res.redirect("/register");
      });
    } else {
      next();
    }
  },
  emailCheck: function (req, res, next) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var { email } = req.body;
    if (!emailRegex.test(email)) {
      req.flash("error", "Email must be valid");
    }
    if (req.session.flash.error) {
      req.session.save(function (err) {
        if (err) next(err);
        res.redirect("/register");
      });
    } else {
      next();
    }
  },
  tosCheck: function (req, res, next) {
    var { tos } = req.body;
    if (!tos) {
      req.flash("error", "You must agree to the terms of service");
    }
    if (req.session.flash.error) {
      req.session.save(function (err) {
        if (err) next(err);
        res.redirect("/register");
      });
    } else {
      next();
    }
  },
  ageCheck: function (req, res, next) {
    var { age } = req.body;
    if (!age) {
      req.flash("error", "You must be 13 years or older to register");
    }
    if (req.session.flash.error) {
      req.session.save(function (err) {
        if (err) next(err);
        res.redirect("/register");
      });
    } else {
      next();
    }
  },
  isUsernameUnique: async function (req, res, next) {
    var { username } = req.body;
    username = username.trim();
    try {
      var [rows, fields] = await db.execute(
        "select id from users where username=?;",
        [username]
      );
      if (rows && rows.length > 0) {
        req.flash("error", "Username already taken");
        req.session.save(function (err) {
          return res.redirect("/register");
        });
      } else {
        next();
      }
    } catch (err) {
      console.log(err);
    }
  },
  isEmailUnique: async function (req, res, next) {
    var { email } = req.body;
    try {
      var [rows, fields] = await db.execute(
        "select id from users where email=?;",
        [email]
      );
      if (rows && rows.length > 0) {
        req.flash("error", "${email} already taken");
        return (
          req.sessio,
          save(function (err) {
            return res.redirect("/register");
          })
        );
      } else {
        next();
      }
    } catch (err) {
      console.log(err);
    }
  },
};
