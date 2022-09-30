const mysql = require('mysql2/promise')

const config = require("./config.json");
const password = config.password.value
const user = config.user.value
const host = config.host.value
const port = parseInt(config.port.value)
const cert = Buffer.from(config.cert.value, "base64").toString()
const uri = config.url.value
const database = uri.match(/\/([a-z]+)\?/)[1]
//console.log(cert)

module.exports = async function () {
  const opts = {
    host,
    database,
    user, 
    password, 
    port, 
    ssl  : {
      ca : cert

    }
  }

 const client =  await mysql.createConnection(opts);

 console.log("Connected!")

  //Now create a table for the words

  const query = 'CREATE TABLE IF NOT EXISTS words (_id SERIAL PRIMARY KEY, word varchar(255), definition varchar(255))'

 const result = await client.query(query)
  

  return client
}