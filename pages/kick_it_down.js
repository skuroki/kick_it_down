class Character {
  constructor(shape, id, x, y, vx, vy, from) {
    this.shape = shape;
    this.id = id;
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
  let characters = new Set();

  fetch('/match')
    .then((response) => response.text())
    .then((serverName) => {
      console.log('entering to ' + serverName);

      let socket = io('http://' + serverName + '.' + location.hostname + '/');

      socket.on('clock', time => {
        ServerDate.set(time)
      });

      socket.on('character', data => {
        console.log(data);
        let shape = new createjs.Shape();
        if (data.id > 1) {
          shape.graphics.beginFill("Red").drawRect(-16, -16, 32, 32);
        }
        else {
          shape.graphics.beginFill("Blue").drawRect(-16, -16, 32, 32);
        }
        stage.addChild(shape);
        characters.add(new Character(shape, data.id, data.x, data.y, data.vx, data.vy, data.from));
      });

      socket.on('update', data => {
        console.log(data);
        for (let character of characters) {
          if (character.id == data.id) {
            character.action(data);
            break;
          }
        }
      });

      socket.on('remove_character', characterId => {
        console.log('remove_character');
        console.log(characterId);
        for (let character of characters) {
          if (character.id == data.id) {
            stage.removeChild(character.shape);
            characters.delete(character);
            break;
          }
        }
      });

      socket.on('won', () => {
        textBoard.text = 'Won!'
        socket.close();
      });

      socket.on('lost', () => {
        textBoard.text = 'Lost...'
        socket.close();
      });

      createjs.Ticker.addEventListener('tick', event => {
        for (let character of characters) {
          character.update();
        }
        stage.update();
      });

      stage.addEventListener('click', event => {
        console.log('click!');
        socket.emit('jump');
      });
    });
}
