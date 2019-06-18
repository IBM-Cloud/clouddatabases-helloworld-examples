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
const app = express();

// Then we'll pull in the message queue client library
// Rabbitmq uses AMQP as a protocol, so this is a generic library for the protocol
const amqp = require("amqplib");

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

// The services object is a map named by service so we extract the one for RabbitMQ
let rabbit_services = services["messages-for-rabbitmq"];

// This check ensures there is a services for RabbitMQ
assert(!util.isUndefined(rabbit_services), "Must be bound to messages-for-rabbitmq services");

// We now take the first bound RabbitMQ service and extract it's credentials object
let rabbitConn = rabbit_services[0].credentials.connection.amqps;
let caCert = Buffer.from(rabbitConn.certificate.certificate_base64, 'base64');
let connectionString = rabbitConn.composed[0];

// Create auth credentials
let open = amqp.connect(connectionString, { ca: [caCert] });

let routingKey = "words";
let exchangeName = "ibmclouddb";
let qName = "sample";

open
  .then(conn => {
    return conn.createChannel();
  })
  .then(ch => {
    // Bind a queue to the exchange to listen for messages
    // When we publish a message, it will be sent to this queue, via the exchange
    return ch
      .assertExchange(exchangeName, "direct", { durable: true })
      .then(() => {
        return ch.assertQueue(qName, { exclusive: false });
      })
      .then(q => {
        return ch.bindQueue(q.queue, exchangeName, routingKey);
      });
  })
  .catch(err => {
    console.err(err);
    process.exit(1);
});

// Add a word to the message queue
function addMessage(message) {
    return open
        .then(conn => {
            return conn.createChannel();
        })
        .then(ch => {
            ch.publish(exchangeName, routingKey, Buffer(message));
            let msgTxt = message + " : Message sent at " + new Date();
            console.log(" [+] %s", msgTxt);
            return new Promise(resolve => {
                resolve(message);
            });
        });
}

// Get words from the message queue
function getMessage() {
    return open
        .then(conn => {
            return conn.createChannel();
        })
        .then(ch => {
        return ch.get(qName, {}).then(msgOrFalse => {
            return new Promise(resolve => {
                let result = "No messages in queue";
                if (msgOrFalse !== false) {
                    result = msgOrFalse.content.toString() + " : Message received at " + new Date();
                    ch.ack(msgOrFalse);
                }
                console.log(" [-] %s", result);
                resolve(result);
            });
        });
    });
}


// We can now set up our web server. First up we set it to serve static pages
app.use(express.static(__dirname + "/public"));

// The user has clicked submit to add a word and definition to the message queue
// Send the data to the addWord function and send a response if successful
app.put("/message", function(request, response) {
    addMessage(request.body.message)
        .then(function(resp) {
            response.send(resp);
        })
        .catch(function(err) {
            console.log(err);
            response.status(500).send(err);
        });
});

// Read from the message queue when the page is loaded or after a word is successfully added
// Use the getWords function to get a list of words and definitions from the message queue
app.get("/message", function(request, response) {
    getMessage()
        .then(function(messages) {
            response.send(messages);
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
