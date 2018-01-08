const stageWidth = 320;
const stageHeight = 480;
const characterSize = 32;
const floor = 360;

class Character {
  constructor(id, socket) {
    this.id = id;
    this.x = stageWidth / 2;
    this.y = floor;
    this.vx = characterSize * 4;
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

function myCharacter(socket) {
  for (let character of characters) {
    if (character == null) {
      continue;
    }

    if (character.socket == socket) {
      return character;
    }
  }
}

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
    let character = myCharacter(socket);
    console.log('remove character');
    console.log(character.id);
    characters[character.id] = null;
    socket.broadcast.emit('remove_character', character.id);
  });

  socket.on('jump', () => {
    console.log('jump!');
    let character = myCharacter(socket);
    let current = character.current
    character.vy = -characterSize * 4;
    character.x = current.x;
    character.y = current.y;
    character.from = Date.now();
    console.log('update character');
    console.log(character.parameters);
    character.socket.emit('update', character.parameters);
    character.socket.broadcast.emit('update', character.parameters);
  });
});

let winner = null;
setInterval( () => {
  if (winner != null) {
    return;
  }

  for (let character of characters) {
    if (character == null) {
      continue;
    }

    const left_wall = characterSize / 2;
    const right_wall = stageWidth - characterSize / 2;
    const ceil = 180 + characterSize / 2
    let changed = false;
    let current = character.current
    if (current.x > right_wall) {
      character.x = right_wall;
      character.y = current.y;
      character.vx = -character.vx;
      character.from = Date.now();
      changed = true;
    }
    else if (current.x < left_wall) {
      character.x = left_wall;
      character.y = current.y;
      character.vx = -character.vx;
      character.from = Date.now();
      changed = true;
    }
    if (current.y < ceil) {
      character.x = current.x;
      character.y = ceil;
      character.vy = -character.vy;
      character.from = Date.now();
      changed = true;
    }
    else if (current.y > floor) {
      character.x = current.x;
      character.y = floor;
      character.vy = 0.0;
      character.from = Date.now();
      changed = true;
    }

    if (changed) {
      console.log('update character');
      console.log(character.parameters);
      character.socket.emit('update', character.parameters);
      character.socket.broadcast.emit('update', character.parameters);
    }

    for (let opponent of characters) {
      if (opponent == null || opponent == character) {
        continue;
      }
      let currentOpponent = opponent.current;

      if (
        character.vy > 0 &&
        currentOpponent.y > current.y &&
        currentOpponent.y - characterSize < current.y &&
        currentOpponent.x - characterSize < current.x &&
        currentOpponent.x + characterSize > current.x
      ) {
        winner = character;
        opponent.x = currentOpponent.x;
        opponent.y = currentOpponent.y;
        opponent.vx = character.vx * 8;
        opponent.vy = -characterSize * 4;
        opponent.from = Date.now();
        console.log('update character');
        console.log(opponent.parameters);
        opponent.socket.emit('update', opponent.parameters);
        opponent.socket.broadcast.emit('update', opponent.parameters);
        character.x = current.x;
        character.y = current.y;
        character.vx = 0.0;
        character.vy = 0.0;
        character.from = Date.now();
        console.log('update character');
        console.log(character.parameters);
        character.socket.emit('update', character.parameters);
        character.socket.broadcast.emit('update', character.parameters);
        console.log('won:');
        console.log(character.id);
        character.socket.emit('won');
        character.socket.broadcast.emit('lost');
      }
    }
  }
}, 10);
