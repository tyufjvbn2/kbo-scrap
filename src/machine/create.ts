const Kbo_crawl = require("../model/data");
import { timeChanger } from "./timechange";
import { ScrapDataInterface } from "../interface/interface";
import { v4 } from "uuid";

export const create = (scrapData: ScrapDataInterface[]) => {
	console.log("data come?", scrapData);
	scrapData.forEach(async (ele) => {
		const uniqueKey = {
			start_time: ele.start_time,
			place: ele.place,
			home_team: ele.home_team,
			away_team: ele.away_team,
		};

		// console.log("unique key?", uniqueKey);    /* ---- recover  ------ */

		const searchData = await Kbo_crawl.findOne(uniqueKey);

		if (!searchData) {
			const play_key = v4().split("-").join("");

			console.log("url?", play_key);

			const newData = await Kbo_crawl.findOneAndUpdate(
				uniqueKey,
				{
					...ele,
					event: "kbo",
					play_key: play_key,
				},
				{
					upsert: true,
					returnOriginal: false,
				}
			);
		}

		// console.log("each data?", newData);
	});
};
