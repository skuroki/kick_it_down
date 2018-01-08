class Character {
  constructor(shape, x, y, vx, vy, from) {
    this.shape = shape;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.from = from;
  }

  update() {
    let now = ServerDate.now();
    this.shape.x = this.x + this.vx * (now - this.from) / 1000.0;
    this.shape.y = this.y + this.vy * (now - this.from) / 1000.0;
  }

  action(data) {
    this.x = data.x;
    this.y = data.y;
    this.vx = data.vx;
    this.vy = data.vy;
    this.from = data.from;
  }
}

let timeDiff = 0;
class ServerDate {
  static set(time) {
    timeDiff = Date.now() - time;
  }

  static now() {
    return Date.now() - timeDiff;
  }
}

function init() {
  let stage = new createjs.Stage("stage");
  let background = new createjs.Shape();
  background.graphics.beginFill("LightBlue").drawRect(0, 0, 320, 480);
  background.graphics.beginFill("Brown").drawRect(0, 360, 320, 120);
  stage.addChild(background);
  let textBoard = new createjs.Text("Kick it down!", "20px Arial", "White");
  stage.addChild(textBoard);
  stage.update();
  let characters = [];

  let socket = io('http://localhost:8080');

  socket.on('clock', time => {
    ServerDate.set(time)
  });

  socket.on('character', data => {
    console.log(data);
    let shape = new createjs.Shape();
    if (data.id > 0) {
      shape.graphics.beginFill("Red").drawRect(-16, -16, 32, 32);
    }
    else {
      shape.graphics.beginFill("Blue").drawRect(-16, -16, 32, 32);
    }
    stage.addChild(shape);
    characters[data.id] = (new Character(shape, data.x, data.y, data.vx, data.vy, data.from));
  });

  socket.on('update', data => {
    console.log(data);
    characters[data.id].action(data);
  });

  socket.on('remove_character', characterId => {
    console.log('remove_character');
    console.log(characterId);
    let character = characters[characterId];
    stage.removeChild(character.shape);
    characters[characterId] = null;
  });

  socket.on('won', () => {
    textBoard.text = 'Won!'
  });

  socket.on('lost', () => {
    textBoard.text = 'Lost...'
  });

  createjs.Ticker.addEventListener('tick', event => {
    for (let character of characters) {
      if (character == null) {
        continue;
      }
      character.update();
    }
    stage.update();
  });

  stage.addEventListener('click', event => {
    console.log('click!');
    socket.emit('jump');
  });
}
