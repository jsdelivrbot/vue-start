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

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
});


let vk = new VK({
  'appId': 5227310,
  'appSecret': 'W1gKOVIOX0ssJt8OZRHN',
  'language': 'ru'
});
vk.setSecureRequests(false);


//TODO users.getFollowers
//TODO add city
//TODO add dob
//TODO

let getFriends = function getFriends(uid, count, deepness, relation) {

  return new Promise(function (resolve, reject) {


    globalChecked[relation] = globalChecked[relation].filter((v, i, a) => a.indexOf(v) === i);
    deepness = deepness || 0;
    if (deepness > startDeepness) {
      return
    }
    if (globalChecked[relation].indexOf(uid) >= 0) {
      console.log(globalChecked['Friend'].indexOf(uid), uid, globalChecked['Friend'].length);
      return
    }
    let myEvent = uid + '_' + relation;

    let requestName = 'friends.get';
    if (relation === 'Friend') {
      requestName = 'friends.get'
    }
    if (relation === 'Follower') {
      requestName = 'users.getFollowers'
    }

    vk.request(
      requestName, {
        'order': 'mobile',
        'user_id': uid,
        'count': count,
        'fields': 'id, domain, bdate',
      }, myEvent);


    vk.on(
      myEvent,
      function (_o) {
        let itemsExport = [];

        if (_o.response && _o.response.items) {
          let itemsToScan = _o.response.items.filter(item => globalChecked[relation].indexOf(item.id) < 0);
          console.log('itemsToScan => ', itemsToScan.count);
          myEvent = myEvent.split('_');
          if (itemsToScan.length < 1) {
            return
          }

          resolve({
            setRelation: itemsToScan.map(item => {
              return {id0: myEvent[0], id1: item, relation: relation}
            }),
            scanRelation: itemsToScan.map(item => {
              return {id: item.id, startCount: startCount, deepness: deepness + 1, relation: relation}
            })
          })

        } else {
          db.cypher({
            query: 'MATCH (u0:Person { vkId: {vkId0} }) SET u0:Deactivated', params: {
              vkId0: myEvent
            }
          }, (err, res) => {
            console.log(myEvent, ':', _o.error.error_msg);
          })
        }


      });
  })
};

let setRelationFriend = function (uid0, uid1, relation) {
  return new Promise(function (resolve, reject) {
    db.cypher({
        query:
        'MERGE (u0:Person { vkId: {vkId0} })' +
        'MERGE (u1:Person { vkId: {vkId1} })' +
        'MERGE (u1)-[r:' + relation + ']->(u0)' +
        'SET u1.vkDomain = {vkId1Domain} ' +
        'SET u1.firstName = {vkId1FirstName} ' +
        'SET u1.lastName = {vkId1LastName} ' +
        'RETURN u1, u0, r',
        params: {
          vkId0: uid0,
          vkId1: uid1.id,
          vkId1Domain: uid1.domain,
          vkId1FirstName: uid1.first_name,
          vkId1LastName: uid1.last_name,
        }
      },
      function (err, res) {
        let data = globalList.pop();
        if (!data) {
          return
        }
        let uid0 = data.id0;
        let uid1 = data.id1;
        let relation = data.relation;
        setRelationFriend(uid0, uid1, relation);
        globalChecked[relation].push(res[0].u0.properties.vkId);
      });
  });
};


let startCount = 2;
let startDeepness = 1;
let globalList = [];
let globalFriends = [999];

// TODO array to file / from file
let globalChecked = {Friend: [], Follower: []};
let globalToScan = [];

// cron.schedule('*/5 * * * * *', () => {
//   let data = globalList.pop();
//   if (!data) {
//     return
//   }
//   let uid0 = data.id0;
//   let uid1 = data.id1;
//   let relation = data.relation;
//   setRelationFriend(uid0, uid1, relation);
// });

// cron.schedule('*/1 * * * * *', () => {
//   globalToScan = globalToScan.filter((v, i, a) => a.indexOf(v) === i);
//   let scanObj = globalToScan.pop();
//
//   if (!scanObj) {
//     return
//   }
//   getFriends(scanObj.id, scanObj.startCount, scanObj.deepness, scanObj.relation);
//   // globalChecked[scanObj.relation].push(scanObj.id);
//   // getFollowers(scanObj.id, scanObj.startCount, scanObj.deepness);
//   console.log('Items to scan :', globalToScan.length, 'Full count [', (Math.pow(startCount, startDeepness + 1)) * globalFriends.length - globalChecked['Friend'].length - globalChecked['Follower'].length, ']', ' now scanning :', JSON.stringify(scanObj), ' scanned :', globalChecked['Friend'].length + globalChecked['Follower'].length);
// });


globalFriends.map(function (item) {
  getFriends(item, startCount, 0, 'Friend').then((a, b) => console.log(a, b));
  // getFriends(item, startCount, 0, 'Follower');
  // getFollowers(item, startCount, 0);
});


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
//MATCH p=(a)-[*..3]-(b) with a,b,relationships(p) as r, count(relationships(p)) as rc RETURN a,b,r,rc limit 1
/*
MATCH
p=(a {vkId:15970041})-[*2]-(b)
with
a,b,relationships(p) as r, count(relationships(p)) as rc, nodes(p) as n

RETURN
a,collect(distinct b), collect(distinct n),r,rc
limit 10
*/
