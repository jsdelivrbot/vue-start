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
      // 'order': 'hint',
      'order': 'mobile',
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
        let itemsToScan = _o.response.items.filter(item => globalChecked.indexOf(item.id) < 0);
        if (itemsToScan.length < 1) {
          return
        }
        // console.log('Start Event [', myEvent, ']', ' deep [', deepness, ']', ' items [', itemsToScan.length, ']');
        itemsToScan.map(item => {
          globalList.push({id0: myEvent, id1: item});
          globalList = globalList.filter((v, i, a) => a.indexOf(v) === i);
        });
        itemsToScan.map(item => {
          globalToScan.push({id: item.id, startCount: startCount, deepness: deepness + 1});
        });
      }else{
        console.log(myEvent,':',_o.error.error_msg);

        db.cypher({
          query:'MATCH (u0:Person { vkId: {vkId0} }) SET u0:Deactivated',
          params: {
            vkId0:myEvent
          }
        },function (err, res) {

        })
      }

    });

};
let setRelationFriend = function () {
  return new Promise(function (resolve, reject) {
    let data = globalList.pop();
    if (!data) {
      return
    }
    let uid0 = data.id0;
    let uid1 = data.id1;

    // console.log(JSON.stringify(uid1));

    db.cypher(
      {
        query:
        'MERGE (u0:Person { vkId: {vkId0} })' +
        // 'ON MATCH SET u0.found = TRUE ' +
        // 'ON CREATE SET u0.created = TRUE ' +
        // 'ON CREATE SET u0.found = FALSE ' +

        'MERGE (u1:Person { vkId: {vkId1} })' +
        'ON MATCH SET u1.found = TRUE ' +
        'ON CREATE SET u1.created = TRUE ' +


        // 'MERGE (u0)<-[r:Friend]-(u1)' +
        // 'MERGE (u0)-[r:Friend]->(u1)' +
        'MERGE (u0)-[r:Friend]-(u1)' +

        'SET u1.vkDomain = {vkId1Domain} ' +
        'SET u1.firstName = {vkId1FirstName} ' +
        'SET u1.lastName = {vkId1LastName} ' +

        'RETURN u1, u0, r',
        // query: 'MERGE (u0:Person { vkId: {vkId0} }),(u1:Person { vkId: {vkId1} })  MERGE (u0)-[r:Friend]-(u1)',
        params: {
          vkId0: uid0,
          vkId1: uid1.id,
          vkId1Domain: uid1.domain,
          vkId1FirstName: uid1.first_name,
          vkId1LastName: uid1.last_name,
          // relation:'Friend'

        }
      },
      function (err, res) {
        globalChecked.push(uid0);
        globalChecked.push(uid1.id);
        // console.log('ADDING RELATION');
        // console.log('ERROR: ', err);
        // console.log('RESLT: ', JSON.stringify(res));
        setRelationFriend();
      });
  });
};





let startCount = 100;
let startDeepness = 3;
let globalList = [];
// let globalFriends = [1047350, 10616624, 441575607, 136352849, 1097538, 136352849, 8219971];
// let globalFriends = [15970041,5319461,208576695,227630028,271128644];
let globalFriends = [6526905,7304475];
// let globalFriends = [15970041,5319461,8500351,208576695,227630028,15970041,5319461,271128644];
//https://vk.com/albums148943263
//https://vk.com/doc243240023_452920817
//https://vk.com/albums163948203
//https://vk.com/albums138701665
//https://vk.com/albums216621231
//https://vk.com/albums3326710
//https://vk.com/albums234280163
//https://vk.com/doc52809064_452376811
//https://vk.com/doc170557796_452653556
//https://vk.com/doc446870248_452580223
//https://vk.com/albums214523910
//https://vk.com/albums162299630


// TODO array to file / from file
let globalChecked = [];
let globalToScan = [];

// getFriends(startUid, startCount, 0);

cron.schedule(
  '*/5 * * * * *',
  () => {
    setRelationFriend();
  });
cron.schedule(
  '*/1 * * * * *',
  () => {
    globalToScan = globalToScan.filter((v, i, a) => a.indexOf(v) === i);
    globalToScan = globalToScan.filter((v) => globalChecked.indexOf(v.id) < 0);
    let scanObj = globalToScan.pop();
    if (!scanObj) {
      return
    }
    getFriends(scanObj.id, scanObj.startCount, scanObj.deepness);
    console.log('Items to scan :', globalToScan.length, 'Full count [', (Math.pow(startCount, startDeepness+1))*globalFriends.length - globalChecked.length, ']', ' now scanning :', JSON.stringify(scanObj), ' scanned :', globalChecked.length);
  });


globalFriends.map(function (item) {
  getFriends(item, startCount, 0);
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
