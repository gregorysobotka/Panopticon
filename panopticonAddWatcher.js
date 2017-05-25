var MongoClient = require('mongodb').MongoClient;
var app = new (require('express'))();
var wt = require('webtask-tools');

module.exports = function(ctx, callback){

  var MLabUrl = ctx.data.MLabUrl;
  var postBody = ctx.body;

  if(typeof postBody === 'undefined' || !postBody.url || !postBody.statusCodes) 
    return callback({"required": "POST:body:url, POST:body:statusCodes"})

  var validStatusCodes = postBody.statusCodes
    .map((statusCode)=>parseInt(statusCode))
    .filter((statusCode)=>Number.isInteger(statusCode))
    .sort();

  var newWatcher = {
    url: postBody.url,
    statusCodes: validStatusCodes
  };

  MongoClient.connect(MLabUrl, function(err, db) {
    
    db
      .collection('watching')
      .insertOne(newWatcher);

    callback(null, {"added":newWatcher});

  });

}

