const { Client } = require('pg')

const config = require("./config.json");
const password = config.password.value
const uri = config.url.value.replace('$PASSWORD', password) //.replace(/\?sslmode.+$/,'')
const cert = Buffer.from(config.cert.value, "base64").toString()
console.log(cert)

module.exports = async function () {

  const client = new Client({ 
    connectionString: uri,
    ssl: {
      ca: cert,
      rejectUnauthorized: true
    }
  })

  await client.connect()

  console.log("Connected!")

  //Now create a table for the words

  const query = 'CREATE TABLE IF NOT EXISTS words (_id SERIAL PRIMARY KEY, word varchar(255), definition varchar(255))'

  await client.query(query)
  
  console.log("table created")

  return client
}