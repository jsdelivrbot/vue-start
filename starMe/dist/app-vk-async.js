const VK = require('vksdk');
let vk = new VK({
  'appId': 5227310,
  'appSecret': 'W1gKOVIOX0ssJt8OZRHN',
  'language': 'ru'
});
vk.setSecureRequests(false);

let friendsSearch = async () => {

  let getRelationsList = function (relation, sourceVkId, startResult) {
    let request = {};
    let parameters = {};
    let result = startResult || {
      deep: 1,
      sourceVkId,
      listTargetsVkId: [],
      listRelations: [],
      errors: [],
      checked: startResult.checked || [],
      maxDeep: startResult.maxDeep || 2,
      maxCount: startResult.maxCount || 1
    };
    // request config
    switch (relation) {
      case 'Friend': {
        request = {rel: 'Friend', req: 'friends.get', direction: true};
        parameters = {'order': 'mobile', 'user_id': sourceVkId, count: startResult.count, 'fields': 'id'};
        break;
      }
      case 'Follower': {
        request = {rel: 'Follower', req: 'users.getFollowers', direction: false};
        parameters = {'order': 'mobile', 'user_id': sourceVkId, count: startResult.count, 'fields': 'id'};
        break;
      }
      case 'Followed': {
        request = {rel: 'Follower', req: 'users.getSubscriptions', direction: true};
        parameters = {
          'order': 'mobile',
          'user_id': sourceVkId,
          count: startResult.count,
          'fields': 'id',
          'extended': 0
        };
        break;
      }
      default:
        return;
    }
    let myEvent = sourceVkId + '_' + request.rel + '_' + request.req;
    return new Promise((resolve, reject) => {
      // request reaction
      vk.on(myEvent, _o => {
        if ((_o.response && _o.response.items) || (_o.response && _o.response.users.items )) {
          let pushToRes = function (item) {
            result.listTargetsVkId.push(item.id || item);
            request.direction ?
              result.listRelations.push({source: sourceVkId, target: item.id || item, relation: request.rel}) :
              result.listRelations.push({target: sourceVkId, source: item.id || item, relation: request.rel})
          };

          _o.response.items = _o.response.items ?
            _o.response.items.splice(0, count) :
            _o.response.items;

          _o.response.users =
            _o.response.users ||
            {};

          _o.response.users.items =
            _o.response.users && _o.response.users.items ?
              _o.response.users.items.splice(0, count) :
              _o.response.users.items;

          _o.response.items ?
            _o.response.items.map(pushToRes) :
            _o.response.users.items ?
              _o.response.users.items.map(pushToRes) :
              null;

        } else {
          result.errors.push(myEvent + ':' + _o.error.error_msg || 'unknown error');
        }
        resolve(result)

      });

      vk.request(request.req, parameters, myEvent);
    });
  };

  let getRelationsListByDeep = async (startResult) => {
    startResult = startResult || {
      listTargetsVkId: [1047350, 1097350],
      listRelations: [],
      errors: [],
      checked: startResult.checked || [],
      maxDeep: startResult.maxDeep || 2,
      maxCount: startResult.maxCount || 1
    };

    let deep;
    let vkItemId;
    let myRels = ['Friend', 'Follower', 'Followed'];

    while (deep = startResult.maxDeep--) {
      let roundLength = startResult.listTargetsVkId.length + 1;
      console.log('deep =', startResult.maxDeep);
      while ((vkItemId = startResult.listTargetsVkId.pop()) && (roundLength--)) {
        if (startResult.checked.indexOf(vkItemId) === -1) {
          console.log('id =', vkItemId, startResult.listTargetsVkId.length);
          for (let i in myRels) {
            startResult = await getRelationsList(myRels[i], vkItemId, startResult)
          }
          startResult.checked.push(vkItemId);
          startResult.listTargetsVkId = startResult.listTargetsVkId.filter((v, i, a) => a.indexOf(v) === i);
        } else {
          // startResult.maxDeep++
        }
      }
    }



    console.log(startResult);
  };

  let myRes = await getRelationsListByDeep();
  console.log(myRes);


  // console.log(myRes);
};


friendsSearch()
