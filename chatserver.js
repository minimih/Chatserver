
/**
 * Module dependencies.
 */

var express = require('express');
var exphbs  = require('express3-handlebars');
var routes = require('./routes');

var http = require('http');
var path = require('path');
var uuid = require('node-uuid');

var WebSocketServer = require('ws').Server;

app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


var wss = new WebSocketServer({server: server});
console.log('websocket server created');

var clients = {};
var users = {}
wss.on('connection', function(ws) {
    var userID = uuid.v1();
    clients[userID] = ws;
    users[userID] = 'guest';

    console.log('client :' + userID + ' connected');

    for (id in clients ) {
        clients[id].send(JSON.stringify({ users : users}));
    }

    ws.on('message', function(message) {
        message = JSON.parse(message);
        console.log('received from ' + userID + ':' + message.name + " - " + message.msg);
        users[userID] = message.name;

        for (id in clients ) {
            clients[id].send(JSON.stringify(message));
        }

        for (id in clients ) {
            clients[id].send(JSON.stringify({ users : users}));
        }

    });

    ws.on('close', function() {
        console.log('client :' + userID + ' closed connection');
        delete clients[userID];
    });
});
