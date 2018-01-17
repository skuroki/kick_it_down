let express = require('express');
let app = express();
let bodyParser = require('body-parser');

let gameServers = {};

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/match', function (req, res) {
  res.send('game-server-0');
});

app.post('/register', function (req, res) {
  console.log('register ' + JSON.stringify(req.body));
  gameServers[req.body.name] = req.body.state;
  console.log('gameServers ' + JSON.stringify(gameServers));
  res.send('ok');
});

app.listen(3000, function () {
  console.log('matching server running');
});
