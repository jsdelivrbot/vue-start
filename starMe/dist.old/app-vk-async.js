const VK = require('vksdk');
let vk = new VK({
  'appId': 5227310,
  'appSecret': 'W1gKOVIOX0ssJt8OZRHN',
  'language': 'ru'
});
vk.setSecureRequests(false);

let friendsSearch = async () => {

  let getFriendsList = function getFriendsList(sourceVkId, count, deep, startResult) {
    let request = {rel: 'Friend', req: 'friends.get', direction: true};
    let parameters = {'order': 'mobile', 'user_id': sourceVkId, 'count': count, 'fields': 'id'};
    let myEvent = sourceVkId + '_' + request.rel + '_' + request.req;
    let result = startResult || {sourceVkId, deep, listTargetsVkId: [], listRelations: []};

    return new Promise((resolve, reject) => {
      vk.on(
        myEvent, _o => {
          if ((_o.response && _o.response.items) || (_o.response && _o.response.users.items )) {

            if (_o.response.items) {
              _o.response.items.map(item => {
                result.listTargetsVkId.push(item.id);
                request.direction ?
                  result.listRelations.push({source: sourceVkId, target: item.id || item, relation: request.rel}) :
                  result.listRelations.push({target: sourceVkId, source: item.id || item, relation: request.rel})
              })
            } else if (_o.response.users.items) {
              _o.response.users.items.map(item => {
                result.listTargetsVkId.push(item.id || item);
                request.direction ?
                  result.listRelations.push({source: sourceVkId, target: item.id || item, relation: request.rel}) :
                  result.listRelations.push({target: sourceVkId, source: item.id || item, relation: request.rel})
              })
            }
            // console.log(result);
            resolve(result)
          } else {
            result.error = myEvent + ':' + _o.error.error_msg;
            reject(result)
            // console.error(result);
          }
        });
      vk.request(request.req, parameters, myEvent);
    });

  };
  let getFollowersList = function getFriendsList(sourceVkId, count, deep, startResult) {
    let request = {rel: 'Follower', req: 'users.getFollowers', direction: false};
    let parameters = {'order': 'mobile', 'user_id': sourceVkId, 'count': count, 'fields': 'id'};
    let myEvent = sourceVkId + '_' + request.rel + '_' + request.req;
    let result = startResult || {sourceVkId, deep, listTargetsVkId: [], listRelations: []};

    return new Promise((resolve, reject) => {
      vk.on(
        myEvent, _o => {
          if ((_o.response && _o.response.items) || (_o.response && _o.response.users.items )) {

            if (_o.response.items) {
              _o.response.items.map(item => {
                result.listTargetsVkId.push(item.id);
                request.direction ?
                  result.listRelations.push({source: sourceVkId, target: item.id || item, relation: request.rel}) :
                  result.listRelations.push({target: sourceVkId, source: item.id || item, relation: request.rel})
              })
            } else if (_o.response.users.items) {
              _o.response.users.items.map(item => {
                result.listTargetsVkId.push(item.id || item);
                request.direction ?
                  result.listRelations.push({source: sourceVkId, target: item.id || item, relation: request.rel}) :
                  result.listRelations.push({target: sourceVkId, source: item.id || item, relation: request.rel})
              })
            }
            // console.log(result);
            resolve(result)
          } else {
            result.error = myEvent + ':' + _o.error.error_msg;
            reject(result)
            // console.error(result);
          }
        });
      vk.request(request.req, parameters, myEvent);
    });

  };
  let getFollowedList = function getFriendsList(sourceVkId, count, deep, startResult) {
    let request = {rel: 'Follower', req: 'users.getSubscriptions'};
    let parameters = {'order': 'mobile', 'user_id': sourceVkId, 'count': count, 'fields': 'id', 'extended': 0};
    let myEvent = sourceVkId + '_' + request.rel + '_' + request.req;
    let result = startResult || {sourceVkId, deep, listTargetsVkId: [], listRelations: []};

    return new Promise((resolve, reject) => {
      vk.on(
        myEvent, _o => {
          if ((_o.response && _o.response.items) || (_o.response && _o.response.users.items )) {

            if (_o.response.items) {
              _o.response.items.map(item => {
                result.listTargetsVkId.push(item.id);
                request.direction ?
                  result.listRelations.push({source: sourceVkId, target: item.id || item, relation: request.rel}) :
                  result.listRelations.push({target: sourceVkId, source: item.id || item, relation: request.rel})
              })
            } else if (_o.response.users.items) {
              _o.response.users.items.map(item => {
                result.listTargetsVkId.push(item.id || item);
                request.direction ?
                  result.listRelations.push({source: sourceVkId, target: item.id || item, relation: request.rel}) :
                  result.listRelations.push({target: sourceVkId, source: item.id || item, relation: request.rel})
              })
            }
            // console.log(result);
            resolve(result)
          } else {
            result.error = myEvent + ':' + _o.error.error_msg;
            reject(result)
            // console.error(result);
          }
        });
      vk.request(request.req, parameters, myEvent);
    });

  };


  let myId = 1740350;
  console.log('-----getFriendsList-------------');
  console.log(await getFriendsList(myId, 3, 1));
  console.log('--------------------------------');

  console.log('-----getFollowersList-----------');
  console.log(await getFollowersList(myId, 3, 1));
  console.log('--------------------------------');

  console.log('-----getFollowedList------------');
  console.log(await getFollowedList(myId, 3, 1));
  console.log('--------------------------------');


};


friendsSearch()
