
var R = require('ramda');
var Promise = require("bluebird");

//webserver stuff
var express = require('express');
var app = express.createServer();

// communicate via io
var io = require('socket.io')(app);

//io.enable('browser client minification');  // send minified client
//io.enable('browser client etag');          // apply etag caching logic based on version number
//io.set('log level', 1);                    // reduce logging

var clients = [];

// Add a connect listener
io.on('connection', function(client) {

    // user gets his unique key
    var clientKey = clients.length + "_" + Math.floor(Math.random()*1000000000);
    clients.push({key: clientKey, species: "none", color: ""});
    client.send({key: clientKey});
    console.log("registered client "+clientKey);

    // Success!  Now listen to messages to be received
    client.on('message', function(event) {

        function validKey(event) {
            if(typeof event.key === 'string') {
                var id = clientId(event);
                return (clients[id].key === event.key)
            }
            else return false;
        }

        function clientId(event) {
            return event.key.split('_')[0];
        }

        if(event === 'on') {
            remote.switchOn(31, 2);
        }
        if(event === 'off') {
            remote.switchOff(31, 2);
        }
        if(event === 'stop') {
            clearInterval(updateInterval);
        }
        

    });
    client.on('disconnect',function(){
        //clearInterval(interval);
        console.log('Client has disconnected');
    });

});


var port = process.env.NODE_ENV === 'production' ? 80 : 8080;
app.listen(port);
console.log('server running at http://127.0.0.1:'+port+'/');

app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/app'));
});
app.set("view options", { layout: false });

app.get('/', function(req, res){
    res.render('index.html');
});

var remote = require('./remote-switch.js');

// updates of game come here:
var timePerFrame = 1000;

var updates = function() {

    io.sockets.volatile.emit('state', [0,1]);
};

var updateInterval = setInterval(updates, timePerFrame);
