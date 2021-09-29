const Data = require("../model/data");
import { ScrapDataInterface } from "../interface/interface";

export const create = (scrapData: ScrapDataInterface[]) => {
	console.log("create come?", scrapData);
	scrapData.forEach(async (ele: any) => {
		const uniqueKey = {
			date: ele.date,
			placeTime: ele.placeTime,
			homeTeam: ele.homeTeam,
			awayTeam: ele.awayTeam,
		};

		console.log("search key?", uniqueKey);

		const newData = await Data.findOneAndUpdate(
			uniqueKey,
			{
				...ele,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				upsert: true,
				returnOriginal: false,
			}
		);
		// console.log("each data?", newData);
	});
};
