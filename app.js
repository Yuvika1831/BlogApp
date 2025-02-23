const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Read posts from JSON file
const getPosts = () => {
    if (!fs.existsSync("posts.json")) return [];
    const data = fs.readFileSync("posts.json");
    return JSON.parse(data);
};

// Home Page
app.get("/", (req, res) => {
    const posts = getPosts();
    res.render("home", { posts });
});

// Single Post Page
app.get("/post", (req, res) => {
    const posts = getPosts();
    const post = posts.find(p => p.id == req.query.id);
    res.render("post", { post });
});

// Add Post Page
app.get("/add-post", (req, res) => {
    res.render("addPost");
});

// Add a new post
app.post("/add-post", (req, res) => {
    const posts = getPosts();
    const newPost = {
        id: posts.length + 1,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        image: req.body.image || "default.jpg" // Default image if none provided
    };
    posts.push(newPost);
    fs.writeFileSync("posts.json", JSON.stringify(posts, null, 2));
    res.redirect("/");
});

app.listen(3000, () => console.log("Server running on port 3000"));
