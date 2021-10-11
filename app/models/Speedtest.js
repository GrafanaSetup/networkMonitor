const mongoose = require("mongoose");

//Creates the SpeedtestSchema and exports it
const SpeedtestSchema = new mongoose.Schema({
	speedUp: {
		type: String,
		required: true,
	},
    speedDown: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

const Speedtest = mongoose.model("Speedtest", SpeedtestSchema);

module.exports = Speedtest;