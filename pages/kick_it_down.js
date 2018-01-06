function init() {
  var stage = new createjs.Stage("stage");
  var background = new createjs.Shape();
  background.graphics.beginFill("Black").drawRect(0, 0, 640, 480);
  stage.addChild(background);
  stage.update();
}

var socket = io('http://localhost:8080');
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});
