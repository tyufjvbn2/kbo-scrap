const Data = require("../model/data");
import { timeChanger } from "./timechange";
import { newScrapDataInterface } from "../interface/interface";

export const create = (scrapData: newScrapDataInterface[]) => {
	console.log("data come?", scrapData);
	scrapData.forEach(async (ele) => {
		const uniqueKey = {
			date: ele.date,
			place: ele.place,
			time: ele.time,
			// placeTime: ele.placeTime,
			homeTeam: ele.homeTeam,
			awayTeam: ele.awayTeam,
		};

		console.log("unique key?", uniqueKey);

		const newData = await Data.findOneAndUpdate(
			uniqueKey,
			{
				...ele,
				createdAt: timeChanger(new Date()),
				updatedAt: timeChanger(new Date()),
			},
			{
				upsert: true,
				returnOriginal: false,
			}
		);
		// console.log("each data?", newData);
	});
};
