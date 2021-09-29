const Data = require("../model/data");
import { ScrapDataInterface } from "../interface/interface";

export const create = (scrapData: ScrapDataInterface[]) => {
	console.log("data come?", scrapData);
	scrapData.forEach(async (ele) => {
		const uniqueKey = {
			date: ele.date,
			placeTime: ele.placeTime,
			homeTeam: ele.homeTeam,
			awayTeam: ele.awayTeam,
		};

		console.log("unique key?", uniqueKey);

		const newData = await Data.findOneAndUpdate(
			uniqueKey,
			{
				...ele,
				createdAt: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
				updatedAt: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
			},
			{
				upsert: true,
				returnOriginal: false,
			}
		);
		// console.log("each data?", newData);
	});
};
