var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});

var ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

var validateInputData = function(user, date, dutyType, status) {
    console.log("Validating input data");
    if (!user) {
        console.log("Input data is not valid. Parameter 'user' is not provided");
        return ("Error: Parameter 'user' is not provided");
    } 

    console.log("Input data is valid");
    return "OK";
}

var mapDynamoDbResultToJson = function(dynamoDbResult) {
    return dynamoDbResult.Items
        .map(function(x) {
           return { 
               "user": x.user.S,
               "date": x.date.S,
               "dutyType": x.dutyType.S,
               "status": x.status.BOOL
           } 
        });
}

var buildLambdaProxyIntegrationResponse = function(data) {
    return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: {"Access-Control-Allow-Origin":"*", "Access-Control-Allow-Credentials": true },
        body: JSON.stringify(data)
    }
}

var buildLambdaProxyIntegrationErrorResponse = function(errorMessage) {
    console.log("Builiding HTTP 400 error response for error message " + errorMessage);
    return {
        isBase64Encoded: false,
        statusCode: 400,
        headers: {"Access-Control-Allow-Origin":"*", "Access-Control-Allow-Credentials": true },
        body: JSON.stringify(errorMessage)
    }
}

exports.handler = function (event, context, callback) {
    console.log("Handler starts");
    var user = undefined;
    
    console.log("Reading user name from query string");
    console.log("Query string parameters: " + JSON.stringify(event.queryStringParameters));
    if (event.queryStringParameters 
        && event.queryStringParameters.user 
        && event.queryStringParameters.user !== "") {
            user = event.queryStringParameters.user;
        }
    console.log("User name is " + user);

    var inputValidationResult = validateInputData(user);
    if (inputValidationResult != "OK") {
        console.log("Returning error message");
        callback(null, buildLambdaProxyIntegrationErrorResponse(inputValidationResult));
        return;
    }
    
    var params = {
        TableName: "duties-dev",
        FilterExpression: "#u = :val",
        ExpressionAttributeNames: { "#u" : "user"},
        ExpressionAttributeValues: { ":val" : {"S": user}}
    }
    
    ddb.scan(params, function(err, data) {
        if (err) {
            callback(null, buildLambdaProxyIntegrationErrorResponse("Error: " + err));
        } else {
            callback(null, buildLambdaProxyIntegrationResponse(mapDynamoDbResultToJson(data)));
        }
    });
};