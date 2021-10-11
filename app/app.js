//Init of dotenv for use with .env file
require("dotenv").config();

//Dependencies import
const ping = require("ping")
const speedTest = require("speedtest-net")

//Local Dependencies
const database = require("./database.js");
const Ping = require("./models/Ping.js");
const Speedtest = require("./models/Speedtest.js");

//Variable Initialize
const mongoURL = process.env.MONGOURL || "mongodb://localhost:27017/";

console.log(mongoURL)

//Connect to Mongo
database.connect("GrafanaPing", mongoURL);

let speedTestConfig = {
    acceptLicense: true,
    acceptGdpr: true
}

setInterval(newSpeedTest, 1800000)

setInterval(async () => {
    let pingVar = await ping.promise.probe("speedtest.net")
    console.log(pingVar.time);
    let pingModel = await createPingModel(pingVar.time);
    database.saveToDB(pingModel)
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