const Data = require("../model/data");
import { newScrapDataInterface } from "../interface/interface";
import { timeChanger } from "./timechange";

export const update = (scrapData: newScrapDataInterface[]) => {
	console.log("update come?", scrapData);
	scrapData.forEach(async (ele) => {
		const updateKey = {
			date: ele.date,
			place: ele.place,
			time: ele.time,
			// placeTime: ele.placeTime,
			homeTeam: ele.homeTeam,
			awayTeam: ele.awayTeam,
		};

		//경기 종료일때
		if (ele.presentRound === 100) {
			const target = await Data.findOneAndUpdate(updateKey, {
				presentRound: ele.presentRound,
				presentQuarter: ele.presentQuarter,
				homeTeamScore: ele.homeTeamScore,
				awayTeamScore: ele.awayTeamScore,
				// inning: ele.inning,
				// score: ele.score,
				// detailScore: ele.detailScore,
				updatedAt: timeChanger(new Date()),
			});
			console.log("end target?", target);
		} else if (ele.presentRound !== -1) {
			//경기 시작전이 아닐때(진행중일때)
			const target = await Data.findOneAndUpdate(updateKey, {
				presentRound: ele.presentRound,
				presentQuarter: ele.presentQuarter,
				homeTeamScore: ele.homeTeamScore,
				awayTeamScore: ele.awayTeamScore,
				baseStatus: ele.baseStatus,
				etc: ele.etc,
				// inning: ele.inning,
				// score: ele.score,
				// baseState: ele.baseState,
				// ballCount: ele.ballCount,
				// detailScore: ele.detailScore,
				updatedAt: timeChanger(new Date()),
			});
			console.log("ongoin target?", target);
		}
	});
};
