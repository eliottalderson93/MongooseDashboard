// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
//DATABASE/MONGOOSE
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/intro',{useNewUrlParser:true});

// Use native promises
mongoose.Promise = global.Promise;

//make schema
var MongooseSchema = new mongoose.Schema({
    name:String,
    age: Number,
    url:String,
    mongooseId:Number
});

mongoose.model('Mongoose',MongooseSchema);

var Mongoose = mongoose.model('Mongoose');

app.get('/', function(req, res) {
    var numMongs = 0;
    var randomImg = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
    Mongoose.find({}, function(err, mongs) {
        if(err){
            console.log("error: did not find mongeese");
            mongs = [{name:null,age:null,url:"/img/mongoose5.jpeg",id:null}];
        }
        else{
            console.log(mongs);
            numMongs = mongs.length;
            console.log("found mongeese");
        }
        res.render('mongeese.ejs',{mongeese:mongs,newMong:numMongs,randImg:randomImg});   
    });
})
app.post('/mongeese/add/:lastMong', function(req, res) {
    console.log("POST DATA", req.body);
    var mongTotal = req.params.lastMong;
    var mong = new Mongoose({name: req.body.name, age: req.body.age, url:req.body.url, mongooseId:req.body.id});
    mong.save(function(err) {
        if(err) {
            console.log('mis-save');
            res.redirect('/mongeese/');
        } else {
            console.log('successfully saved');
            res.redirect('/mongoose/'+req.body.id);
        }
    })
    
});
app.get('/mongoose/:id',function(req,res){
    var randomImg = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
    Mongoose.findOne({mongooseId:req.params.id}, function(err, mong){
        if(err){
            console.log("could not find mongoose");
            res.redirect('/');
        }
        else{
            console.log("found that mongoose");
            console.log(mong);
        }
        res.render("mongoose.ejs",{mongoose:mong,randImg:randomImg})
   })
   
})
app.post('/mongoose/:id/update',function(req,res){
    Mongoose.findOne({mongooseId:req.params.id},function(err,mong){
        if(err){
            console.log("could not find that mongoose to be updated");
        }
        else{
            console.log("found the mongoose to be updated: ",mong);
            mong.name = req.body.name;
            mong.age = req.body.age;
            mong.url = req.body.url;
            mong.save(function(err) {
                if(err) {
                    console.log('mis-save in update');
                    res.redirect('/mongeese/');
                } else {
                    console.log('successfully saved');
                }
        });
    }
    });
    res.redirect('/mongoose/'+req.params.id);
});
app.get('/mongoose/:id/delete',function(req,res){
    console.log("delete: ", req.params.id);    Mongoose.findOneAndRemove({mongooseId:req.params.id},function(err,delMong){
        if(err){
            console.log("could not find and delete that mongoose");
        }
        else{
            console.log(delMong);
        }
    });
    res.redirect('/');
});
// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})