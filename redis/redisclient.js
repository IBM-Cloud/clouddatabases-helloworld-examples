
const redis = require("redis")
const config = require("./config.json");
const cert_b64 = config.redis_credentials.value["connection.cli.certificate.certificate_base64"]
const cert = Buffer.from(cert_b64, "base64").toString()
const uri= config.redis_credentials.value["connection.rediss.composed.0"]
//console.log(cert)
//console.log(uri)

module.exports = async function () {

  var opts = {
    url:uri,
    socket: {
      tls:true,
      ca:cert
    }
  }

  // create a connection to the database
  const redisClient = redis.createClient(opts)
  await redisClient.connect();

  console.log("Connected!")

  return redisClient
}