const Kbo_crawl = require("../model/data");
import { v4 } from "uuid";
import { ScrapDataInterface } from "../interface/interface";
// import { timeChanger } from "./timechange";

export const update = (scrapData: ScrapDataInterface[]) => {
	// console.log("update come?", scrapData); /* ---- recover  ------ */
	scrapData.forEach(async (ele) => {
		const updateKey = {
			start_time: ele.start_time,
			place: ele.place,
			home_team: ele.home_team,
			away_team: ele.away_team,
		};

		const missData = await Kbo_crawl.findOne(updateKey);

		if (!missData) {
			const play_key = v4().split("-").join("");
			const pushData = await Kbo_crawl.findOneAndUpdate(
				updateKey,
				{
					...ele,
					event: "kbo",
					play_key: play_key,
				},
				{ upsert: true, returnOriginal: false }
			);
		}

		//경기 종료일때
		if (ele.play_info.present_round === 100) {
			const target = await Kbo_crawl.findOneAndUpdate(updateKey, {
				play_info: {
					present_round: ele.play_info.present_round,
					present_quarter: ele.play_info.present_quarter,
					home_team_score: ele.play_info.home_team_score,
					away_team_score: ele.play_info.away_team_score,
				},
				// updatedAt: timeChanger(new Date()),
			});
			console.log("end target?", target);
		} else if (ele.play_info.present_round !== -1) {
			//경기 시작전이 아닐때(진행중일때)
			const target = await Kbo_crawl.findOneAndUpdate(updateKey, {
				play_info: { ...ele.play_info },
				// updatedAt: timeChanger(new Date()),
			});
			console.log("ongoin target?", target);
			const used = process.memoryUsage();
			// for (let key in used) {
			console.log(
				`Memory:  ${
					Math.round((used.rss / 1024 / 1024) * 100) / 100
				} MB`
			);
			// }
		}
	});
};
