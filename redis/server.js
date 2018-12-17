/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";
/* jshint node:true */

// Add the express web framework
const express = require("express");
const { URL } = require("url");
const app = express();

// Use body-parser to handle the PUT data
const bodyParser = require("body-parser");
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

// Util is handy to have around, so thats why that's here.
const util = require('util')

// and so is assert
const assert = require('assert');

// We want to extract the port to publish our app on
let port = process.env.PORT || 8080;

// Then we'll pull in the database client library
const redis = require("redis");

// Now lets get cfenv and ask it to parse the environment variable
let cfenv = require('cfenv');

// load local VCAP configuration  and service credentials
let vcapLocal;
try {
  vcapLocal = require('./vcap-local.json');
  console.log("Loaded local VCAP");
} catch (e) { 
    // console.log(e)
}

const appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}
const appEnv = cfenv.getAppEnv(appEnvOpts);

// Within the application environment (appenv) there's a services object
let services = appEnv.services;

// The services object is a map named by service so we extract the one for Redis
let redis_services = services["databases-for-redis"];

// This check ensures there is a services for Redis databases
assert(!util.isUndefined(redis_services), "Must be bound to databases-for-redis services");

// We now take the first bound Redis service and extract it's credentials object
let credentials = redis_services[0].credentials;

let redisconn = credentials.connection.rediss;

let connectionString = redisconn.composed[0];

let caCert = new Buffer.from(redisconn.certificate.certificate_base64, 'base64').toString();

let client = redis.createClient(connectionString, {
        tls: { ca: caCert, servername: new URL(connectionString).hostname }
});
 

client.on("error", function(err) {
    console.log("Error " + err);
});

// Add a word to the database
function addWord(word, definition) {
    return new Promise(function(resolve, reject) {
        // use the connection to add the word and definition entered by the user
        client.hset("words", word, definition, function(
            error,
            result
        ) {
            if (error) {
                reject(error);
            } else {
                resolve("success");
            }
        });
    });
}

// Get words from the database
function getWords() {
    return new Promise(function(resolve, reject) {
        // use the connection to return us all the documents in the words hash.
        client.hgetall("words", function(err, resp) {
            if (err) {
                reject(err);
            } else {
                resolve(resp);
            }
        });
    });
}

// We can now set up our web server. First up we set it to server static pages
app.use(express.static(__dirname + "/public"));

// The user has clicked submit to add a word and definition to the hash
// Send the data to the addWord function and send a response if successful
app.put("/words", function(request, response) {
    addWord(request.body.word, request.body.definition)
        .then(function(resp) {
            response.send(resp);
        })
        .catch(function(err) {
            console.log(err);
            response.status(500).send(err);
        });
});

// Read from the hash when the page is loaded or after a word is successfully added
// Use the getWords function to get a list of words and definitions from the hash
app.get("/words", function(request, response) {
    getWords()
        .then(function(words) {
            response.send(words);
        })
        .catch(function(err) {
            console.log(err);
            response.status(500).send(err);
        });
});

// Listen for a connection.
app.listen(port, function() {
    console.log("Server is listening on port " + port);
});