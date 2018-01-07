class Character {
  constructor(id, socket) {
    this.id = id;
    this.x = 320;
    this.y = 240;
    this.vx = 128.0;
    this.vy = 0.0;
    this.from = Date.now();
    this.socket = socket;
  }

  get parameters() {
    return { id: this.id, x: this.x, y: this.y, vx: this.vx, vy: this.vy, from: this.from }
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

  for (let character of characters) {
    if (character == null) {
      continue;
    }

    socket.emit('character', character.parameters);
  };

  let character = new Character(characters.length, socket);
  characters.push(character);
  console.log('new character');
  console.log(character.parameters);
  socket.emit('character', character.parameters);
  socket.broadcast.emit('character', character.parameters);

  setInterval( () => {
    socket.emit('clock', Date.now());
  }, 1000);

  socket.on('disconnect', (reason) => {
    for (let character of characters) {
      if (character == null) {
        continue;
      }

      if (character.socket == socket) {
        console.log('remove character');
        console.log(character.id);
        characters[character.id] = null;
        socket.broadcast.emit('remove_character', character.id);
      }
    }
  });
});

setInterval( () => {
  for (let character of characters) {
    if (character == null) {
      continue;
    }

    const left_wall = 32 / 2;
    const right_wall = 640 - 32 / 2;
    let current = character.current
    if (current.x > right_wall) {
      character.x = right_wall;
      character.vx = -character.vx;
      character.from = Date.now();
      console.log('update character');
      console.log(character.parameters);
      character.socket.emit('update', character.parameters);
      character.socket.broadcast.emit('update', character.parameters);
    }
    else if (current.x < left_wall) {
      character.x = left_wall;
      character.vx = -character.vx;
      character.from = Date.now();
      console.log('update character');
      console.log(character.parameters);
      character.socket.emit('update', character.parameters);
      character.socket.broadcast.emit('update', character.parameters);
    }
  }
}, 10);
