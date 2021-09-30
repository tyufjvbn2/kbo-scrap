const Data = require("../model/data");
import { timeChanger } from "./timechange";
import { ScrapDataInterface } from "../interface/interface";

export const create = (scrapData: ScrapDataInterface[]) => {
	console.log("data come?", scrapData);
	scrapData.forEach(async (ele) => {
		const uniqueKey = {
			date: timeChanger(ele.date.split("(")[0]),
			placeTime: ele.placeTime,
			homeTeam: ele.homeTeam,
			awayTeam: ele.awayTeam,
		};

		console.log("unique key?", uniqueKey);

		const newData = await Data.findOneAndUpdate(
			uniqueKey,
			{
				...ele,
				date: timeChanger(ele.date.split("(")[0]),
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
