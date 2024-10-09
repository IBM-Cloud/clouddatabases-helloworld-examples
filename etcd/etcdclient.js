const { Etcd3 } = require('etcd3');
const config = require("./config.json");
const password =config.password.value /// "a6a2912ad68696462014f808df910e829929a9ba798f25b61d43504be7b58586"
const user = config.user.value //"ibm_cloud_6322a7b2_e944_47c8_91fc_56c1954d4f3f" 
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
  console.log("opts is", opts)
  const client = new Etcd3(opts).namespace("/ibmclouddb/words/");
  console.log("Connected!")

  return client
}