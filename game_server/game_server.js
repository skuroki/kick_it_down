function handler (req, res) {
  res.writeHead(200);
  res.end('hello');
}

var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var characters = [];

app.listen(8080);

io.on('connection', function (socket) {
  socket.on('my other event', function (data) {
    console.log(data);
  });

  var character = { x: 320, y: 240, vx: 32.0, vy: 0.0, from: Date.now() };
  characters.push(character);
  socket.emit('character', character);
});
