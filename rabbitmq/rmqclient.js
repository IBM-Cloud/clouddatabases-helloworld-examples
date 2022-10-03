const amqplib = require('amqplib');
const config = require("./config.json");
const password = config.password.value
const uri = config.url.value.replace('$PASSWORD', password)
const cert = Buffer.from(config.cert.value, "base64").toString()
//console.log(cert)

module.exports = async function () {

  const routingKey = "words";
  const exchangeName = "ibmclouddb";
  const  qName = "sample";

  // open connection
  const conn = await amqplib.connect(uri, { ca: [cert] });

  //create channel
  const ch = await conn.createChannel()

  await ch.assertExchange(exchangeName, "direct", { durable: true })
  const q = await ch.assertQueue(qName, { exclusive: false });
  await ch.bindQueue(q.queue, exchangeName, routingKey);


  console.log("Connected!")

  return ch
}