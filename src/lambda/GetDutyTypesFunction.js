var AWS = require('aws-sdk');

var ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

exports.handler = function (event, context, callback) {
    var params = {
        TableName: process.env.tableName
    }
    
    ddb.scan(params, function(err, data) {
        if (err) {
            callback("Error: " + err);
        } else {
            callback(null, data);
        }
    });
};