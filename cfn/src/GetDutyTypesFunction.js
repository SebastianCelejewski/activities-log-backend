var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

exports.handler = function (event, context, callback) {
    var params = {
        TableName: "duty-types-dev"
    }
    
    ddb.scan(params, function(err, data) {
        if (err) {
            callback("Error: " + err);
        } else {
            callback(null, data);
        }
    });
};