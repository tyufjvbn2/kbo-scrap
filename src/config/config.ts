import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DBconfig = {
	production: process.env.DATABASE,
	development: `${process.env.DATABASE}_dev`,
	test: `${process.env.DATABASE}_test`,
};

module.exports = () => {
	try {
		const connect = () => {
			if (DBconfig.production === undefined) {
				mongoose.set("debug", true);
			}

			mongoose.connect(
				`${process.env.DATABASE_HOST}/${DBconfig.production}`,
				{
					keepAlive: true,
					autoIndex: true,
				},
				(err) => {
					if (err) {
						console.log(
							"Mongo DB connection error on init : ",
							err
						);
					}
				}
			);
		};

		connect();

		mongoose.connection.on("disconnected", () => {
			console.log("Mongo DB connection have problem");
			console.log("Trying to reconnect......");
			connect();
		});

		mongoose.connection.on("connected", () => {
			console.log("Mongo connection on!");
		});
	} catch (err) {
		console.error("Error occured while trying reconnection : ", err);
	}
};
