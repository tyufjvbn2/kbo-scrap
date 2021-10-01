import mongoose from "mongoose";

const Schema = mongoose.Schema;

// interface scoreBoard {
// 	1: string;
// 	2: string;
// 	3: string;
// 	4: string;
// 	5: string;
// 	6: string;
// 	7: string;
// 	8: string;
// 	9: string;
// 	10: string;
// 	11: string;
// 	12: string;
// 	R: string;
// 	E: string;
// 	H: string;
// 	B: string;
// }

// interface DetailScoreStucture {
// 	home: scoreBoard;
// 	away: scoreBoard;
// }

// const oldDataSchema = new Schema(
// 	{
// 		date: Date,
// 		placeTime: String,
// 		homeTeam: String,
// 		awayTeam: String,
// 		inning: String,
// 		score: String,
// 		baseState: [Number],
// 		ballCount: String,
// 		detailScore: Object,
// 		createdAt: Date,
// 		updatedAt: Date,
// 	},
// 	{ versionKey: false }
// );

const dataSchema = new Schema(
	{
		date: Date,
		place: String,
		time: String,
		homeTeam: String,
		awayTeam: String,
		homeTeamScore: Number,
		awayTeamScore: Number,
		presentRound: Number,
		presentQuarter: Number,
		baseStatus: String,
		etc: Object,
		url: String,
		createdAt: Date,
		updatedAt: Date,
	},
	{ versionKey: false }
);

module.exports = mongoose.model("Data", dataSchema, "data");
