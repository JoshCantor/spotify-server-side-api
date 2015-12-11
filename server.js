var express = require('express');
var app = express();
app.set('view engine', 'ejs');
var routes = require('./controllers/routes.js');
app.set('view engine', 'ejs');

routes(app);



var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('Server up and listening on', port);
});