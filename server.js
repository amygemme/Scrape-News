var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var cheerio = require("cheerio");
var axios = require("axios");

var db = require("./models");

var PORT = 8000;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/NPR_db", { useNewUrlPArser: true });


app.get("/scrape", function (req, res) {

    axios.get("https://www.npr.org/").then(function (response) {
       // var result = [];
        // Load the body of the HTML into cheerio
        console.log(response)
        var $ = cheerio.load(response.data);

        $("h3.title").each(function (i, element) {  // For every h3 tag with a class of title
            var result = {}; // we will store the data in this array for each one

            result.title = $(this)
                .text();
            result.link = $(this)
                .parent("a")
                .attr("href");
                console.log(result);
            db.NPRnews.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });  
        });

        res.send("NPR Scrape, done");

    });

    // After looping through each h4.headline-link, log the results
   // console.log(result);
});

app.get("/articles", function(req, res){
    db.NPRnews.find({})
    .then(function(dbNPR){
        res.json(dbNPR);
    })
    .catch(function(err){
        res.json(err);
    });
})

app.get("/article/:id", function(req, res){
    db.Article.findOne({_id:req.params.id})
    .populate("comment")
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

app.post("/articles/:id", function(req, res){
    db.Comment.create(req.body)
    .then(function(dbComment){
        return db.Article.findOneAndUpdate({_id: req.params.id}, {comment: dbComment._id}, {new: true});
    })
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

app.listen(PORT, function(){
    console.log("App running on port" + PORT + "!");
})

