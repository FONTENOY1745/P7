const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const bodyParser = require("body-parser");
const postCtrl = require("./controllers/posts");
const userCtrl = require("./controllers/user");
const commentCtrl = require("./controllers/comments");
const multer = require("./middleware/multer-config");
const path = require("path");
const helmet = require("helmet");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static("./public"));

//Définition des routes :

const userRoutes = require("./routes/user");
const postsRoutes = require("./routes/posts");
const commentsRoutes = require("./routes/comments");
const forumsRoutes = require("./routes/forums");

app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/forums", forumsRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

app.listen("3000", () => {
  console.log("Listening on port 3000");
});
