import { Tedis } from "tedis";
import Sensor from "./fake-sensor"
import { argv } from "yargs"

const tedis = new Tedis({
  port: 6379,
  host: process.env.REDIS_HOST || "127.0.0.1"
});

const sensor = new Sensor();
const burstSize = argv.number || 100

const newMessage = async () => {
  const message = sensor.getMeasurement()
  console.log(`'${JSON.stringify(message)}'`)

  await tedis.rpush('temp-sensor-iot-app', `'${JSON.stringify(message)}'`)
    // .then( (result) => console.log(result))
    .catch( err => console.log(err));
}

console.log("*** PRODUCER ***")
if(argv.burst) { 
  (async () => {
    console.log('Starting in burst mode!')
    for(let i = 0;i < burstSize; i++) {
      await newMessage()
    }
    tedis.close()
  })()
} else {
  const interval = setInterval( () => {
    newMessage()
  }, 1000)
}

