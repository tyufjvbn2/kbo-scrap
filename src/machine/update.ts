const Data = require("../model/data");
// import { ScrapDataInterface } from "../interface/interface";

// import { ObjectId } from "mongoose";

// interface ScrapDataInterface {
// 	_id: ObjectId;
// 	date: Date;
// 	placeTime: string;
// 	homeTeam: string;
// 	awayTeam: string;
// 	inning: string;
// 	score: string;
// 	baseState: [number | undefined];
// 	ballCount: string;
// 	detailScore: object;
// 	createdAt: Date;
// 	updatedAt: Date;
// }

export const update = (scrapData) => {
	console.log("update come?", scrapData);
	scrapData.forEach(async (ele) => {
		const updateKey = {
			date: ele.date,
			placeTime: ele.placeTime,
			homeTeam: ele.homeTeam,
			awayTeam: ele.awayTeam,
		};

		if (ele.inning === "경기종료") {
			const target = await Data.findOneAndUpdate(updateKey, {
				inning: ele.inning,
				score: ele.score,
				detailScore: ele.detailScore,
			});
			console.log("end target?", target);
		} else if (ele.inning !== "경기전") {
			const target = await Data.findOneAndUpdate(updateKey, {
				inning: ele.inning,
				score: ele.score,
				baseState: ele.baseState,
				ballCount: ele.ballCount,
				detailScore: ele.detailScore,
			});
			console.log("ongoin target?", target);
		}
	});
};
