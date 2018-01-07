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
  let textBoard = new createjs.Text("Hello World", "20px Arial", "White");
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
    shape.graphics.beginFill("Red").drawRect(-16, -16, 32, 32);
    stage.addChild(shape);
    characters.push(new Character(shape, data.x, data.y, data.vx, data.vy, data.from));
  });

  socket.on('update', data => {
    console.log(data);
    characters[0].x = data.x;
    characters[0].vx = data.vx;
    characters[0].from = data.from;
  });

  createjs.Ticker.addEventListener('tick', event => {
    for (let character of characters) {
      character.update();
      textBoard.text = character.shape.x;
    }
    stage.update();
  });
}
