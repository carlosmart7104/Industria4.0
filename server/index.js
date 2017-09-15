var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var wss = require('ws');


app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));

app.use('/', require('./routes/app.router.js'));

app.use(function(req, res, next) {
  res.status(404).render('404', { page: {}, user: { } });
});

require('./services/websockets.service.js')(server);

server.listen(8080, '0.0.0.0', function () {
	console.log("Listening on " + 'localhost' + ", 8080");
});