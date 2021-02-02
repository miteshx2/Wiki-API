const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const ejs = require('ejs')

const app = express();

app.set("view-engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles").get((req, res) => {
    Article.find(function (err,foundArticles){
        if(!err)
        {
            res.send(foundArticles);
        }
        else
        {
            res.send(err)
        }
    })
}).post((req, res) =>{
 
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save((err)=>{
        if(!err){
            console.log("successfully added a new article");
        } else {
            console.log(err);
        }
    });
}).delete((req, res) =>{
    Article.deleteMany((err)=>{
        if(!err){
            res.send("successfully deleted all articles");
        } else {
            res.send(err)
        }
    })
});

app.route("/articles/:articleTitle")

.get((req, res) =>{
    console.log(req.params);

    Article.findOne({title: req.params.articleTitle}, (err,result) =>{
        if(!err){
            res.send(result);
        }
        else{
            res.send("no records found");
        }
    });
})

.put((req, res) =>{
    console.log("inside put");
    Article.update({title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    (err)=>{
        if(!err){
            res.send("successfully updated using put method");
        }
        else{
            console.log(err);
        }
    })
})

.patch((req, res)=>{
    Article.update({title: req.params.articleTitle},
        {$set: req.body},
        (err)=>{
            if(!err){
                res.send("successfully updated using patch");
            } else {
                console.log(err);
            }
        })
})

.delete((req, res)=>{
    Article.deleteOne({title: req.params.articleTitle},
        (err)=>{
            if(!err){
                res.send("deleted successfully");
            } else {
                res.send(err)
            }
        })
});

//after completing the chaining the method .You should use semicolumn at last......

app.listen(3000,()=>{
    console.log("listening on 3000");
})