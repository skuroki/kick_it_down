class Character {
  constructor(socket) {
    this.x = 320;
    this.y = 240;
    this.vx = 128.0;
    this.vy = 0.0;
    this.from = Date.now();
    this.socket = socket;
  }

  get parameters() {
    return { x: this.x, y: this.y, vx: this.vx, vy: this.vy, from: this.from }
  }

  get current() {
    let now = Date.now();
    let current_x = this.x + this.vx * (now - this.from) / 1000.0;
    let current_y = this.y + this.vy * (now - this.from) / 1000.0;
    return { x: current_x, y: current_y }
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
  socket.emit('clock', Date.now());

  let character = new Character(socket);
  characters.push(character);
  socket.emit('character', character.parameters);

  setInterval( () => {
    socket.emit('clock', Date.now());
  }, 1000);
});

setInterval( () => {
  for (let character of characters) {
    const left_wall = 32 / 2;
    const right_wall = 640 - 32 / 2;
    let current = character.current
    if (current.x > right_wall) {
      character.x = right_wall;
      character.vx = -character.vx;
      character.from = Date.now();
      character.socket.emit('update', character.parameters);
    }
    else if (current.x < left_wall) {
      character.x = left_wall;
      character.vx = -character.vx;
      character.from = Date.now();
      character.socket.emit('update', character.parameters);
    }
  }
}, 10);
