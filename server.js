var express = require('express');
var ejs_layout = require('ejs-layouts');
var app = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(ejs_layout.express);
  app.use(app.router);
});




var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var db = require('./models');


app.use(express.static('public'));


app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/index.html');
});

//create a show
app.post('/api/shows', function (req, res) {
  var newShow = new db.Show({
    title: req.body.title
  });
  newShow.save(function (err, show) {
    if (err) {
      return console.log("save error: " + err)
    }
    console.log("saved ", show);
    res.json(show);
  });
});

//delete a show
app.delete('/api/show/:id', function apiRemoveShow(req, res) {
  console.log('show delete', req.params);
  var showId = req.params.id;
  db.Show.findOneAndRemove({_id: showId},function (err, deletedShow) {
    res.json(deletedShow);
  });
});

app.get('/api/shows', function apiShow(req, res) {
  db.Show.find()
    .exec(function (err, allShows) {
      if (err) {
        return console.log("index error: " + err);
      }
      res.render('index', {shows:shows});
    });
});



app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is up and running on http://localhost:3000/');
});
