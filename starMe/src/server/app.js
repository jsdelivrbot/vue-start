/**
 * Created by aleksandr_s on 9/27/2017.
 */
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');



app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app
  .get('/', function (req, res) {
    res.send('Hello World!')
  })
  .post('/save', function (req, res, bdy) {
    console.log("save");
    res.send('post save passed');
    console.log(JSON.parse(req.body));


  })
  .post('/login', function (req, res, bdy) {
    console.log("login");

    res.send('post save passed');
    // console.log(JSON.parse(req.body));


  })
  .post('/*', (req, res) => console.log(req, res));
// .options('/login', function () {
//   console.log("login-option");
//   res.send('options ');
//   console.log(JSON.parse(req.body));
// });

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
