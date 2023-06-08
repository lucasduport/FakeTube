var express = require("express");
var router = express.Router();
var multer = require("multer");
const {
  makeThumbnail,
  getPostById,
  getCommentsForPostById,
} = require("../middleware/posts");
var db = require("../conf/database");
const { isLoggedIn, isMyPost } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/videos/uploads");
  },
  filename: function (req, file, cb) {
    //video/mp4
    var fileExtension = file.mimetype.split("/")[1];
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/create",
  isLoggedIn,
  upload.single("uploadVideo"),
  makeThumbnail,
  async function (req, res, next) {
    var { title, description, tags, isPublic } = req.body;
    var { path, thumbnail } = req.file;
    var { userId } = req.session.user;
    isPublic = isPublic ? 1 : 0;
    try {
      var [insertResult, _] = await db.execute(
        `INSERT INTO posts (title, description, video, thumbnail,
             fk_userId, tags, isPublic) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, description, path, thumbnail, userId, tags, isPublic]
      );
      if (insertResult && insertResult.affectedRows) {
        req.flash("success", "Your post was created successfully!");
        return req.session.save(function (err) {
          if (err) {
            next(err);
          }
          return res.redirect(`/posts/${insertResult.insertId}`);
        });
      } else {
        next(new Error("Post could not be created"));
      }
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:id(\\d+)",
  isLoggedIn,
  getPostById,
  getCommentsForPostById,
  function (req, res) {
    res.render("viewpost", { css: ["style.css"] });
  }
);

router.get("/search", async function (req, res, next) {
  var { searchValue } = req.query;
  try {
    var [rows, fields] = await db.execute(
      `select id,title,thumbnail, concat_ws(' ', title, description, tags) as haystack
      from posts where isPublic = 1
      having haystack like ?;`,
      [`%${searchValue}%`]
    );

    if (rows && rows.length == 0) {
      req.flash("error", "No posts found");
      return req.session.save(function (err) {
        if (err) {
          next(err);
        }
        return res.redirect("/");
      });
    } else {
      res.locals.posts = rows;
      res.locals.search = searchValue;
      return res.render("index", { title: "FakeTube", css: ["style.css"] });
    }
  } catch (err) {
    next(err);
  }
});

router.get(
  "/delete/:id(\\d+)",
  isLoggedIn,
  isMyPost,
  async function (req, res, next) {
    var { id } = req.params;
    try {
      var [deleteComms, _] = await db.execute(
        `DELETE FROM comments WHERE fk_postId=?;`,
        [id]
      );

      if (!deleteComms && !deleteComms.affectedRows) {
        next(new Error("Comments could not be deleted"));
      }

      var [deleteResult, _] = await db.execute(
        `DELETE FROM posts WHERE id=?;`,
        [id]
      );

      if (deleteResult && deleteResult.affectedRows) {
        req.flash("success", "Post deleted successfully");
        return req.session.save(function (err) {
          if (err) {
            next(err);
          }
          return res.redirect(`/users/profile/${req.session.user.userId}`);
        });
      } else {
        next(new Error("Post could not be deleted"));
      }
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/edit/:id(\\d+)",
  isLoggedIn,
  isMyPost,
  async function (req, res, next) {
    var { id } = req.params;
    try {
      var [updateResult, fields] = await db.execute(
        `UPDATE posts SET isPublic = not isPublic WHERE id=?;`,
        [id]
      );
      if (updateResult && updateResult.affectedRows) {
        req.flash("success", "Post updated successfully");
        return req.session.save(function (err) {
          if (err) {
            next(err);
          }
          return res.redirect(`/users/profile/${req.session.user.userId}`);
        });
      } else {
        req.flash("error", "Post could not be updated");
        return req.session.save(function (err) {
          if (err) {
            next(err);
          }
          return res.redirect(`/users/profile/${req.session.user.userId}`);
        });
      }
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
