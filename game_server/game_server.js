class Character {
  constructor() {
    this.x = 320;
    this.y = 240;
    this.vx = 32.0;
    this.vy = 0.0;
    this.from = Date.now();
  }

  get parameters() {
    return { x: this.x, y: this.y, vx: this.vx, vy: this.vy, from: this.from }
  }
}

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

  let character = new Character();
  characters.push(character);
  socket.emit('character', character.parameters);
});
