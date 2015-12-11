var express = require('express');

var app = express();
app.set('view engine', 'ejs');

var routes = require('./controllers/routes.js');

//where does the following line belong?
app.set('view engine', 'ejs');

var bodyParser = require('body-parser');
app.use(bodyParser.json());       
app.use(bodyParser.urlencoded({    
  extended: true
}));

var request = require('request');

routes(app);

var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('Server up and listening on', port);
});