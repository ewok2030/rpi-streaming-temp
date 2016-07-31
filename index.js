const express = require('express');
const socket = require('socket.io');
const hbr = require('express-handlebars');
const child_process = require('child_process');

// Express setup
const app = express();
app.set('port', process.env.PORT || 3000);
// Set view engine to handlebars
app.engine('.html', hbr({defaultLayout: 'main', extname: '.html'}));
app.set('view engine', '.html');

// Set express routes
app.get('/', function (req, res) {
    res.render('index');
});

// Start Express server
const server = app.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

// Start Socket.io
var io = new socket(server);

// When a connection is established...
io.on('connection', function(socket) {
  // Sse setInterval function to send new data every 5 secs
  setInterval(function(){
    // Example without raspberry pi:
    var date = new Date();
    var temp = Math.random();
    socket.emit('temperatureUpdate', date.getTime(), temp);
    console.log('temperatureUpdate: [ ' + date.toISOString() + ' , ' + temp + ' ]');

    /*
    // User child_process to run a Linux command and retrieve the output from stdout
    child = child_process.exec("cat /sys/class/thermal/thermal_zone0/temp", function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
    } else {
      // You must send time (X axis) and a temperature value (Y axis)
      var date = new Date().getTime();
      var temp = parseFloat(stdout)/1000;
      socket.emit('temperatureUpdate', date, temp);
    }
  });*/
}, 1000);
});
