'use strict';

var MongoClient = require('mongodb').MongoClient;
var https = require('https');

module.exports = function(ctx, callback){

  const statusChecks = [];
  var checkCount = 0;
  var MLabUrl = ctx.data.MLabUrl;
  
  MongoClient.connect(MLabUrl, function(err, db) {
    
    db
      .collection('watching')
      .find({})
      .toArray(function(err, docs) {

        if(docs.length === 0) return callback(null, {status: statusChecks});

        docs.map(function(requestContext){

          https.get(requestContext.url, (res) => {

              let acceptedStatusCodes = new Set(requestContext.statusCodes);
              let statusCode = res.statusCode;

              // On each respose from https.get increment count of handled responses. 

              checkCount = checkCount + 1;

              statusChecks.push({
                status: acceptedStatusCodes.has(statusCode) ? "SUCCESS" : "FAILURE",
                url: requestContext.url,
                statusCode: statusCode,
                expected: requestContext.statusCodes
              });

              // Once # of handled responses matches total number expected, return all status.
              if(checkCount === docs.length) callback(null, {status: statusChecks});

          });

        });

    })

  });

};