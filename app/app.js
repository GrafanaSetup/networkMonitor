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
const { InfluxDB } = require('@influxdata/influxdb-client')
const { Point } = require('@influxdata/influxdb-client')

// You can generate a Token from the "Tokens Tab" in the UI
const token = 'test_token'
const org = 'test_org'
const bucket = 'test_bucket'

const client = new InfluxDB({ url: 'http://localhost:8086', token: token })



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
  const writeApi = client.getWriteApi(org, bucket)
  writeApi.useDefaultTags({ host: 'host1' })
  const point = new Point('ping')
    .floatField('ms', pingVar.time)
  writeApi.writePoint(point)
  writeApi
    .close()
    .then(() => {
      console.log('FINISHED')
    })
    .catch(e => {
      console.error(e)
      console.log('\\nFinished ERROR')
    })
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