//Init of dotenv for use with .env file
require("dotenv").config();

//Dependencies import
const ping = require("ping")
const speedTest = require("speedtest-net")
const Influx = require('influx')

//Local Dependencies
const database = require("./database.js");
const Ping = require("./models/Ping.js");
const Speedtest = require("./models/Speedtest.js");

//Variable Initialize
const mongoURL = process.env.MONGOURL || "mongodb://localhost:27017/";

//Influxdb init
const influx = new Influx.InfluxDB({

    host: 'localhost',
    database: 'network_monitor',
    username: 'test_username',
    password: 'test_password',
    schema: [
      {
        measurement: 'ping',
        fields: { pingTime: Influx.FieldType.FLOAT },
        tags: ['unit']
      }
    ]
  });

  influx.getDatabaseNames()
  .then(names => {
    if (!names.includes('network_monitor')) {
      return influx.createDatabase('network_monitor');
    }
  })
  .catch(error => console.log({ error }));

//Connect to Mongo
//database.connect("GrafanaPing", mongoURL);

let speedTestConfig = {
    acceptLicense: true,
    acceptGdpr: true
}

//setInterval(newSpeedTest, 1800000)

setInterval(async () => {
    let pingVar = await ping.promise.probe("speedtest.net")
    console.log(pingVar.time);
    influx.writePoints([
        {
          measurement: 'ping',
          tags: {
            unit: "ms",
          },
          fields: { pingTime: pingVar.time },
          timestamp: Date.now(),
        }
      ], {
        database: 'network_monitor',
        precision: 'n',
      })
      .catch(error => {
        console.error(`Error saving data to InfluxDB! ${err.stack}`)
      });
}, 2000)

async function newSpeedTest() {
    console.log("Started speedtest")
    let testResult = await speedTest(speedTestConfig)
    let speedTestModel = createSpeedtestModel(testResult.upload.bandwidth, testResult.download.bandwidth)
    database.saveToDB(speedTestModel)
}

//Creates Ping from Model & inputs
createPingModel = (ping) => {
    return new Ping({
        ping: ping
    });
};

//Creates Speedtest from Model & inputs
createSpeedtestModel = (up, down) => {
    return new Speedtest({
        speedUp: up,
        speedDown: down
    });
};