var db = require("../conf/database");

module.exports = {
  isLoggedIn: function (req, res, next) {
    if (req.session.user) {
      next();
    } else {
      req.flash("error", "You must be logged in.");
      req.session.save(function (err) {
        if (err) next(err);
        res.redirect("/login");
      });
    }
  },
  isMyPost: async function (req, res, next) {
    try {
      var [rows, fields] = await db.execute(
        "SELECT * FROM posts WHERE id = ?;",
        [req.params.id]
      );
      if (!rows.length) {
        req.flash("error", `This post does not exist`);
        return req.session.save(() => res.redirect("/"));
      } else if (rows[0].fk_userId == req.session.user.userId) {
        next();
      } else {
        req.flash("error", "You don't have the right to do that.");
        req.session.save(function (err) {
          if (err) next(err);
          res.redirect("/");
        });
      }
    } catch (err) {
      next(err);
    }
  },
  getProfileInfo: async function (req, res, next) {
    if (req.session.user.userId == req.params.id) {
      res.locals.isMyProfile = true;
    } else {
      res.locals.isMyProfile = false;
      try {
        var [rows, fields] = await db.execute(
          "SELECT * FROM users WHERE id = ?;",
          [req.params.id]
        );
        if (!rows.length) {
          req.flash("error", `User n°${req.params.id} does not exist`);
          return req.session.save(() => res.redirect("/"));
        } else {
          res.locals.myProfile = rows[0];
        }
      } catch (err) {
        next(err);
      }
    }
    next();
  },
};
