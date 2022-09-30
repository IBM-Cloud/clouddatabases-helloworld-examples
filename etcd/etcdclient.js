const { Etcd3 } = require('etcd3');
const config = require("./config.json");
const password = config.password.value
const user = config.user.value
const host = config.host.value
const port = config.port.value
const cert = Buffer.from(config.cert.value, "base64")
//console.log(cert)

module.exports = async function () {

  // Create auth credentials
  let opts = {
    hosts: [`https://${host}:${port}`],
    auth: {
      username: user,
      password: password
    },
    credentials: {
      rootCertificate: cert
    }
  };

  const client = new Etcd3(opts).namespace("/ibmclouddb/words/");
  console.log("Connected!")

  return client
}