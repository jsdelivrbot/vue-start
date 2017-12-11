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
// const neo4j = require('neo4j');
const neo4j = require('neo4j-driver').v1;
const cron = require('node-cron');
// let db = new neo4j.GraphDatabase('http://neo4j:q100500q@localhost:7474');
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "q100500q"));
const base58 = require('base58');

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


//TODO add city
//TODO add dob
//TODO

let setRelelation = function (id1, id2, relation, callback) {

  let ne4jQuery = '' +
    'MERGE (u0:Person { vkId: ' + id1 + ' }) ' +
    'MERGE (u1:Person { vkId: ' + id2 + ' }) ' +
    'MERGE (u1)-[r:' + relation + ']->(u0) ' +
    'RETURN u1, u0, r';
  console.log(ne4jQuery);
  let session = driver.session();
  session.run(ne4jQuery).then(callback);

};
let getFollowersList = function getFriendsList(sourceVkId, count, deep, startResult) {
  return new Promise(function (resolve, reject) {
    let request = {rel: 'Follower', req: 'users.getFollowers'};
    let parameters = {'order': 'mobile', 'user_id': sourceVkId, 'count': count, 'fields': 'id'};
    let myEvent = sourceVkId + '_' + request.rel + '_' + request.req;
    let result = startResult || {sourceVkId, deep, listTargetsVkId: [], listRelations: []};
    vk.request(request.req, parameters, myEvent);
    vk.on(
      myEvent, _o => {
        if (_o.response && _o.response.items) {
          _o.response.items.map(item => {
            result.listTargetsVkId.push(item.id);
            result.listRelations.push({target: sourceVkId, source: item.id, relation: request.rel})
          });
          resolve(result)
        }
        else {
          result.error = myEvent + ':' + _o.error.error_msg;
          resolve(result);

        }
      });
  })
};
let getFollowedList = function getFriendsList(sourceVkId, count, deep, startResult) {
  return new Promise(function (resolve, reject) {
    let request = {rel: 'Follower', req: 'users.getSubscriptions'};
    let parameters = {'order': 'mobile', 'user_id': sourceVkId, 'count': count, 'fields': 'id', 'extended': 0};
    let myEvent = sourceVkId + '_' + request.rel + '_' + request.req;
    let result = startResult || {sourceVkId, deep, listTargetsVkId: [], listRelations: []};
    vk.request(request.req, parameters, myEvent);
    vk.on(
      myEvent, _o => {
        if (_o.response.users.items) {
          _o.response.users.items.map(item => {
            result.listTargetsVkId.push(item);
            result.listRelations.push({source: sourceVkId, target: item, relation: request.rel})
          });
          resolve(result)
        }
        else {
          result.error = myEvent + ':' + _o.error.error_msg;
          resolve(result);
        }
      });
  });
};
let setAllRelations = function setAllRelations(startResult) {
  return new Promise(function (resolve, reject) {
    let relToSet = startResult.listRelations.pop();
    if (!!relToSet) {
      setRelelation(relToSet.source, relToSet.target, relToSet.relation, (x) => {
        setAllRelations(startResult)
      });
    } else {
      console.log('-!-');
      resolve(startResult);
      return startResult;
    }
  })
};
let getFriends = function getFriends(uid, count, deepness, step) {
  return new Promise(function (resolve, reject) {
    deepness = deepness || 0;
    if (deepness >= startDeepness) return;

    let relRequests = [
      {rel: 'Friend', req: 'friends.get'},
      {rel: 'Follower', req: 'users.getFollowers'},
      {rel: 'Subscript', req: 'users.getSubscriptions'}
    ];
    relRequests.map(relRequest => {

      switch (relRequest.req) {
        case 'users.getSubscriptions': {

          if (globalChecked[relRequest.rel].indexOf(uid) < 0) {
            let myEvent = uid + '_' + relRequest.rel + '_' + relRequest.req;
            vk.request(relRequest.req, {
              'order': 'mobile',
              'user_id': uid,
              'count': count,
              'extended': 0,

            }, myEvent);

            vk.on(
              myEvent,
              function (_o) {

                if (!_o.response) {
                  console.log(myEvent, ':', _o.error.error_msg);
                }
                let user_ids = JSON.stringify(_o.response.users.items.splice(0, count)).replace(/[\[\]]/gi, '');
                console.log(user_ids);

                if (_o.response && _o.response.users) {
                  // TODO GET USERS
                  let myEvent = uid + '_' + relRequest.rel + '_subs';
                  vk.request('users.get', {
                    'order': 'mobile',
                    'user_ids': user_ids,
                    'count': count,
                    'fields': 'id,domain,bdate,home_town,maiden_name,nickname,relatives,screen_name,site,schools,universities',
                  }, myEvent);
                  vk.on(
                    myEvent,
                    function (_o) {

                      let myEventArr = myEvent.split('_');
                      if (!_o.response) {
                        console.log(myEvent, ':', _o.error.error_msg);
                      }
                      if (_o.response) {
                        _o.response.map(item => {
                          if (globalChecked[relRequest.rel].indexOf(item.id) < 0) {
                            globalList.push({id0: uid, id1: item, relation: myEventArr[1], direct: true});
                            getFriends(item.id, startCount, deepness + 1);
                            globalChecked[relRequest.rel].push(item.id);
                          }
                        })
                      }
                      globalChecked[relRequest.rel].push(uid)
                    });
                }
              }
            )
          }
          break;
        }
        default:
          if (globalChecked[relRequest.rel].indexOf(uid) < 0) {
            let myEvent = uid + '_' + relRequest.rel;
            vk.request(relRequest.req, {
              'order': 'mobile',
              'user_id': uid,
              'count': count,
              'fields': 'id, domain, bdate, home_town,maiden_name,nickname,relatives,screen_name,site,schools,universities',
            }, myEvent);

            vk.on(
              myEvent,
              function (_o) {
                // console.log('got event', myEvent);
                let myEventArr = myEvent.split('_');
                if (_o.response && _o.response.items) {
                  // console.log('[', deepness, ']', myEventArr[1], ':', JSON.stringify(_o.response.items));
                  _o.response.items.map(item => {
                    if (globalChecked[relRequest.rel].indexOf(item.id) < 0) {
                      globalList.push({id0: uid, id1: item, relation: myEventArr[1]});
                      getFriends(item.id, startCount, deepness + 1);
                      globalChecked[relRequest.rel].push(item.id);
                    }
                  })
                }
                else {
                  console.log(myEvent, ':', _o.error.error_msg);
                }
                globalChecked[relRequest.rel].push(uid)
              });
          } else {
            console.log('already checked');
          }
      }
    })
  })
};
let setRelationFriend = function (uid0, uid1, relation, direction) {
  return new Promise(function (resolve, reject) {
    if (globalChecked[relation].indexOf(uid0 + '->' + uid1.id) >= 0) {
      console.log('Already found', globalChecked[relation].indexOf(uid0 + '->' + uid1.id));
      return;
    }

    let cityString = '';
    let cityRelString = '';
    if (!!uid1.home_town) {

      // let cityBuffered = Buffer.from(uid1.home_town.toLowerCase()).toString('base64');
      // console.log(uid1.home_town, '\t', cityFormatted, '\t', cityBuffered);

      let cityFormatted = uid1.home_town
        .replace(/[^0-9a-zA-ZА-Яа-я\u0590-\u05FF\uFB1D-\uFB4F\u0400-\u04F0\-_'"` ,./\\]{1,100}/gi, ' ')
        .replace(/['"`]/gi, "'")
        .replace(/- /gi, "-")
        .replace(/ -/gi, "-")
        .replace(/, /gi, ",")
        .replace(/ ,/gi, ",")
        .toLowerCase();

      cityString = `MERGE (c0:City { name:"` + cityFormatted + `"}) `;
      cityRelString = 'MERGE (u1)-[:HomeTown]->(c0) ';

      // console.log(cityString);
    }

    let ne4jQuery =
      cityString +
      'MERGE (u0:Person { vkId: ' + uid0 + ' }) ' +
      'MERGE (u1:Person { vkId: ' + uid1.id + ' }) ' +
      (
        !direction ?
          'MERGE (u1)-[r:' + relation + ']->(u0) ' :
          'MERGE (u0)-[r:' + relation + ']->(u1) '
      ) +
      cityRelString +

      'SET u1.vkDomain = "' + uid1.domain + '" ' +
      'SET u1.firstName = "' + uid1.first_name + '" ' +
      'SET u1.lastName = "' + uid1.last_name + '" ' +

      (uid1.deactivated ? 'SET u1:Deactivated ' : '') +
      (uid1.deactivated ? 'SET u1:' + uid1.deactivated + ' ' : '') +

      'RETURN u1, u0, r';

    let session = driver.session();
    session
      .run(ne4jQuery, {nameParam: 'James'})
      .then(function (result) {
        let data = globalList.pop();
        if (!data) {
          console.log('data is empty : ', data);
        }
        if (data) {
          let uid0 = data.id0;
          let uid1 = data.id1;
          let rel = data.relation;
          let direct = data.direct;
          setRelationFriend(uid0, uid1, rel, direct);

          globalChecked[rel]
            .push(
              result.records[0].get('u1').properties.vkId.low + '-' +
              result.records[0].get('r').type + '->' +
              result.records[0].get('u0').properties.vkId.low);
        }
        session.close();
      })
      .catch(function (error) {
        console.log(error);
      });


    // db.cypher({
    //     query:
    //     cityString +
    //     'MERGE (u0:Person { vkId: {vkId0} }) ' +
    //     'MERGE (u1:Person { vkId: {vkId1} }) ' +
    //     (!direction ? 'MERGE (u1)-[r:' + relation + ']->(u0) ' : 'MERGE (u0)-[r:' + relation + ']->(u1) ') +
    //     cityRelString +
    //
    //     'SET u1.vkDomain = {vkId1Domain} ' +
    //     'SET u1.firstName = {vkId1FirstName} ' +
    //     'SET u1.lastName = {vkId1LastName} ' +
    //
    //     (uid1.deactivated ? 'SET u1:Deactivated ' : '') +
    //     (uid1.deactivated ? 'SET u1:' + uid1.deactivated + ' ' : '') +
    //
    //     'RETURN u1, u0, r',
    //     params: {
    //       vkId0: uid0,
    //       vkId1: uid1.id,
    //       vkId1Domain: uid1.domain,
    //       vkId1FirstName: uid1.first_name,
    //       vkId1LastName: uid1.last_name,
    //     }
    //   },
    //   function (err, res) {
    //   })

  });
};

//  =================================== start parameters ==============================================================
let startCount = 5;
let startDeepness = 3;
let globalList = [];

// let globalFriends = [151507691]; // SHST
let globalFriends = [39809];

// TODO array to file / from file
let globalChecked = {Friend: [], Follower: [], Followed: [], Subscript: [], Scanned: {}};
// cron.schedule('*/10 * * * * *', () => {
//
//   let data = globalList.pop();
//   if (!data) {
//     return
//   }
//   let uid0 = data.id0;
//   let uid1 = data.id1;
//   let relation = data.relation;
//   let direct = data.direct;
//   setRelationFriend(uid0, uid1, relation, direct);
//
//
// });
// cron.schedule('*/10 * * * * *', () => {
//   // console.log(globalToScan.sort());
//   // console.log(globalChecked.Friend.sort());
// });
// cron.schedule('*/1 * * * * *', () => {
//   // let oldLength = globalToScan.length;
//   // globalToScan = globalToScan.filter((v, i, a) => a.indexOf(v) === i);
//   // globalToScan = globalToScan.filter((v) => globalChecked['Friend'].indexOf(v.id) < 0 && globalChecked['Follower'].indexOf(v.id) < 0);
//   // let scanObj = globalToScan.length % 2 === 0 ? globalToScan.shift() : globalToScan.pop();
//   // if (!scanObj) {
//   //   return
//   // }
//   // getFriends(scanObj.id, scanObj.startCount, scanObj.deepness, scanObj.relation)
// });


globalFriends.map(function (item) {
  getFollowedList(item, startCount, 0)
    .then(res => getFollowersList(res.sourceVkId, startCount, 0, res))
    .then(res => getFriendsList(res.sourceVkId, startCount, 0, res))
    .then(res => setAllRelations(res))
    .then(res => console.log(res))
    .catch();
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
//MATCH (n:Person) where n.lastName =~ '(?i).*ilIpe.*' RETURN n LIMIT 25
//MATCH (n:Person) where n.firstName =~ '(?i).*aterinka.*' RETURN n LIMIT 25
//MATCH p=(n:Person)-[*..3]-(m:Person) where n.firstName =~ '(?i).*aterinka.*' and m.vkId=1047350 RETURN p limit 50
//MATCH (x:User), (y:User)  WHERE x.vkId=y.vkIid   RETURN x
/*
MATCH
p=(a {vkId:15970041})-[*2]-(b)
with
a,b,relationships(p) as r, count(relationships(p)) as rc, nodes(p) as n

RETURN
a,collect(distinct b), collect(distinct n),r,rc
limit 10
*/
