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
  background.graphics.beginFill("Black").drawRect(0, 0, 640, 480);
  stage.addChild(background);
  stage.update();
  let characters = [];

  let socket = io('http://localhost:8080');

  socket.on('clock', time => {
    console.log(time);
    ServerDate.set(time)
  });

  socket.on('character', data => {
    console.log(data);
    let shape = new createjs.Shape();
    shape.graphics.beginFill("Red").drawRect(-16, -16, 32, 32);
    stage.addChild(shape);
    characters.push(new Character(shape, data.x, data.y, data.vx, data.vy, data.from));
  });

  createjs.Ticker.addEventListener('tick', event => {
    for (let character of characters) {
      character.update();
    }
    stage.update();
  });
}
