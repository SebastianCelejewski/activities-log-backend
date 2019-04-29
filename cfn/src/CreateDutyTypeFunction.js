var AWS = require('aws-sdk');
var uuid = require('uuid/v1');

AWS.config.update({region: 'eu-central-1'});

var ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

var checkIfDutyTypeNameIsProvided = function(dutyTypeName) {
    if (dutyTypeName == undefined) {
        return ("Error: Parameter dutyType is not provided");
    } else {
        return "OK";
    }
}

var createNewDutyType = function(dutyTypeName, callback) {
    console.log("Creating new duty type " + dutyTypeName);    
    var dutyId = uuid();
    console.log("Id for new duty type is " + dutyId);

    var params = {
        TableName: "duty-types-dev",
        Item: {
            'id' : {S: dutyId},
            'type' : {S: dutyTypeName}
        }
    }
    
    ddb.putItem(params, function(err, data) {
        if (err) {
            console.log("Error");
            console.log(err);
            callback("Error: " + err);
        } else {
            console.log("Success");
            callback(null, "Success!");
        }
    });
}

console.log("Connecting to DynamoDB now!");

exports.handler = function (event, context, callback) {
    console.log("Inside the handler");
    
    var dutyTypeName = event.dutyType;
    
    var dutyTypeNameValidationResult = checkIfDutyTypeNameIsProvided(dutyTypeName);
    if (dutyTypeNameValidationResult != "OK") {
        callback(dutyTypeNameValidationResult);
    }
    
    createNewDutyType(dutyTypeName, callback);
};