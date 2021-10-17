const express = require('express')
const ping = require("ping")
const speedTest = require("speedtest-net")
const app = express()
const port = 7896

let speedTestConfig = {
        acceptLicense: true,
        acceptGdpr: true
}

app.get('/ping/metrics', async (req, res) => {
        console.log("Ping")
        let pingVar = await ping.promise.probe("speedtest.net")
        if (pingVar.time > 0.1) {
                res.send(`# HELP go_ping_time_ms Current ping time\n# TYPE go_ping_time_ms gauge\ngo_ping_time_ms ${pingVar.time}`)
        } else {
                res.status(503).send("No connection to internet")
        }

});

app.get('/bandwidth/metrics', async (req, res) => {
        console.log("Started speedtest")
        let success = true
        let testResult = await speedTest(speedTestConfig).catch(error => success = false)

        if (testResult.download != undefined) {
                console.log(testResult.download.bandwidth)
                res.send(`# HELP go_bandwidth_upload Current bandwidth up in bytes per second\n# TYPE go_bandwidth_upload gauge\ngo_bandwidth_upload ${testResult.upload.bandwidth}\n# HELP go_bandwidth_download Current bandwidth down in bytes per second\n# TYPE go_bandwidth_download gauge\ngo_bandwidth_download ${testResult.download.bandwidth}`)
        } else {
                res.status(503).send("No connection to internet")
        }
});


app.listen(port, () => {
        console.log("pucko")
});