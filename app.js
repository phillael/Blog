//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const _ = require("lodash");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const day = date.getDate();

mongoose.connect('mongodb://localhost:27017/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const postSchema = {
  title: String,
  content: String,
  date: String
};

const Post = mongoose.model("Post", postSchema);

const homeStartingContent = "This is a blog website made using EJS templating.  Click the compose button to add your own post to this blog! The data is stored on MongoDB and the server is running on node.js and express. The homepage is rendered EJS with to show all of the posts, and a new page is rendered for each individual post by using express routing parameters 😱";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {

  Post.find({}, function(err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  })
});



app.get("/about", function(req, res) {
  res.render("about", {
    pageTitle: "About Phill Aelony"
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    pageTitle: "Contact Info",
    contactInfo: contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose", {
    pageTitle: "Compose",
  });
});

app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    date: day
  });
  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res) {
  const requestedPostID = req.params.postId
  const requestedTitle = _.lowerCase(req.params.postName);
  Post.findOne({
    _id: requestedPostID
  }, function(err, post) {
    res.render("post", {
      title: post.title,
      content: post.content,
      date: post.date
    });
  });
});




app.listen(5000, function() {
  console.log("Server started on port 5000");
});
