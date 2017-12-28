/**
 * Created by aleksandr_s on 9/27/2017.
 */
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const md5 = require('md5');
const request = require('request');
const formurlencoded = require('form-urlencoded');
const PORT = process.env.PORT || 5000;

let logins = {};
let tasks = {};
let urls = {};

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app
  .get('/', function (req, res) {
    // res.send('Hello World!');
    res.sendFile('index.html', {root: __dirname})
  })
  .get('/getDataOrbita', function (req, res) {
    // res.send('Hello World!');
    res.sendFile('parse-orbita.co.il.entities.json', {root: __dirname})
  })
  .post('/save', function (req, res, bdy) {
    console.log("save");
    res.send('post save passed');
    console.log(JSON.parse(req.body));
  })
  .post('/login', function (req, res, bdy) {
    console.log("login");
    console.log(req.body);
    console.log(req.body.name);
    console.log(req.body.pass);
    logins[md5(req.body.name + req.body.pass)] = req.body.name;
    // console.log(JSON.parse(req.body));
    res.send({name: req.body.name, hash: md5(req.body.name + req.body.pass)});
    // console.log(JSON.parse(req.body));
  })
  .post('/saveTasks', function (req, res, bdy) {
    console.log(req.body.hash);
    console.log(req.body.tasks);
    tasks[req.body.hash] = req.body.tasks;
    res.send({status: 'saved'});
    // console.log(JSON.parse(req.body));
  })
  .post('/getTasks', function (req, res, bdy) {
    console.log(req.body.hash);
    // tasks[req.body.hash] = req.body.tasks;
    res.send({tasks: tasks[req.body.hash]});
    // console.log(JSON.parse(req.body));
  })
  .post('/urlShort', function (req, res, bdy) {
    console.log(req.body.url);
    console.log(req.body.hashes);
    let options = {
      url: 'https://api.coinhive.com/link/create',
      method: 'POST',
      headers: [
        {
          name: 'content-type',
          value: 'application/x-www-form-urlencoded'
        }
      ],
      form: formurlencoded({secret: 'tPZznhexIFqC4O8fShZdI47XTBTBMy66', hashes: req.body.hashes, url: req.body.url})
    };
    request(options, function (err, rsp, bdy) {
      console.log('ERR:\t', JSON.stringify(err));
      console.log('RSP:\t', JSON.stringify(rsp));
      console.log('BDY:\t', bdy);
      bdy = JSON.parse(bdy);
      urls[req.body.hash] = urls[req.body.hash] || [];
      urls[req.body.hash].push({long: req.body.url, short: bdy.url});
      res.send({urls: urls[req.body.hash]});
    });
    console.log(req.body.hash);
    // tasks[req.body.hash] = req.body.tasks;
    // console.log(JSON.parse(req.body));
  })
  .post('/getUrls', function (req, res, bdy) {
    res.send({urls: urls[req.body.hash]});
  })
  .get('/favicon.ico', (req, res) => {
    console.log('ico');
    res.sendFile('./public/cthulhu0_0.jpg', {root: __dirname})
  })
  .post('/*', (req, res) => {
    console.log(req, res)
  })
  .get('/*', (req, res) => {
    console.log(req.url);
    res.sendFile(req.url, {root: __dirname})
  });

console.log('LISTENING ON PORT ->' + PORT);
app.listen(PORT);



