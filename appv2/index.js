const express = require('express')
const ping = require("ping")
const app = express()
const port = 7896
app.get('/metrics', async (req, res) => {
        let pingVar = await ping.promise.probe("speedtest.net")
        console.log(pingVar)
        if (pingVar.time > 0.1) {
                res.send(`# HELP go_ping_time_ms Current ping time \n# TYPE go_ping_time_ms gauge\ngo_ping_time_ms ${pingVar.time}`)
        } else {
                res.status(503).send("No connection to internet")
        }

});

app.listen(port, () => {
        console.log("pucko")
});