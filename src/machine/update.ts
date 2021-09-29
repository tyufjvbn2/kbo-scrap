const Data = require("../model/data");
import { ScrapDataInterface } from "../interface/interface";

export const update = (scrapData: ScrapDataInterface[]) => {
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
				updatedAt: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
			});
			console.log("end target?", target);
		} else if (ele.inning !== "경기전") {
			const target = await Data.findOneAndUpdate(updateKey, {
				inning: ele.inning,
				score: ele.score,
				baseState: ele.baseState,
				ballCount: ele.ballCount,
				detailScore: ele.detailScore,
				updatedAt: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
			});
			console.log("ongoin target?", target);
		}
	});
};
