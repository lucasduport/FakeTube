var pathToFFMPEG = require("ffmpeg-static");
var exec = require("child_process").exec;
var db = require("../conf/database");

module.exports = {
  makeThumbnail: function (req, res, next) {
    if (!req.file) {
      next(new Error("File upload failed"));
    } else {
      try {
        var destiationOfThumbnail = `public/images/uploads/thumbnail-${
          req.file.filename.split(".")[0]
        }.png`;
        var thmbnailCommand = `${pathToFFMPEG} -ss 00:00:01 -i ${req.file.path} -y -s 450x250 -vframes 1 -f image2 ${destiationOfThumbnail}`;
        exec(thmbnailCommand);
        req.file.thumbnail = destiationOfThumbnail;
        next();
      } catch (err) {
        next(err);
      }
    }
  },
  getPostsForUserBy: async function (req, res, next) {
    try {
      var [rows, fields] = await db.execute(
        "select id, title, description, video, createdAt, thumbnail, isPublic from posts where fk_userId=? ORDER BY posts.createdAt DESC;",
        [req.params.id]
      );
      res.locals.posts = rows;
      for (let i = 0; i < res.locals.posts.length; i++) {
        res.locals.posts[i].isMyProfile = res.locals.isMyProfile;
        res.locals.posts[i].publicText = res.locals.posts[i].isPublic
          ? "private"
          : "public";
      }
      next();
    } catch (err) {
      next(err);
    }
  },

  getPostById: async function (req, res, next) {
    try {
      var [postInfos, fields] = await db.execute(
        "SELECT posts.*, users.username FROM posts JOIN users ON posts.fk_userId = users.id WHERE posts.id = ?;",
        [req.params.id]
      );

      if (!postInfos.length) {
        req.flash("error", `Post n°${req.params.id} does not exist`);
        return req.session.save(() => res.redirect("/"));
      }
      postInfos[0].tags = postInfos[0].tags.split(" ");
      res.locals.currentPost = postInfos[0];
      next();
    } catch (err) {
      next(err);
    }
  },
  getCommentsForPostById: async function (req, res, next) {
    try {
      var [comments, fields] = await db.execute(
        "SELECT comments.*, users.username FROM comments JOIN users ON comments.fk_authorId = users.id WHERE comments.fk_postId = ? ORDER BY comments.createdAt DESC;",
        [req.params.id]
      );
      res.locals.currentPost.comments = comments;
      next();
    } catch (err) {
      next(err);
    }
  },
  getRecentPosts: async function (req, res, next) {
    try {
      var [rows, fields] = await db.execute(
        `select id, title, description, video, createdAt, thumbnail from posts
        WHERE isPublic = 1
        ORDER BY posts.createdAt DESC LIMIT 15;`
      );
      res.locals.posts = rows;
      res.locals.search = undefined;
      next();
    } catch (err) {
      next(err);
    }
  },
};
