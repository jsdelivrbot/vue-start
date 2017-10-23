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
const VK = require('vksdk');
const neo4j = require('neo4j');
const cron = require('node-cron');
let db = new neo4j.GraphDatabase('http://neo4j:q100500q@localhost:7474');

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
// .options('/login', function () {
//   console.log("login-option");
//   res.send('options ');
//   console.log(JSON.parse(req.body));
// });

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
});


let getFriends = function getFriends(uid, count, deepness) {

  globalChecked = globalChecked.filter((v, i, a) => a.indexOf(v) === i);
  deepness = deepness || 0;
  if (deepness > startDeepness) {
    return
  }
  if (globalChecked.indexOf(uid) >= 0) {
    console.log(globalChecked.indexOf(uid), uid, globalChecked.length);
    return
  }
  let myEvent = uid;
  vk.request(
    'friends.get',
    {
      'order': 'random',
      // 'order':'random',
      'user_id': uid,
      'count': count,
      'fields':
      'id, ' +
      'domain, ' +
      'bdate, ' +
      'photo_200_orig',
    },
    myEvent);
  vk.on(
    myEvent,
    function (_o) {
      if (_o.response && _o.response.items) {
        console.log(
          'Start Event - [',
          myEvent, ']', ' - ',
          JSON.stringify(
            _o.response.items
              .filter(item =>
                globalChecked.indexOf(item.id) < 0)
              .map(item => item.id)),
          ' - deep [',
          deepness,
          ']');
        _o.response.items
          .filter(item =>
            globalChecked.indexOf(item.id) < 0)
          .map(item => {
            globalList.push({id0: myEvent, id1: item});
            globalList = globalList.filter((v, i, a) => a.indexOf(v) === i);
          });
        _o.response.items.map(item => {
          getFriends(item.id, startCount, deepness + 1);
        });
      }
    });

};


let setRelation = function () {
  return new Promise(function (resolve, reject) {
    let data = globalList.pop();
    if (!data) {
      return
    }
    let uid0 = data.id0;
    let uid1 = data.id1;

    db.cypher(
      {
        query:
        'MERGE (u0:Person { vkId: {vkId0} })' +
        'ON MATCH SET u0.found = TRUE ' +
        'ON CREATE SET u0.created = TRUE ' +
        'ON CREATE SET u0.found = FALSE ' +

        'MERGE (u1:Person { vkId: {vkId1} })' +
        'ON MATCH SET u1.found = TRUE ' +
        'ON CREATE SET u1.created = TRUE ' +
        'SET u1.domain = {vkId1Domain} ' +

        'MERGE (u0)-[r:Friend]->(u1)' +

        'RETURN u1, u0, r',
        // query: 'MERGE (u0:Person { vkId: {vkId0} }),(u1:Person { vkId: {vkId1} })  MERGE (u0)-[r:Friend]-(u1)',
        params: {
          vkId0: uid0,
          vkId1: uid1.id,
          vkId1Domain: uid1.domain,

        }
      },
      function (err, res) {
        globalChecked.push(uid0);
        globalChecked.push(uid1.id);
        // console.log('ADDING RELATION');
        // console.log('ERROR: ', err);
        // console.log('RESLT: ', JSON.stringify(res));
        setRelation();
      });
  });
};


let vk = new VK({
  'appId': 5227310,
  'appSecret': 'W1gKOVIOX0ssJt8OZRHN',
  'language': 'ru'
});
vk.setSecureRequests(false);

let startCount = 100;
let startDeepness = 4;
let globalList = [];
let globalFriends = [4761919,5217756,4049220];
let globalChecked = [];


// getFriends(startUid, startCount, 0);

cron.schedule(
  '*/10 * * * * *',
  () => {
    setRelation();
  });

getFriends(globalFriends[0], startCount, 0);
getFriends(globalFriends[1], startCount, 0);
getFriends(globalFriends[3], startCount, 0);


//MATCH p=(a {vkId:7157} )-[*3..7]-(b {vkId:4939}) RETURN relationships(p),nodes(p),a,b LIMIT 25
//MATCH p=(a {vkId:99099})<-[*..7]-(b{vkId:3303750}) RETURN relationships(p),nodes(p),a,b limit 10
//MATCH p=(a {vkId:99099})->[*..7]-(b{vkId:3303750}) RETURN relationships(p),nodes(p),a,b limit 10
//MATCH p=shortestPath((a {vkId:108108})-[*1]-(b{vkId:107107})) RETURN relationships(p),nodes(p),a,b limit 1
//MATCH p=shortestPath((a {vkId:108108})-[*..7]-(b{vkId:107107})) RETURN relationships(p),nodes(p),a,b
//MATCH p=shortestPath((a {vkId:108108})-[*..7]-(b{vkId:107107})) RETURN relationships(p),nodes(p),a,b
//MATCH p=shortestPath((a {vkId:103})-[*..7]-(b{vkId:104})) RETURN relationships(p),nodes(p),a,b
//MATCH p=(a)-[*7]-(b) RETURN relationships(p),nodes(p),a,b limit 5
//MATCH (a {vkId:103}),(b{vkId:104}) RETURN a,b
// MATCH (n) DETACH DELETE n
//MATCH p=shortestPath((a {vkId:4761919})-[*..25]-(b{vkId:5217756})) RETURN relationships(p),nodes(p)
