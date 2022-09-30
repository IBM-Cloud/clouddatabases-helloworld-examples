const fs = require("fs")
const mongodb = require("mongodb")
const { MongoClient } = mongodb

const config = require("./config.json");
const password = config.password.value
const uri = config.url.value.replace('$PASSWORD', password)
const cert = Buffer.from(config.cert.value, "base64").toString()
const CERT_FILE = "mongo.cert"
fs.writeFileSync(CERT_FILE, cert)


module.exports = async function () {

  // create a connection to the database
  const opts = {
    tls: true,
    tlsCAFile: CERT_FILE,
    useUnifiedTopology: true,
    useNewUrlParser: true
  }
  const client = new MongoClient(uri, opts)
  await client.connect()

  console.log("Connected!")

  return client
}