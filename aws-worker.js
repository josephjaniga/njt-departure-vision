"use strict";

var AWS = require('aws-sdk'),
    sns = new AWS.SNS({apiVersion: '2010-03-31'});

//console.log( process.env.AWS_ACCESS_KEY_ID );
//console.log( process.env.AWS_SECRET_ACCESS_KEY );
//console.log( process.env.AWS_REGION );

//new AWS.EC2().describeInstances(function(error, data) {
//    if (error) {
//        console.log(error); // an error occurred
//    } else {
//        console.log(data); // request succeeded
//    }
//});
//
//sns.getTopicAttributes(params, function(err, data) {
//    if (err) console.log(err, err.stack); // an error occurred
//    else     console.log(data);           // successful response
//});


function publish(message, topic){

    var params = {
        Message: message,
        Subject: "Sample Push Notification " + Date.now(),
        TopicArn: topic
    };

    sns.publish(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });

}

publish(
    Date.now() + " Heroku triggered / email push notification",
    'arn:aws:sns:us-east-1:328248311919:NJT_RAIL_3821'
);

setInterval(function(){

}, 5000);