import { Console } from "console";
import { Tedis } from "tedis";
import { argv } from "yargs"

const tedis = new Tedis({
  port: 6379,
  host: process.env.REDIS_HOST || "127.0.0.1"
});

const interval = setInterval(() => {
    tedis.lrange('temp-sensor-iot-app', 0, -1)
    .then(list => console.log(`Messages in queue: ${list.length}`))
}, 1000)