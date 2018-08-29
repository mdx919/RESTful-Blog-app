var express         = require("express"),
    mongoose        = require("mongoose"),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    expressSanitizer= require("express-sanitizer"),
    app             = express();
    
    
mongoose.connect("mongodb://localhost:27017/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//create schema
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//create a blog manually
// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1535437507630-0c5b80e49fff?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a64401c5df6bb6515a59f5b3536002f7&auto=format&fit=crop&w=500&q=60",
//     body: "Proin pharetra nisi ac purus condimentum venenatis. Curabitur suscipit varius porttitor. Sed ligula ligula, hendrerit quis turpis vitae, pretium commodo sapien. Sed interdum sagittis mattis. Curabitur a mi tristique, condimentum quam non, ultricies lacus. Donec commodo volutpat blandit. In eget ligula quam. Sed egestas interdum hendrerit.",
// })

// RESTful routes
//index route
app.get("/", function(req, res){
    res.redirect("/blogs")
})

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if (err){
            console.log(err)
        } else {
            res.render("index", { blogs: blogs })
        }
    })
})

//create route
app.get("/blogs/new", function(req, res){
    res.render("new")
})

app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new")
        } else {
            res.redirect("/blogs")
        }
    })
})


//show route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs")
        } else {
            res.render("show", { blog: foundBlog });
        }
    })
})

//EDIT route
app.get("/blogs/:id/edit", function(req, res) {
     Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs")
        } else {
            res.render("edit", { blog: foundBlog });
        }
    })
})

//update route
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs/" + req.params.id)
        }
    })
})

//delete route
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs")
        }
    })
})

//listening of the server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started listening....")
})