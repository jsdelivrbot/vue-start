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

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});


let getFriends = function getFriends(uid, count) {
  return new Promise(function (resolve, reject) {

    vk.request(
      'friends.get',
      {
        'user_id': uid,
        'count': count || 7,
        'order': 'hints',
        'fields': 'id, domain, bdate, photo_200_orig',
      });

    vk.on('done:friends.get', function (_o) {
      if (_o.response) {
        resolve(_o.response.items)
      }
    });
  });
};

let setRelations = function setRelations(uid0, uids1, deepNes) {
  return new Promise(function (resolve, reject) {
    if (uids1.length > 0) {
      deepNes = deepNes || 0;
      let uid1 = uids1.pop();
      console.log('---------------------------------');
      console.log(uid1);
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

          'RETURN u1',
          // query: 'MERGE (u0:Person { vkId: {vkId0} }),(u1:Person { vkId: {vkId1} })  MERGE (u0)-[r:Friend]-(u1)',
          params: {
            vkId0: uid0,
            vkId1: uid1.id,
            vkId1Domain: uid1.domain,

          }
        },
        function (err, ress) {
          // get data for subfriend if deepness not bigger 6


          // get friends for result
          if (deepNes <= startDeepness) {
            getFriends(ress[0]['u1']['properties']['vkId'], startCount)
              .then(function (list) {
                console.log(list);
                globalList.push({uid0: uid1, uids1: list});
                console.log(globalList);
                setRelations(uid0, uids1, deepNes)
                  .then(function () {
                    console.log('!!!!!!!!!!-------------!!!!!!!!!!!');
                    deepNes++;
                  })
              });
          } else {
            setRelations(uid0, uids1, deepNes)
          }


          // go to next result

        })
    } else {
      resolve();
    }

  });
};


let vk = new VK({
  'appId': 5227310,
  'appSecret': 'W1gKOVIOX0ssJt8OZRHN',
  'language': 'ru'
});
vk.setSecureRequests(false);
let startUid = 3303750;
let endUid = 3303750;
let startCount = 7;
let startDeepness = 5;
let globalList = [];
// let uid = 8862;
// let uid = 272883289;
// let uid = 272950899;
// let uid = 8862;


vk.request('users.get', {'user_id': startUid});
vk.on('done:users.get', function (_o) {
  console.log(_o);
});

getFriends(startUid, startCount)
  .then(function (list) {

    setRelations(startUid, list)
      .then(function (data) {
        console.log('-------------!!!!!!!!!!!!!!!!!!!!----------')
      })

  });


//MATCH p=(a {vkId:7157} )-[*3..7]-(b {vkId:4939}) RETURN relationships(p),nodes(p),a,b LIMIT 25
//MATCH p=(a {vkId:99099})<-[*..7]-(b{vkId:3303750}) RETURN relationships(p),nodes(p),a,b limit 10
//MATCH p=(a {vkId:99099})->[*..7]-(b{vkId:3303750}) RETURN relationships(p),nodes(p),a,b limit 10
//MATCH p=(a {vkId:99099})-[*1]-(b{vkId:3303750}) RETURN relationships(p),nodes(p),a,b limit 1
