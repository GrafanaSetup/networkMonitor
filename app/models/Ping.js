const mongoose = require("mongoose");

//Creates the PingSchema and exports it
const PingSchema = new mongoose.Schema({
	ping: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

const Ping = mongoose.model("Ping", PingSchema);

module.exports = Ping;