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

    return "OK";
}

var deleteDuty = function(user, date, dutyType, callback) {
    var dutyId = user + "-" + date + "-" + dutyType;
    console.log("Id for new duty type is " + dutyId);

    var params = {
        TableName: 'duties-dev',
        Key: {
            'id' : {S: dutyId}
        }
    }
    
    ddb.deleteItem(params, function(err, data) {
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
    console.log("Deleting duty");
    
    var user = null;
    var dutyType = null;
    var date = null;
    
    console.log("Query string parameters: " + JSON.stringify(event.queryStringParameters));
    if (event.queryStringParameters && event.queryStringParameters.user && event.queryStringParameters.user !== "") {
        user = event.queryStringParameters.user;
    }
    if (event.queryStringParameters && event.queryStringParameters.dutyType && event.queryStringParameters.dutyType !== "") {
        dutyType = event.queryStringParameters.dutyType;
    }
    if (event.queryStringParameters && event.queryStringParameters.date && event.queryStringParameters.date !== "") {
        date = event.queryStringParameters.date;
    }
        
    var inputValidationResult = validateInputData(user, date, dutyType);
    if (inputValidationResult != "OK") {
        callback(null, buildLambdaProxyIntegrationResponse(400, inputValidationResult));
        return;
    }

    deleteDuty(user, date, dutyType, callback);
};