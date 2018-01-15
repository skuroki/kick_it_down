let express = require('express');
let app = express();

app.get('/match', function (req, res) {
  res.send('game-server-0');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
