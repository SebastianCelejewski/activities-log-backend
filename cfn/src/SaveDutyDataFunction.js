var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});

var ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

var validateInputData = function(user, date, dutyType, status) {
    if (!user) {
        return ("Error: Parameter 'user' is not provided");
    } 

    if (!date) {
        return ("Error: Parameter 'date' is not provided");
    }
    
    if (!dutyType) {
        return ("Error: Parameter 'dutyType' is not provided");
    }
    
    if (status === undefined) {
        return ("Error: Parameter 'status' is not provided");
    }

    return "OK";
}

var checkIfDutyTypeIsValid = function(dutyType, onValid, onInvalid, onError) {
    var params = {
        TableName: "duty-types-dev",
        FilterExpression: "#t = :val",
        ExpressionAttributeNames: { "#t" : "type"},
        ExpressionAttributeValues: { ":val" : {"S": dutyType}}
    }
    
    ddb.scan(params, function(err, data) {
        if (err) {
            onError("Error: " + err);
        } else {
            console.log("Data: " + JSON.stringify(data));
            if (data.Items.length == 1) {
                onValid();
            } else {
                onInvalid();
            }
        }
    });
    
}

var createNewDutyType = function(user, date, dutyType, status, callback) {
    var dutyId = user + "-" + date + "-" + dutyType;
    console.log("Id for new duty type is " + dutyId);

    var params = {
        TableName: 'duties-dev',
        Item: {
            'id' : {S: dutyId},
            'user' : {S: user},
            'date' : {S: date},
            'dutyType' : {S: dutyType},
            'status' : {BOOL: status}
        }
    }
    
    ddb.putItem(params, function(err, data) {
        if (err) {
            console.log("Error");
            console.log(err);
            callback(null, buildLambdaProxyIntegrationResponse(400, "Error: " + err));
        } else {
            console.log("Success");
            callback(null, buildLambdaProxyIntegrationResponse(200, "Success!"));
        }
    });
}

var buildLambdaProxyIntegrationResponse = function(status, data) {
    return {
        isBase64Encoded: false,
        statusCode: status,
        headers: {"Access-Control-Allow-Origin":"*", "Access-Control-Allow-Credentials": true, "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token" },
        body: JSON.stringify(data)
    }
}

exports.handler = function (event, context, callback) {
    console.log("Setting value for duty");
    
    console.log("Body: " + event.body);
    var body = JSON.parse(event.body);
    
    var user = body.user;
    var date = body.date;
    var dutyType = body.dutyType;
    var status = body.status;
    
    var inputValidationResult = validateInputData(user, date, dutyType, status);
    if (inputValidationResult != "OK") {
        callback(null, buildLambdaProxyIntegrationResponse(400, inputValidationResult));
        return;
    }

    checkIfDutyTypeIsValid(dutyType, 
        function() {
            console.log("DutyType is valid. Adding new entry");
            createNewDutyType(user, date, dutyType, status, callback);
        },
        function () {
            console.log("DutyType is invalid. Returning error");
            callback(null, buildLambdaProxyIntegrationResponse(200, "Error: Duty type '" + dutyType + " does not exist"));
        },
        function(errorMessage) {
            console.log("Error ocurred: " + errorMessage);
            callback(null, buildLambdaProxyIntegrationResponse(200, "Error: " + errorMessage));
        }
    )  
};