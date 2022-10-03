const { Client } = require('@elastic/elasticsearch')
const config = require("./config.json");
const password = config.password.value
const uri = config.url.value.replace('$PASSWORD', password)
const cert = Buffer.from(config.cert.value, "base64").toString()

process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'   //allow insecure connections.. ok for testing, not good for production!

module.exports = async function () {
  // create a connection to the database

  const opts = {
    node: uri,
    tls: {
      ca: cert
    }
  }

  const client = new Client(opts)
  console.log("Connected!")
  try {
    await client.indices.create({
      index: "words"
    })
    console.log("index created")
  } catch (e) {
    console.log("index exists")
  }

  return client
}