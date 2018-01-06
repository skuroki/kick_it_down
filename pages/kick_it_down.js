function init() {
  var stage = new createjs.Stage("stage");
  var background = new createjs.Shape();
  background.graphics.beginFill("Black").drawRect(0, 0, 640, 480);
  stage.addChild(background);
  stage.update();

  var socket = io('http://localhost:8080');

  socket.on('character', function (data) {
    console.log(data);
    var character = new createjs.Shape();
    character.graphics.beginFill("Red").drawRect(-16, -16, 16, 16);
    character.x = data.x;
    character.y = data.y;
    stage.addChild(character);
    stage.update();
  });
}
