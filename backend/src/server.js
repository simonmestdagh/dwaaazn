//import { Tedis } from "tedis";
const { Tedis} = require('tedis');
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const {InfluxDB} = require('@influxdata/influxdb-client')


const tedis = new Tedis({
  port: 6379,
  host: process.env.REDIS_HOST || "127.0.0.1"
});

// You can generate an API token from the "API Tokens Tab" in the UI



const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World')
})

async function test() {
  const message = await tedis.blpop(0, 'temp-sensor-iot-app')
  return message[1]
}



app.get('/message', async (req, res) => {
  const message  = await test()
  console.log("werkt et?")
  console.log(message)
  res.status(200).send({"message": message})
})



const token = 'BLXJ9d4pxqNp6ePuPX3JYpYg5bivgsby8AxhfukvejmTSeCywnSwQ46rU88KGKx8LKrW78V3nmYZkMISy3rPYw=='
const org = 'org'
const bucket = 'buck'

app.get('/influx', (req, res) => {
  
  const client = new InfluxDB({url: 'http://influxdb:8086', token: token})
  const {Point} = require('@influxdata/influxdb-client')
  const writeApi = client.getWriteApi(org, bucket)
  writeApi.useDefaultTags({host: 'host1'})
  let rand = Math.random()*100
  const point = new Point('meme').floatField('BEEPBOP', rand)
  writeApi.writePoint(point)

  writeApi
    .close()
    .then(() => {
        console.log('FINISHED')
        res.send({"message": "Successful influx write"})
    })
    .catch(e => {
        console.error(e)
        console.log('Finished ERROR')
    })
})



app.listen(process.env.PORT, () => {
  console.log(`Express API running at : ${process.env.PORT}`)
})