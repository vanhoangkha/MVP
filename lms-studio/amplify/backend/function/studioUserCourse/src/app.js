/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const AWS = require('aws-sdk')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
const express = require('express')

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "UserCourse";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const userIdPresent = true; // TODO: update in case is required to use that definition
const partitionKeyName = "UserID";
const partitionKeyType = "S";
const sortKeyName = "CourseID";
const sortKeyType = "S";
const courseIndex = "Courses-index";
const paritionKeyNameIndex = "CourseID" 
const hasSortKey = sortKeyName !== "";
const path = "/usercourse";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const hashKeyIndexPath = '/:' + paritionKeyNameIndex;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

// /********************************
//  * HTTP Get method for list objects *
//  ********************************/

app.get(path, function(req, res) {
  const condition = {}
  condition[partitionKeyName] = {
    ComparisonOperator: 'EQ'
  }
  condition[partitionKeyName]['AttributeValueList'] = [req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH ];
  // if (userIdPresent && req.apiGateway) {
  //   condition[partitionKeyName]['AttributeValueList'] = [req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH ];
  // } else {
  //   try {
  //     condition[partitionKeyName]['AttributeValueList'] = [ convertUrlType(req.params[partitionKeyName], partitionKeyType) ];
  //   } catch(err) {
  //     res.statusCode = 500;
  //     res.json({error: 'Wrong column type ' + err});
  //   }
  // }
  
  console.log(condition)

  let queryParams = {
    TableName: tableName,
    KeyConditions: condition,
    // IndexName:"CreatorID-index"
  }

  dynamodb.query(queryParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({error: 'Could not load items: ' + err});
    } else {
      res.json(data.Items);
    }
  });
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + sortKeyPath, function(req, res) {
  const params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
    console.log(params[partitionKeyName]);
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let getItemParams = {
    TableName: tableName,
    Key: params
  }
  console.log(getItemParams)

  dynamodb.get(getItemParams,(err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: 'Could not load items: ' + err.message});
    } else {
      let response;
      console.log(data)
      if (data.Item) {
        response = data.Item;
      } else {
        response = data;
      }
      let putItemParams = {
        TableName: tableName,
        Item: response
      }
      res.json(response);
    }
  });
});

app.get(path + "/assigned" + hashKeyIndexPath, function(req, res) {
  const condition = {}
  condition[paritionKeyNameIndex] = {
    ComparisonOperator: 'EQ'
  }
  condition[paritionKeyNameIndex]['AttributeValueList'] = [req.params[paritionKeyNameIndex]];
  // try {
  //   condition[paritionKeyNameIndex]['AttributeValueList'] = convertUrlType(req.params[paritionKeyNameIndex], "S");
  // } catch(err) {
  //   res.statusCode = 500;
  //   res.json({error: 'Wrong column type ' + err});
  // }

  let queryParams = {
    TableName: tableName,
    IndexName: courseIndex,
    KeyConditions: condition
  }

  dynamodb.query(queryParams,(err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: 'Could not load items: ' + err.message});
    } else {
      res.json(data.Items);
    }
  })
})

// /************************************
// * HTTP put method for insert object *
// *************************************/

app.put(path, function(req, res) {
  console.log(req.body)
  // if (userIdPresent) {
  //   req.body['CreatorID'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  // }
  let promises = req.body.map((item) => {
    let putItemParams = {
    TableName: tableName,
    Item: item,
    ReturnValues: "ALL_OLD"

  }
  return dynamodb.put(putItemParams).promise().then((err, data) => {
    if (err) {
      return err
    } else{
      return data
    }
  })
  })
  
  Promise.all(promises).then(function(results) {
    console.log(results)
    res.json({results})
})
});
// /************************************
// * HTTP post method for insert object *
// *************************************/

// app.post(path, function(req, res) {

//   if (userIdPresent) {
//     req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
//   }

//   let putItemParams = {
//     TableName: tableName,
//     Item: req.body
//   }
//   dynamodb.put(putItemParams, (err, data) => {
//     if (err) {
//       res.statusCode = 500;
//       res.json({error: err, url: req.url, body: req.body});
//     } else {
//       res.json({success: 'post call succeed!', url: req.url, data: data})
//     }
//   });
// });

// /**************************************
// * HTTP remove method to delete object *
// ***************************************/

app.delete(path, function(req, res) {
  let promises = req.body.map((item) => {
    const params = {};
    params[partitionKeyName] = item[partitionKeyName];
    params[sortKeyName] = item[sortKeyName];

    let removeItemParams = {
      TableName: tableName,
      Key: params
    }
    
    console.log(removeItemParams)
    return dynamodb.delete(removeItemParams).promise().then((err, data) => {
      if (err) {
        console.log(err)
        return err
      } else{
        return data
      }
    })
  })

  Promise.all(promises).then(function(results) {
    console.log(results)
    res.json({results})
  })
});

app.listen(3000, function() {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
