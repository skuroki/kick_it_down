let express = require('express');
let app = express();
let bodyParser = require('body-parser');

let gameServers = {};

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/match', function (req, res) {
  console.log('match gameServers ' + JSON.stringify(gameServers));
  let waitings = Object.entries(gameServers).filter((e) => e[1] == 'waiting');
  console.log('waitings ' + JSON.stringify(waitings));
  if (waitings.length > 0) {
    let selected = waitings[Math.floor(Math.random() * waitings.length)];
    console.log('selected ' + JSON.stringify(selected));
    res.send(selected[0]);
    return;
  }
  let readies = Object.entries(gameServers).filter((e) => e[1] == 'ready');
  console.log('readies ' + JSON.stringify(readies));
  if (readies.length > 0) {
    let selected = readies[Math.floor(Math.random() * readies.length)];
    console.log('selected ' + JSON.stringify(selected));
    res.send(selected[0]);
    return;
  }
  res.send('fullhouse');
});

app.post('/register', function (req, res) {
  console.log('register ' + JSON.stringify(req.body));
  gameServers[req.body.name] = req.body.state;
  console.log('gameServers ' + JSON.stringify(gameServers));
  res.send('ok');
});

app.listen(8080, function () {
  console.log('matching server running');
});
