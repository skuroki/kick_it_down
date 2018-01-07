function handler (req, res) {
  res.writeHead(200);
  res.end('hello');
}

let app = require('http').createServer(handler);
let io = require('socket.io')(app);
let characters = [];

app.listen(8080);

io.on('connection', socket => {
  socket.on('my other event', data => {
    console.log(data);
  });

  socket.emit('clock', Date.now());

  let character = { x: 320, y: 240, vx: 32.0, vy: 0.0, from: Date.now() };
  characters.push(character);
  socket.emit('character', character);
});
