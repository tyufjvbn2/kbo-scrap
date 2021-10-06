import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
const Schema = mongoose.Schema;

const dataSchema = new Schema(
	{
		event: { type: String, required: true },
		home_team: { type: String, required: true },
		away_team: { type: String, required: true },
		start_time: { type: Number, required: true },
		update_time: { type: Number, required: true },
		play_info: { type: Object, requred: true },
		place: { type: String, required: true },
		play_key: { type: String, required: true, unique: true },
	},
	{
		versionKey: false,
		timestamps: {},
		autoIndex: process.env.NODE_ENV !== "production" ? true : false,
	}
);

dataSchema.index({ event: 1, play_key: 1 }, { unique: true });

module.exports = mongoose.model("crawling_data", dataSchema, "crawling_data");
