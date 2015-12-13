var express = require('express');
var app = express();
var routes = require('./controllers/routes.js');
var bodyParser = require('body-parser');
var request = require('request');

app.set('view engine', 'ejs');

//where does the following line belong?
app.set('view engine', 'ejs');

app.use(bodyParser.json());       
app.use(bodyParser.urlencoded({    
  extended: true
}));

routes(app);

var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('Server up and listening on', port);
});